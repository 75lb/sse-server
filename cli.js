const SSEResponse = require('./sse-response.js')

const sseResponse = new SSEResponse()

function onReadable (chunk) {
  const util = require('./util.js')
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

const http = require('http')
const server = http.createServer((req, res) => {
  sseResponse.attachResponse(res)
  sseResponse.flush()
})
server.listen(9000, () => console.log('http://localhost:9000'))

const net = require('net')
const socketServer = net.createServer(connection => {
  console.log('connection')
  connection.setEncoding('utf8')
  connection.on('end', () => {
    console.log('end')
  })
  connection.on('data', onReadable)
  connection.on('error', err => {
    if (err.code !== 'ECONNRESET') console.log(err)
  })
})
socketServer.listen(9090, () => console.log('Socket port 9090'))
