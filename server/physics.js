const sockets = require('./socketServerEvents.js');

// AABB collision check
const checkAABB = (rect1, rect2, width, height) => {
  if (rect1.x < rect2.x + width &&
     rect1.x + width > rect2.x &&
     rect1.y < rect2.y + height &&
     height + rect1.y > rect2.y) {
    return true;
  }
  return false;
};

// Checks for all player collisions
const checkPlayerCollision = (players) => {
    
    let keys = Object.keys(players);
    
    for (let i = 0; i < keys.length; i++){
        
        let player1 = players[keys[i]];
        
        for (let j = 0; j < keys.length; j++){
            let player2 = players[keys[j]];
            
            // If the players are the same, don't check collision
            if (player1 == player2){
                continue;
            }
            
            // If either players are dead, don't check collision
            if (!player2.alive || !player1.alive){
                continue;
            }
            
            // If both players are not the seeker, don't check collision
            if (!player1.seeker && !player2.seeker){
                continue;
            }
            
            // Make the player 'dead' if there is a successful collision
            if (checkAABB(player1, player2, player1.width, player1.height)){
                
                if (player1.seeker){
                    player2.alive = false;
                    sockets.handleCollision(player2);
                } else {
                    player1.alive = false;
                    sockets.handleCollision(player1);
                }
            }
        }
    }
};

// Check for collisions every 20ms
const startPhysics = (players) => {
    setInterval(() => {
        checkPlayerCollision(players);
    }, 20);
};

module.exports.startPhysics = startPhysics;