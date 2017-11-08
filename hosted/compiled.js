'use strict';

// Lerp function
var lerp = function lerp(start, end, percent) {
    return (1 - percent) * start + percent * end;
};

// Draws all data to the canvas
var draw = function draw() {
    updateLocation();

    // Clears the canvas
    ctx.clearRect(0, 0, 600, 400);

    var keys = Object.keys(players);

    for (var i = 0; i < keys.length; i++) {
        var player = players[keys[i]];

        if (player.percent < 1) {
            player.percent += 0.05;
        }

        player.x = lerp(player.last_X, player.next_X, player.percent);
        player.y = lerp(player.last_Y, player.next_Y, player.percent);

        if (player.seeker) {
            player.color = 'red';
        } else {
            player.color = 'black';
        }

        ctx.fillStyle = player.color;

        // Draws only this client if they are the seeker, otherwise draw all players
        if (players[hash].seeker && player.seeker) {
            ctx.fillRect(player.x, player.y, player.width, player.height);
        } else if (!players[hash].seeker || showLocations) {
            if (player.alive) {
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
        }
    }

    animationFrame = requestAnimationFrame(draw);
};

// https://stackoverflow.com/questions/29649643/how-to-create-a-circular-countdown-timer-using-html-css-or-javascript
var drawTimer = function drawTimer() {
    maxTime = 30; /* how long the timer runs for */
    var initialOffset = '440';
    gameTimer = 0;
    timerInterval = setInterval(function () {
        $('.circle_animation').css('stroke-dashoffset', initialOffset - gameTimer * (initialOffset / maxTime));
        $('h2').text(gameTimer);
        if (gameTimer == maxTime + 1) {
            gameOver = true;
            updateLivingCount();
            $('svg').hide();
            clearInterval(timerInterval);
        }
        gameTimer++;
    }, 1000);
};

var drawGameOver = function drawGameOver() {

    // Draws black cover screen
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draws 'Game Over' text
    ctx.fillStyle = 'red';
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText("Ready up to play again!", canvas.width / 2, canvas.height / 2);
};
'use strict';

var canvas = void 0;
var ctx = void 0;
var socket = void 0;
var hash = void 0; // holds unique user ID
var players = {}; // holds all player data
var users = {}; // holds users information
var speed = void 0; // speed of all players
var readyButton = void 0; // button to ready up the user
var userInfo = void 0; // information about all users
var readyStatus = void 0; // status if the user is ready
var showLocations = void 0; // shows all client locations
var animationFrame = void 0; // holds reference to requestAnimationFrame
var marcoCallCount = 0; // how many times the seekers called marco
var gameTimer = void 0; // how long the game has been running
var maxTime = void 0; // max time of a game
var gameOver = false; // if the game is over
var marcoWins = false; // if marco wins
var timerInterval = void 0;

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

    // Hides elements that don't need to be shown yet
    $('h2').hide();

    socket.on('join', addUser);
    socket.on('updatePlayer', updatePlayer);
    socket.on('updateReady', updateReady);
    socket.on('startGame', startGame);
    socket.on('updateDeath', updateDeath);
    socket.on('restartRound', resetGame);
};

window.onload = init;
'use strict';

// Adds user's data and starts animating
var addUser = function addUser(data) {
    hash = data.hash;
    players[hash] = data;
};

// Updates player's location and sends it to server
var updateLocation = function updateLocation() {
    var player = players[hash];

    player.last_X = player.x;
    player.last_Y = player.y;

    if (player.moveLeft && player.next_X > 0) {
        player.next_X -= speed;
    }

    if (player.moveRight && player.next_X < 575) {
        player.next_X += speed;
    }

    if (player.moveDown && player.next_Y < 375) {
        player.next_Y += speed;
    }

    if (player.moveUp && player.next_Y > 0) {
        player.next_Y -= speed;
    }

    socket.emit('updateLocation', player);
};

var updatePlayer = function updatePlayer(data) {
    if (!players[data.hash]) {
        players[data.hash] = data;
        return;
    }

    if (hash == data.hash) {
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

    // updates number of users in the room and the number of them ready/alive
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

    updateUserInfo();
};

var startGame = function startGame(data) {
    // Starts animating
    players = data;
    requestAnimationFrame(draw);
    $('svg').show();
    socket.emit('startPhysics');
    updateLivingCount();
    drawTimer();
};

var updateDeath = function updateDeath(data) {
    players[data.hash].alive = data.alive;
    updateLivingCount();
};

var resetGame = function resetGame() {
    resetReady();
    resetLiving();
    resetPosition();
    marcoCallCount = 0;
    clearScreen();
    clearInterval(timerInterval);
    drawGameOver();
};
'use strict';

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
var getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var updateUserInfo = function updateUserInfo() {
    userInfo.innerHTML = '<ul class="collection">\n                            <li class="collection-item">Players In Lobby: ' + users.count + '</li>\n                            <li class="collection-item">Players Ready: ' + users.ready + '</li>\n                            <li class="collection-item">Players Alive: ' + users.alive + '</li>\n                          </ul>';
};

var updateLivingCount = function updateLivingCount() {
    var keys = Object.keys(players);

    var livingCount = 0;

    for (var i = 0; i < keys.length; i++) {
        if (players[keys[i]].alive && !players[keys[i]].seeker) {
            livingCount++;
        }
    }

    users.alive = livingCount;

    updateUserInfo();

    if (users.alive == 0 || gameOver) {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, 600, 400);
        socket.emit('restartRound');
    }
};

var resetReady = function resetReady() {
    readyStatus = false;
    readyButton.disabled = false;
};

var resetLiving = function resetLiving() {
    var keys = Object.keys(players);

    for (var i = 0; i < keys.length; i++) {
        players[keys[i]].alive = true;
    }
};

var resetPosition = function resetPosition() {
    var location = { x: getRandomInt(0, 575), y: getRandomInt(0, 375) };

    players[hash].x = players[hash].last_X = players[hash].next_X = location.x;
    players[hash].y = players[hash].last_Y = players[hash].next_Y = location.y;

    players[hash].moveLeft = false;
    players[hash].moveRight = false;
    players[hash].moveDown = false;
    players[hash].moveUp = false;

    socket.emit('updateLocation', players[hash]);
};

var clearScreen = function clearScreen() {
    ctx.clearRect(0, 0, 600, 400);
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

    // Spacebar
    if (key === 32 && !showLocations) {
        if (marcoCallCount < 6) {
            showLocations = true;
            marcoCallCount++;

            if (showLocations) {
                setTimeout(function () {
                    showLocations = false;
                }, 500);
            }
        }
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
    Materialize.toast('Ready!', 3000);
    socket.emit('userReady');
};
