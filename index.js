class SSEServer {
  constructor (options) {
    const EventQueue = require('./lib/event-queue.js')
    this.options = options || {}
    this.eventQueue = new EventQueue(this.options)
    this._buf = ''
  }

  _onInputSocketReadable (chunk) {
    const util = require('./lib/util.js')
    if (chunk) {
      if (this.options.verbose) console.error('chunk', chunk.trim())
      this._buf += chunk
      while (this._buf.length) {
        const event = util.getObject(this._buf)
        if (event) {
          this._buf = this._buf.replace(event, '').trim()
          this.eventQueue.sendEvent(JSON.parse(event))
        } else {
          console.error('event not found', this._buf)
          break
        }
      }
    }
  }

  createServer () {
    const http = require('http')
    const sse = http.createServer((req, res) => {
      this.eventQueue.attachResponse(res)
      this.eventQueue.flush()
    })

    const net = require('net')
    const input = net.createServer(connection => {
      connection.setEncoding('utf8')
      connection.on('data', this._onInputSocketReadable.bind(this))
      connection.on('error', err => {
        if (err.code !== 'ECONNRESET') console.log(err)
      })
    })

    return { sse, input }
  }
}

module.exports = SSEServer
