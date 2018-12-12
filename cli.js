const util = require('./util.js')

process.stdin.setEncoding('utf8')

/* should be a stream managing backpressure */
class SSEResponse {
  constructor () {
    this.events = []
  }

  attachResponse (res) {
    this._res = res
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*'
    })
  }

  sendEvent (event) {
    if (this._res) {
      this._res.write(`event: ${event.name}\n`)
      this._res.write(`data: ${JSON.stringify(event.data)}\n\n`)
    } else {
      this.events.push(event)
    }
  }

  flush () {
    // console.error(require('util').inspect(this.events, { depth: 6, colors: true }))
    let event
    while (event = this.events.shift()) {
      this.sendEvent(event)
    }
  }

  end () {
    if (this._res) this._res.end()
  }
}

const sseResponse = new SSEResponse()

process.stdin.on('readable', function () {
  let chunk = this.read()
  if (chunk) {
    chunk = chunk.trim()
    console.error('chunk', chunk)
    while (chunk.length) {
      const event = util.getObject(chunk)
      if (event) {
        chunk = chunk.replace(event, '').trim()
        sseResponse.sendEvent(JSON.parse(event))
      }
    }
  }
})

process.on('beforeExit', () => {
  console.log('beforeExit')
  sseResponse.end()
})
process.on('SIGINT', () => {
  sseResponse.end()
  process.exit(0)
})


const http = require('http')
const server = http.createServer((req, res) => {
  sseResponse.attachResponse(res)
  sseResponse.flush()
})
server.listen(9000, () => console.log('http://localhost:9000'))

// process.stdin.on('end', function () {
//   console.log('done')
//   server.close()
// })
