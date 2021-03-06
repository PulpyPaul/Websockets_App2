// Adds user's data and starts animating
const addUser = (data) => {
    hash = data.hash;
    players[hash] = data;
};

// Updates player's last and next locations
const updateLocation = () => {
    const player = players[hash];
    
    player.last_X = player.x;
    player.last_Y = player.y;
    
    if (player.moveLeft && player.next_X > 0){
        player.next_X -= speed;
    }
    
    if (player.moveRight && player.next_X < 575){
        player.next_X += speed;
    }
    
    if (player.moveDown && player.next_Y < 375){
        player.next_Y += speed;
    }
    
    if (player.moveUp && player.next_Y > 0){
        player.next_Y -= speed;
    }
    
    socket.emit('updateLocation', player);
};

// Updates the player's movement data from the server
const updatePlayer = (data) => {
    if (!players[data.hash]) {
        players[data.hash] = data;
        return;
    }
    
    if (hash == data.hash){
        return;
    }

    const player = players[data.hash];
    
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

// updates the ready status of the user
const updateReady = (data) => {
    
    // updates number of users in the room and the number of them ready/alive
    users = data;
    
    // updates the ready status if a user disconnected
    if (users.ready == 0) {
        readyStatus = false;
    }
        
    // prevents the user from readying more than once
    if (readyStatus){
       readyButton.disabled = true; 
    } else {
        readyButton.disabled = false;
    }  
    
    updateUserInfo();
};

// Starts the game in canvas and begins drawing
const startGame = (data) => {
    players = data;
    requestAnimationFrame(draw);
    $('svg').show();
    socket.emit('startPhysics');
    updateLivingCount();
    drawTimer();
};

// Handles a death within the game
const updateDeath = (data) => {
    players[data.hash].alive = data.alive;
    updateLivingCount();
};

// Initializes a new game and resets the canvas and values
const resetGame = () => {
    resetReady();
    resetLiving();
    resetPosition();
    marcoCallCount = 0;
    clearScreen();
    clearInterval(timerInterval);
    drawGameOver();
};