/* should be a stream managing backpressure */
class EventQueue {
  constructor (options) {
    this.options = options || {}
    this.backlog = []
    this.stored = []
  }

  attachResponse (res) {
    this._res = res
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*'
    })
  }

  sendEvent (event, flushing) {
    if (event.name === 'clear') {
      this.stored = []
    }
    if (event.name === 'setup' && !flushing) {
      this.stored.push(event)
      // console.log('stored: ', this.stored.length)
    }
    if (this._res) {
      const name = `event: ${event.name}\n`
      const data = `data: ${JSON.stringify(event.data)}\n\n`
      this._res.write(name)
      this._res.write(data)
      if (this.options.verbose) {
        console.error('Sending SSE:')
        process.stderr.write(name + data)
      }
    } else {
      this.backlog.push(event)
      console.log('backlog: ', this.backlog.length)
    }
  }

  flush () {
    for (const event of this.stored) {
      this.sendEvent(event, true)
    }
    while (this.backlog.length) {
      const event = this.backlog.shift()
      this.sendEvent(event)
    }
  }

  end () {
    if (this._res) this._res.end()
  }
}

module.exports = EventQueue
