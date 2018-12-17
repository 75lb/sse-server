class SSEServer {
  constructor (options) {
    const SSEResponse = require('./lib/sse-response.js')
    this.sseResponse = new SSEResponse()
    this.options = options || {}
    this.buf = ''
  }

  onReadable (chunk) {
    const util = require('./lib/util.js')
    if (chunk) {
      if (this.options.verbose) console.error('chunk', chunk)
      this.buf += chunk.trim()
      while (this.buf.length) {
        const event = util.getObject(this.buf)
        if (event) {
          this.buf = this.buf.replace(event, '').trim()
          this.sseResponse.sendEvent(JSON.parse(event))
        } else {
          console.error('event not found', this.buf)
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
