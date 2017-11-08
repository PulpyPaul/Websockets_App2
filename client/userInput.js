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
    
    // Spacebar
    if(key === 32 && !showLocations) {
        if (marcoCallCount < 6){
            showLocations = true; 
            marcoCallCount++;
            
            if (showLocations){
                setTimeout(() => {
                    showLocations = false;
                }, 500);
            }
        }
    }
};

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
};

// Handles ready button event
const handleReadyUp = () => {
    readyStatus = true;
    Materialize.toast('Ready!', 3000);
    socket.emit('userReady');
};


