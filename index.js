class SSEServer {
  constructor () {
    const SSEResponse = require('./lib/sse-response.js')
    this.sseResponse = new SSEResponse()
  }

  onReadable (chunk) {
    const util = require('./lib/util.js')
    if (chunk) {
      chunk = chunk.trim()
      // console.error('chunk', chunk)
      while (chunk.length) {
        const event = util.getObject(chunk)
        if (event) {
          chunk = chunk.replace(event, '').trim()
          this.sseResponse.sendEvent(JSON.parse(event))
        } else {
          console.error('event not found', chunk)
          break
        }
      }
    }
  }

  createServer () {
    const http = require('http')
    const sse = http.createServer((req, res) => {
      this.sseResponse.attachResponse(res)
      this.sseResponse.flush()
    })

    const net = require('net')
    const input = net.createServer(connection => {
      connection.setEncoding('utf8')
      connection.on('data', this.onReadable.bind(this))
      connection.on('error', err => {
        if (err.code !== 'ECONNRESET') console.log(err)
      })
    })

    return { sse, input }
  }
}

module.exports = SSEServer
