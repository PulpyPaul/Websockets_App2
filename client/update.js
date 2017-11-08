// Gets a random integer
// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Updates the users info 
const updateUserInfo = () => {
    userInfo.innerHTML = `<ul class="collection">
                            <li class="collection-item">Players In Lobby: ${users.count}</li>
                            <li class="collection-item">Players Ready: ${users.ready}</li>
                            <li class="collection-item">Players Alive: ${users.alive}</li>
                          </ul>`;
};

// Updates which players are alive and checks if there are any left
const updateLivingCount = () => {
    let keys = Object.keys(players);
    
    let livingCount = 0;
    
    for (let i = 0; i < keys.length; i++){
        if (players[keys[i]].alive && !players[keys[i]].seeker){
            livingCount++;
        }
    }
    
    users.alive = livingCount;
    
    updateUserInfo();
    
    if (users.alive == 0 || gameOver){
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, 600, 400);
        socket.emit('restartRound');
    }
};

// Resets the ready status and button
const resetReady = () => {
    readyStatus = false;
    readyButton.disabled = false;
};

// Resets the living status of all players
const resetLiving = () => {
    let keys = Object.keys(players);
    
    for (let i = 0; i < keys.length; i++){
        players[keys[i]].alive = true;
    }
};

// Resets the positions and keydowns of all players
const resetPosition = () => {
    let location = {x: getRandomInt(0, 575), y: getRandomInt(0, 375)};
        
    players[hash].x = players[hash].last_X = players[hash].next_X = location.x;
    players[hash].y = players[hash].last_Y = players[hash].next_Y = location.y;
    
    players[hash].moveLeft = false;
    players[hash].moveRight = false;
    players[hash].moveDown = false;
    players[hash].moveUp = false;
        
    socket.emit('updateLocation', players[hash]);
};

// Clears the canvas
const clearScreen = () => {
    ctx.clearRect(0, 0, 600, 400);
};
