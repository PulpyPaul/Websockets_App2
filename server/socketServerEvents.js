const xxh = require('xxhashjs');

// socket io instance
let io;

const players = {};


// setup socket server
const setupSockets = (ioInstance) => {
  io = ioInstance;

  io.sockets.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');

    // taken from previous assignment, creates unique hash for user
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    socket.hash = hash;

    players[hash] = {
      x: 0,
      y: 0,
      next_X: 0,
      next_Y: 0,
      last_X: 0,
      last_Y: 0,
      width: 50,
      height: 50,
      moveLeft: false,
      moveRight: false,
      hash,
      percent: 0
    };

    socket.emit('join', players[hash]);

    socket.on('updateLocation', (data) => {
      players[socket.hash] = data;
      io.sockets.in('room1').emit('updatePlayer', players[socket.hash]);
    });

    socket.on('disconnect', () => {
      delete players[socket.hash];
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
