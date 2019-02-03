#!/usr/bin/env node
const SSEServer = require('../')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'input-port', alias: 'i', defaultValue: 9090, type: Number },
  { name: 'http-port', alias: 'p', defaultValue: 9000, type: Number },
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'help', alias: 'h', type: Boolean }
]
const options = commandLineArgs(optionDefinitions, { camelCase: true })
if (options.help) {
  const commandLineUsage = require('command-line-usage')
  const usage = commandLineUsage([
    {
      header: 'sse-server',
      content: 'Pipe an object stream from terminal to browser.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      content: 'For more info see: https://github.com/75lb/sse-server'
    }
  ])
  console.error(usage)
} else {
  const sseServer = new SSEServer(options)
  const server = sseServer.createServer()
  server.sse.listen(options.httpPort, () => console.error(`SSE server: http://localhost:${options.httpPort}`))
  process.on('SIGINT', () => {
    sseServer.eventQueue.end()
    process.exit(0)
  })
  if (!process.stdin.isTTY) {
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', sseServer._onInputSocketReadable.bind(sseServer))
  } else {
    server.input.listen(options.inputPort, () => console.error(`Input socket: localhost:${options.inputPort}`))
  }
}
