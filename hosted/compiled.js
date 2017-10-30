"use strict";

// Lerp function
var lerp = function lerp(start, end, percent) {
    return (1 - percent) * start + percent * end;
};

// Draws all data to the canvas
var draw = function draw() {
    updateLocation();

    // Clears the canvas
    ctx.clearRect(0, 0, 500, 500);

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

        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    requestAnimationFrame(draw);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0;
var players = {};
var speed = void 0;

var init = function init() {
    speed = 5;

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    socket = io.connect();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    socket.on('join', addUser);
    socket.on('updatePlayer', updatePlayer);
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
    player.last_y = player.y;

    if (player.moveLeft && player.next_X > 0) {
        player.next_X -= 2;
    }

    if (player.moveRight && player.next_X < 400) {
        player.next_X += 2;
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
    player.last_y = data.last_y;
    player.next_X = data.next_X;
    player.next_Y = data.next_Y;
    player.moveLeft = data.moveLeft;
    player.moveRight = data.moveRight;
    player.percent = 0.05;
};
"use strict";

// Keydown event
var handleKeyDown = function handleKeyDown(e) {
    var key = e.which;

    // A 
    if (key === 65) {
        players[hash].moveLeft = true;
    }
    // D
    else if (key === 68) {
            players[hash].moveRight = true;
        }

    // space
    if (key === 32) {
        players[hash].y -= 200;
    }
};

// Keyup event
var handleKeyUp = function handleKeyUp(e) {
    var key = e.which;

    // A 
    if (key === 65) {
        players[hash].moveLeft = false;
    }
    // D
    else if (key === 68) {
            players[hash].moveRight = false;
        }
};
