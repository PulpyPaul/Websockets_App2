"use strict";

// Lerp function
var lerp = function lerp(start, end, percent) {
    return (1 - percent) * start + percent * end;
};

// Draws all data to the canvas
var draw = function draw() {
    updateLocation();

    // Clears the canvas
    ctx.clearRect(0, 0, 750, 750);

    var keys = Object.keys(players);

    for (var i = 0; i < keys.length; i++) {
        var player = players[keys[i]];

        if (player.percent < 1) {
            player.percent += 0.05;
        }

        if (player.hash === hash) {
            // do something to the specific character
        }

        player.x = lerp(player.last_X, player.next_X, player.percent);
        player.y = lerp(player.last_Y, player.next_Y, player.percent);

        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(draw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0; // holds unique user ID
var players = {}; // holds all player data
var users = {}; // holds user count data
var speed = void 0; // speed of all players
var readyButton = void 0; // button to ready up the user
var userInfo = void 0; // information about all users
var readyStatus = void 0; // status if the user is ready

var init = function init() {

    readyStatus = false;
    speed = 5;

    // Get reference to necessary HTML elements
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    readyButton = document.querySelector('#readyButton');
    userInfo = document.querySelector('#userInfo');

    // Gets socket.io instance
    socket = io.connect();

    // Setup Events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    readyButton.onclick = handleReadyUp;

    socket.on('join', addUser);
    socket.on('updatePlayer', updatePlayer);
    socket.on('updateReady', updateReady);
};

window.onload = init;
'use strict';

// Adds user's data and starts animating
var addUser = function addUser(data) {
    hash = data.hash;
    players[hash] = data;
    requestAnimationFrame(draw);
};

// Updates player's location and sends it to server
var updateLocation = function updateLocation() {
    var player = players[hash];

    player.last_X = player.x;
    player.last_Y = player.y;

    if (player.moveLeft && player.next_X > 0) {
        player.next_X -= speed;
    }

    if (player.moveRight && player.next_X < 725) {
        player.next_X += speed;
    }

    if (player.moveDown && player.next_Y < 725) {
        player.next_Y += speed;
    }

    if (player.moveUp && player.next_Y > 0) {
        player.next_Y -= speed;
    }

    player.percent = 0.05;

    socket.emit('updateLocation', player);
};

var updatePlayer = function updatePlayer(data) {
    if (!players[data.hash]) {
        players[data.hash] = data;
        return;
    }

    var player = players[data.hash];

    player.last_X = data.last_X;
    player.last_Y = data.last_Y;
    player.next_X = data.next_X;
    player.next_Y = data.next_Y;
    player.moveLeft = data.moveLeft;
    player.moveRight = data.moveRight;
    player.moveUp = data.moveUp;
    player.moveDown = data.moveDown;
    player.percent = 0.05;
};

var updateReady = function updateReady(data) {

    users = data;

    // updates the ready status if a user disconnected
    if (users.ready == 0) {
        readyStatus = false;
    }

    // prevents the user from readying more than once
    if (readyStatus) {
        readyButton.disabled = true;
    } else {
        readyButton.disabled = false;
    }

    userInfo.innerHTML = 'Players: ' + users.count + ' \nReady: ' + users.ready;
};
'use strict';

// Keydown event
var handleKeyDown = function handleKeyDown(e) {
    var key = e.which;

    // WASD
    if (key === 65) {
        players[hash].moveLeft = true;
    } else if (key === 68) {
        players[hash].moveRight = true;
    } else if (key === 87) {
        players[hash].moveUp = true;
    } else if (key === 83) {
        players[hash].moveDown = true;
    }
};

// Keyup event
var handleKeyUp = function handleKeyUp(e) {
    var key = e.which;

    // WASD
    if (key === 65) {
        players[hash].moveLeft = false;
    } else if (key === 68) {
        players[hash].moveRight = false;
    } else if (key === 87) {
        players[hash].moveUp = false;
    } else if (key === 83) {
        players[hash].moveDown = false;
    }
};

var handleReadyUp = function handleReadyUp() {
    readyStatus = true;
    socket.emit('userReady', readyStatus);
};
