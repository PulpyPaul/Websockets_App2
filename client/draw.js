// Lerp function
const lerp = (start, end, percent) => {
  return (1 - percent) * start + percent * end;
};

// Draws all data to the canvas
const draw = () => {
    updateLocation();
    
    // Clears the canvas
    ctx.clearRect(0, 0, 500, 500);
    
    let keys = Object.keys(players);
    
    for(let i = 0; i < keys.length; i++){
        const player = players[keys[i]];
        
        if (player.percent < 1){
            player.percent += 0.05;
        }
        
        if (player.hash === hash){
            // do something to the specific character
        }
                
        player.x = lerp(player.last_X, player.next_X, player.percent);
        player.y = lerp(player.last_Y, player.next_Y, player.percent);
        
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    
    requestAnimationFrame(draw);
}