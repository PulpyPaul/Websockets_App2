// Necessary for getting unique user ID
const xxh = require('xxhashjs');

// reference to physics class
const physics = require('./physics.js');

// holds all player data
const players = {};

// number of users
const users = {
  count: 0,
  ready: 0,
};

// socket io instance
let io;

// setup socket server
const setupSockets = (ioInstance) => {
  io = ioInstance;

  io.sockets.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');

    users.count++;

    // taken from previous assignment, creates unique hash for user
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    socket.hash = hash;
      
    let location = {x: getRandomInt(0, 775), y: getRandomInt(0, 375)};

    // creates a player object for a given ID
    players[hash] = {
      x: location.x,
      y: location.y,
      next_X: location.x,
      next_Y: location.y,
      last_X: location.x,
      last_Y: location.y,
      width: 25,
      height: 25,
      moveLeft: false,
      moveRight: false,
      moveUp: false,
      moveDown: false,
      percent: 0,
      color: 'red',
      hash,
      seeker: false,
      alive: true
    };

    // gives the user a hash ID and gives them their object
    socket.emit('join', players[hash]);

    // updates the user and ready count for all clients
    io.sockets.in('room1').emit('updateReady', users);

    // updates the location of all players
    socket.on('updateLocation', (data) => {
      players[socket.hash] = data;
      io.sockets.in('room1').emit('updatePlayer', players[socket.hash]);
    });

    // updates the user and ready count for all clients
    socket.on('userReady', () => {
      users.ready++;
      io.sockets.in('room1').emit('updateReady', users);

      // If all users are ready, select a seeker and start the game
      if (users.count === users.ready && users.count > 1) {
        const keys = Object.keys(players);
        const randomInt = Math.floor(Math.random() * users.count);

        for (let i = 0; i < keys.length; i++) {
          if (i === randomInt) {
            players[keys[i]].seeker = true;
          } else {
            players[keys[i]].seeker = false;
          }
        }

        io.sockets.in('room1').emit('startGame', players);
      }
    });

    // handles disconnection changes
    socket.on('disconnect', () => {
      users.count--;
      users.ready = 0;
      delete players[socket.hash];
      io.sockets.in('room1').emit('updateReady', users);
      socket.leave('room1');
    });
      
    socket.on('startPhysics', () => {
      physics.startPhysics(players);
    });
  });
};

const handleCollision = (playerObj) => {
    io.sockets.in('room1').emit('updateDeath', playerObj);
};

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.setupSockets = setupSockets;
module.exports.handleCollision = handleCollision;
