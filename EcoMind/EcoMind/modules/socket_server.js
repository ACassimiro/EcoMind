var database = require('./database.js');

var io = null;

var sockets = [];

function initialize(socketServer) {
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

var callbacks = {

    test: function (msg, fn) {
        if (msg !== null && msg !== undefined) {
            console.log('info', msg.info);
        }
    }
};