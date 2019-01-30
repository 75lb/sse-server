[![view on npm](https://img.shields.io/npm/v/sse-server.svg)](https://www.npmjs.org/package/sse-server)
[![npm module downloads](https://img.shields.io/npm/dt/sse-server.svg)](https://www.npmjs.org/package/sse-server)
[![Build Status](https://travis-ci.org/75lb/sse-server.svg?branch=master)](https://travis-ci.org/75lb/sse-server)
[![Dependency Status](https://badgen.net/david/dep/75lb/sse-server)](https://david-dm.org/75lb/sse-server)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# sse-server

Pipe an event stream from terminal to browser.

## Synopsis

Launch the server.

```
$ sse-server
SSE server: http://localhost:9000
Input socket: localhost:9090
```

Pipe events to the input socket.

```
$ echo '{ "name": "something", "data": "one" }' | nc -c localhost 9090
$ echo '{ "name": "something", "data": "two" }' | nc -c localhost 9090
```

Connect a browser to the SSE server to consume the [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

```
$ curl http://localhost:9000
event: something
data: "one"

event: something
data: "two"
```

* * *

&copy; 2018-19 Lloyd Brookes \<75pound@gmail.com\>.