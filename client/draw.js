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
        
        player.x = lerp(player.last_X, player.next_X, player.percent);
        player.y = lerp(player.last_Y, player.next_Y, player.percent);
        
        if (player.seeker){
            player.color = 'red';
        } else {
            player.color = 'black';
        }
        
        ctx.fillStyle = player.color;
        
        // Draws only this client if they are the seeker, otherwise draw all players
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

// https://stackoverflow.com/questions/29649643/how-to-create-a-circular-countdown-timer-using-html-css-or-javascript
const drawTimer = () => {
    maxTime = 30; /* how long the timer runs for */
    let initialOffset = '440';
    gameTimer = 0;
    let interval = setInterval(() => {
        $('.circle_animation').css('stroke-dashoffset', initialOffset-(gameTimer*(initialOffset/maxTime)));
        $('h2').text(gameTimer);
        if (gameTimer == maxTime + 1) {
            gameOver = true;
            updateLivingCount();
            $('svg').hide();
            $('h2').hide();
            clearInterval(interval);
        } 
        gameTimer++;  
    }, 1000);  
};

const drawGameOver = () => {
    
    // Draws black cover screen
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draws 'Game Over' text
    ctx.fillStyle = 'black';
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Ready Up to play again!", canvas.width / 2, canvas.height / 2 + 50);
};

