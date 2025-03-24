const { Server } = require('socket.io');
const bookController = require('./controller/bookController');

let io;

const initSocket = (server) => {
    io = new Server(server);
}