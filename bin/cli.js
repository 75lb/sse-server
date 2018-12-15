#!/usr/bin/env node
const SSEServer = require('../')
const sseServer = new SSEServer()
const server = sseServer.createServer()
server.sse.listen(9000, () => console.log('SSE server: http://localhost:9000'))
server.input.listen(9090, () => console.log('Input socket: localhost:9090'))
