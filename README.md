A demo of a bunyan shim to the winston logging system to enable
using a Winston logging setup with restify (which uses bunyan
logging internally).


# Baseline server: just-restify.js

client:

    $ curl -i http://0.0.0.0:8080/ping
    HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: 6
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Headers: Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version
    Access-Control-Allow-Methods: GET
    Access-Control-Expose-Headers: X-Api-Version, X-Request-Id, X-Response-Time
    Connection: Keep-Alive
    Content-MD5: C99yNl2XblAeEPCZTW1AXA==
    Date: Mon, 24 Dec 2012 22:39:46 GMT
    Server: myapp
    X-Api-Version: 1.0.0
    X-Request-Id: e22c1ab0-4337-456d-a6ed-3f6d02988a3d
    X-Response-Time: 1

    "pong"

server:

    $ node just-restify.js
    myapp listening at http://0.0.0.0:8080



# Default logging: restify-bunyan.js

Client behaviour is the same as above.

server:

    $ node restify-logging.js
    {"name":"myapp","hostname":"banana.local","pid":29918,"level":30,"msg":"myapp listening at http://0.0.0.0:8080","time":"2012-12-24T22:44:40.735Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":29918,"level":10,"msg":"New Request:\n\nGET /ping HTTP/1.1\nuser-agent: curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3\nhost: 0.0.0.0:8080\naccept: */*\n","time":"2012-12-24T22:44:46.096Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":29918,"route":"GET /ping (1.0.0)","level":10,"req":{"method":"GET","url":"/ping","headers":{"user-agent":"curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3","host":"0.0.0.0:8080","accept":"*/*"},"remoteAddress":"127.0.0.1","remotePort":63168},"msg":"starting request chain","time":"2012-12-24T22:44:46.097Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":29918,"route":"GET /ping (1.0.0)","level":10,"msg":"running ","time":"2012-12-24T22:44:46.098Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":29918,"route":"GET /ping (1.0.0)","req_id":"dc30e931-8e4d-4e15-92c1-d79d8293efd2","level":10,"msg":"format entered(type=undefined)","time":"2012-12-24T22:44:46.098Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":29918,"route":"GET /ping (1.0.0)","req_id":"dc30e931-8e4d-4e15-92c1-d79d8293efd2","level":10,"msg":"format(application/json) returning: \"pong\"","time":"2012-12-24T22:44:46.098Z","v":0}
    {"name":"myapp","hostname":"banana.local","pid":29918,"route":"GET /ping (1.0.0)","req_id":"dc30e931-8e4d-4e15-92c1-d79d8293efd2","level":10,"res":{"statusCode":200},"msg":"response sent","time":"2012-12-24T22:44:46.100Z","v":0}

server (pretty):

    $ node restify-logging.js | bunyan
    [2012-12-24T22:45:35.800Z]  INFO: myapp/29973 on banana.local: myapp listening at http://0.0.0.0:8080
    [2012-12-24T22:45:38.849Z] TRACE: myapp/29973 on banana.local:
        New Request:

        GET /ping HTTP/1.1
        user-agent: curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3
        host: 0.0.0.0:8080
        accept: */*

    [2012-12-24T22:45:38.850Z] TRACE: myapp/29973 on banana.local: starting request chain (route="GET /ping (1.0.0)", req.remoteAddress=127.0.0.1, req.remotePort=63171)
        GET /ping HTTP/1.1
        user-agent: curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3
        host: 0.0.0.0:8080
        accept: */*
    [2012-12-24T22:45:38.850Z] TRACE: myapp/29973 on banana.local: running  (route="GET /ping (1.0.0)")
    [2012-12-24T22:45:38.851Z] TRACE: myapp/29973 on banana.local: format entered(type=undefined) (req_id=49055046-af5b-4924-8bfd-e5769b5f3b86, route="GET /ping (1.0.0)")
    [2012-12-24T22:45:38.851Z] TRACE: myapp/29973 on banana.local: format(application/json) returning: "pong" (req_id=49055046-af5b-4924-8bfd-e5769b5f3b86, route="GET /ping (1.0.0)")
    [2012-12-24T22:45:38.853Z] TRACE: myapp/29973 on banana.local: response sent (req_id=49055046-af5b-4924-8bfd-e5769b5f3b86, route="GET /ping (1.0.0)")


# Winston logging: restify-winston.js

Client behaviour is the same as above.

server:

    $ node restify-winston.js
    info: myapp listening at http://0.0.0.0:8080
    info: New Request:

    GET /ping HTTP/1.1
    user-agent: curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3
    host: 0.0.0.0:8080
    accept: */*
     name=myapp, hostname=banana.local, pid=30976, time=Mon Dec 24 2012 21:26:06 GMT-0800 (PST)
    info: starting request chain name=myapp, hostname=banana.local, pid=30976, route=GET /ping (1.0.0), method=GET, url=/ping, user-agent=curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8r zlib/1.2.3, host=0.0.0.0:8080, accept=*/*, remoteAddress=127.0.0.1, remotePort=63309, time=Mon Dec 24 2012 21:26:06 GMT-0800 (PST)
    info: running  name=myapp, hostname=banana.local, pid=30976, route=GET /ping (1.0.0), time=Mon Dec 24 2012 21:26:06 GMT-0800 (PST)
    info: format entered(type=undefined) name=myapp, hostname=banana.local, pid=30976, route=GET /ping (1.0.0), req_id=75f18298-81ab-4dcf-9c55-334ca7677e47, time=Mon Dec 24 2012 21:26:06 GMT-0800 (PST)
    info: format(application/json) returning: "pong" name=myapp, hostname=banana.local, pid=30976, route=GET /ping (1.0.0), req_id=75f18298-81ab-4dcf-9c55-334ca7677e47, time=Mon Dec 24 2012 21:26:06 GMT-0800 (PST)
    info: response sent name=myapp, hostname=banana.local, pid=30976, route=GET /ping (1.0.0), req_id=75f18298-81ab-4dcf-9c55-334ca7677e47, statusCode=200, headers=undefined, time=Mon Dec 24 2012 21:26:06 GMT-0800 (PST)
