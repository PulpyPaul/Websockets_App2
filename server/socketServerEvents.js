// Necessary for getting unique user ID
const xxh = require('xxhashjs');

// holds all player data
const players = {};

// number of users
const users = {
    count: 0,
    ready: 0
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
    
    // creates a player object for a given ID
    players[hash] = {
        x: 0,
        y: 0,
        next_X: 0,
        next_Y: 0,
        last_X: 0,
        last_Y: 0,
        width: 25,
        height: 25,
        moveLeft: false,
        moveRight: false,
        moveUp: false,
        moveDown: false,
        percent: 0,
        color: 'red',
        hash: hash,
        seeker: false
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
    socket.on('userReady', (data) => {
      users.ready++;
      io.sockets.in('room1').emit('updateReady', users);
      
      // If all users are ready, select a seeker and start the game  
      if (users.count == users.ready && users.count > 1){
          let keys = Object.keys(players);
          let randomInt = Math.floor(Math.random() * users.count);
       
          for (let i = 0; i < keys.length; i++){
              if (i == randomInt){
                  players[keys[i]].seeker = true;
              } else {
                  players[keys[i]].seeker = false;
              }
          }
          
          io.sockets.in('room1').emit('startGame', players);
          console.log("called");
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
  });
};

module.exports.setupSockets = setupSockets;
