// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const updateUserInfo = () => {
    userInfo.innerHTML = `Players: ${users.count} \nReady: ${users.ready} \nAlive: ${users.alive}`;
};

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

const resetReady = () => {
    readyStatus = false;
    readyButton.disabled = false;
};

const resetLiving = () => {
    let keys = Object.keys(players);
    
    for (let i = 0; i < keys.length; i++){
        players[keys[i]].alive = true;
    }
};

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

const clearScreen = () => {
    ctx.clearRect(0, 0, 600, 400);
};
