const util = require('./util.js')
const fs = require('fs')
const path = require('path')
const SSEResponse = require('./sse-response.js')

const sseResponse = new SSEResponse()

function onReadable (chunk) {
  console.error('chunk', chunk)
  if (chunk) {
    chunk = chunk.trim()
    while (chunk.length) {
      const event = util.getObject(chunk)
      if (event) {
        chunk = chunk.replace(event, '').trim()
        sseResponse.sendEvent(JSON.parse(event))
      } else {
        console.error('event not found', chunk)
        break
      }
    }
  }
}

class FifoReader {
  constructor () {
    this.terminating = false
    const os = require('os')
    this.fifoPath = path.resolve(os.homedir(), 'SSE')
  }
  createFifo () {
    const fifo = this.fifo = fs.createReadStream(this.fifoPath)
    fifo.setEncoding('utf8')
    fifo.on('close', () => {
      console.log('fifo close')
      if (!this.terminating) this.createFifo()
    })
    // fifo.on('data', onReadable)
    fifo.on('readable', () => {
      onReadable(fifo.read())
    })
  }
}

const fifoReader = new FifoReader()
fifoReader.createFifo()

process.on('beforeExit', () => {
  console.log('beforeExit')
  sseResponse.end()
})

process.on('SIGINT', () => {
  fifoReader.terminating = true
  console.log('SIGINT')
  sseResponse.end()
  fifoReader.fifo.close()
  fifoReader.fifo.push(null)
  fifoReader.fifo.read(0)
})

const http = require('http')
const server = http.createServer((req, res) => {
  sseResponse.attachResponse(res)
  sseResponse.flush()
})
server.listen(9000, () => console.log('http://localhost:9000'))
