#!/usr/bin/env node
// A simple base restify server. A baseline for comparison with
// the other servers here.

var restify = require('restify');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'myapp',
    level: 'trace'
});

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0',
    log: log
});

server.get('/ping', function (req, res, next) {
    res.send('pong');
    return next();
});

server.listen(8080, function () {
    log.info('%s listening at %s', server.name, server.url);
});
