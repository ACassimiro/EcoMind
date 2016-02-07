var database = require('./database.js');

var io = null;

var sockets = [];
var formidable = require('formidable');
var url = require('url');

function initialize(socketServer) {
    console.log("Initialize socket server");
    io = socketServer;
    io.sockets.on('connection', onConnect);
}

function onConnect(socket) {
    var user = {
        'id': socket.id, // legacy, but good anyway.
        'socket': socket,
        'userName': socket.handshake.user,
        'session': socket.handshake.session
    };
    sockets.push(user);


/*
    database['users'].loadSupervisor(operator.userName, function (err, isSupervisor) {
        if (err && !isSupervisor) {
            console.error('socket_api.onConnect: Error while retrieving client list. Setting list to []. Error:', err);
            isSupervisor = false;
        } else {
            isSupervisor = isSupervisor.supervisor;
        }
    });*/
}

function test(req, res) {
    if (req.method.toLowerCase() === 'post') {
        console.log("FUCKKK", req);
        res.writeHead(200);
        res.end();
    }   

}


function requestListener(req, res) {
  switch (url.parse(req.url).pathname) {
        case '/index.html':
            test(req, res);
            break;
        case '/socket.html':
            test(req, res);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;