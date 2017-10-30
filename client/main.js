let canvas;
let ctx;
let socket;
let hash;
let players = {};
let speed;

const init = () => {
    speed = 5;
    
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    
    socket = io.connect();
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);    
    
    socket.on('join', addUser);
    socket.on('updatePlayer', updatePlayer);
};

window.onload = init;