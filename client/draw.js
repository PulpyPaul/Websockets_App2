// Lerp function
const lerp = (start, end, percent) => {
  return (1 - percent) * start + percent * end;
};

// Draws all data to the canvas
const draw = () => {
    updateLocation();
    
    // Clears the canvas
    ctx.clearRect(0, 0, 600, 400);
    
    let keys = Object.keys(players);
    
    for(let i = 0; i < keys.length; i++){
        const player = players[keys[i]];
        
        if (player.percent < 1){
            player.percent += 0.05;
        }
        
        // Gets x/y position using lerp function
        player.x = lerp(player.last_X, player.next_X, player.percent);
        player.y = lerp(player.last_Y, player.next_Y, player.percent);
        
        // Changes player's color if they are the seeker
        if (player.seeker){
            player.color = 'red';
        } else {
            player.color = 'black';
        }
        
        // Updates fill style for player
        ctx.fillStyle = player.color;
        
        // Draws only this client if they are the seeker, otherwise draw all living players
        if (players[hash].seeker && player.seeker) {
            ctx.fillRect(player.x, player.y, player.width, player.height);    
        } else if (!players[hash].seeker || showLocations) {
            if (player.alive){
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
        }
    }
    
    animationFrame = requestAnimationFrame(draw);
};

// draws a animated timer
// https://stackoverflow.com/questions/29649643/how-to-create-a-circular-countdown-timer-using-html-css-or-javascript
const drawTimer = () => {
    maxTime = 30; /* how long the timer runs for */
    let initialOffset = '440';
    gameTimer = 0;
    timerInterval = setInterval(() => {
        $('.circle_animation').css('stroke-dashoffset', initialOffset-(gameTimer*(initialOffset/maxTime)));
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

// Draws the game over screen
const drawGameOver = () => {
    
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

