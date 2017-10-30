let canvas;
let ctx;
let socket;
let hash;           // holds unique user ID
let players = {};   // holds all player data
let users = {};     // holds user count data
let speed;          // speed of all players
let readyButton;    // button to ready up the user
let userInfo;       // information about all users
let readyStatus;    // status if the user is ready
let showLocations;  // shows all client locations

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
};

window.onload = init;