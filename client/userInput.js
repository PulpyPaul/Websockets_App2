// Keydown event
const handleKeyDown = (e) => {
    let key = e.which;
    
    // A 
    if(key === 65) {
        players[hash].moveLeft = true;
    }
    // D
    else if(key === 68) {
        players[hash].moveRight = true;
    }
    
    // space
    if (key === 32){
        players[hash].y -= 200;
    }
}

// Keyup event
const handleKeyUp = (e) => {
    let key = e.which;
    
    // A 
    if(key === 65) {
        players[hash].moveLeft = false;
    }
    // D
    else if(key === 68) {
        players[hash].moveRight = false;
    }
}