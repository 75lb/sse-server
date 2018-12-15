/* should be a stream managing backpressure */
class SSEResponse {
  constructor () {
    this.backlog = []
    process.on('SIGINT', () => {
      console.log('SIGINT')
      this.end()
      process.exit(0)
    })
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
      this.backlog.push(event)
      console.log('backlog: ', this.backlog.length)
    }
  }

  flush () {
    // console.error(require('util').inspect(this.backlog, { depth: 6, colors: true }))
    let event
    while (event = this.backlog.shift()) {
      this.sendEvent(event)
    }
  }

  end () {
    if (this._res) this._res.end()
  }
}

module.exports = SSEResponse
