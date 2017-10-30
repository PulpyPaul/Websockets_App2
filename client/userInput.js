// Keydown event
const handleKeyDown = (e) => {
    let key = e.which;
    
    // WASD
    if(key === 65) {
        players[hash].moveLeft = true;
    } else if(key === 68) {
        players[hash].moveRight = true;
    } else if (key === 87) {
        players[hash].moveUp = true;
    } else if (key === 83) {
        players[hash].moveDown = true;
    }
    
    if(key === 32) {
        showLocations = true;
    }
}

// Keyup event
const handleKeyUp = (e) => {
    let key = e.which;
    
    // WASD
    if(key === 65) {
        players[hash].moveLeft = false;
    } else if(key === 68) {
        players[hash].moveRight = false;
    } else if (key === 87) {
        players[hash].moveUp = false;
    } else if (key === 83) {
        players[hash].moveDown = false;
    }
    
    if (key === 32) {
        showLocations = false;
    }
}

const handleReadyUp = () => {
    readyStatus = true;
    socket.emit('userReady');
};

