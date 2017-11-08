let canvas;
let ctx;
let socket;
let hash;               // holds unique user ID
let players = {};       // holds all player data
let users = {};         // holds users information
let speed;              // speed of all players
let readyButton;        // button to ready up the user
let userInfo;           // information about all users
let readyStatus;        // status if the user is ready
let showLocations;      // shows all client locations
let animationFrame;     // holds reference to requestAnimationFrame
let marcoCallCount = 0; // how many times the seekers called marco
let gameTimer;          // how long the game has been running
let maxTime;            // max time of a game
let gameOver = false;   // if the game is over
let marcoWins = false;  // if marco wins

const init = () => {
    
    readyStatus = false;
    speed = 5;
        
    // Get reference to necessary HTML elements
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    readyButton = document.querySelector('#readyButton');
    userInfo = document.querySelector('#userInfo');
        
    // Gets socket.io instance
    socket = io.connect();
    
    // Setup Events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp); 
    readyButton.onclick = handleReadyUp;
        
    socket.on('join', addUser);
    socket.on('updatePlayer', updatePlayer);
    socket.on('updateReady', updateReady);
    socket.on('startGame', startGame);
    socket.on('updateDeath', updateDeath);
    socket.on('restartRound', resetGame);
};

window.onload = init;