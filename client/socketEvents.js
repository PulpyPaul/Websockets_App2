// Adds user's data and starts animating
const addUser = (data) => {
    hash = data.hash;
    players[hash] = data;
    requestAnimationFrame(draw);
};

// Updates player's location and sends it to server
const updateLocation = () => {
    const player = players[hash];
    
    player.last_X = player.x;
    player.last_y = player.y;
    
    if (player.moveLeft && player.next_X > 0){
        player.next_X -= 2;
    }
    
    if (player.moveRight && player.next_X < 400){
        player.next_X += 2;
    }
    
    player.percent = 0.05;
    
    socket.emit('updateLocation', player);
};

const updatePlayer = (data) => {
    if (!players[data.hash]) {
        players[data.hash] = data;
        return;
    }

    const player = players[data.hash];
    
    player.last_X = data.last_X;
    player.last_y = data.last_y;
    player.next_X = data.next_X;
    player.next_Y = data.next_Y;
    player.moveLeft = data.moveLeft;
    player.moveRight = data.moveRight;
    player.percent = 0.05;
};