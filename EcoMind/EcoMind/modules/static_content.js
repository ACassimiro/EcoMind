/** @module modules/static_content
 * @requires node-static
 * @requires util
 * @requires Server
 */

var static = require('node-static'),
    util = require('util'),
    server = require('./server.js');

/**
 *  Initiate a static server that will serve the system from the directory passed as the first argument.
 */
var staticServer = new(static.Server)(server.server.staticContentRoot, {
    cache: server.server.staticContentExpire,
    headers: {
        'X-Powered-By': 'node-static',
        'Cache-Control': 'no-cache, must-revalidate'
    }
});

/**
 * RESTful request router.
 *
 * @param {http.IncomingMessage} req Request dictionary. See {@link http://nodejs.org/api/http.html#http_http_incomingmessage | details}.
 * @param {http.ServerResponse} res Response object. See {@link http://nodejs.org/api/http.html#http_class_http_serverresponse | details}.
 */
function requestListener(req, res) {
    staticServer.serve(req, res, function (err, result) {
        if (err) {
            console.log('staticServer: %s: %s @ %s', err.status, err.message, req.url);
            if (err.status === 404 || err.status === 500) {
                staticServer.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
            } else {
                res.writeHead(200);
                res.end(JSON.stringify(err.status));
            }
        }
    });
}

exports.requestListener = requestListener;