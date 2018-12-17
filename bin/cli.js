#!/usr/bin/env node
const SSEServer = require('../')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean }
]
const options = commandLineArgs(optionDefinitions)
const sseServer = new SSEServer(options)
const server = sseServer.createServer()
server.sse.listen(9000, () => console.log('SSE server: http://localhost:9000'))
server.input.listen(9090, () => console.log('Input socket: localhost:9090'))
