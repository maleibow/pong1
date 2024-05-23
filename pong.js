const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Prevent default touch actions to stop scrolling
canvas.addEventListener('touchstart', (e) => e.preventDefault());
canvas.addEventListener('touchmove', (e) => e.preventDefault());

// Resize canvas to fit the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
const ballRadius = 10;

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;

// Touch coordinates
let touch1Y = null;
let touch2Y = null;

// Draw everything on the canvas
function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();

    // Draw paddles
    context.fillStyle = 'white';
    context.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    context.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
}

// Move ball and paddles
function move() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    } else if (ballX + ballRadius > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX + ballRadius < 0 || ballX - ballRadius > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    // Move paddles
    if (touch1Y !== null) {
        const paddleCenter = paddle1Y + paddleHeight / 2;
        const direction = touch1Y - paddleCenter;
        paddle1Y += direction * 0.1;
    }
    if (touch2Y !== null) {
        const paddleCenter = paddle2Y + paddleHeight / 2;
        const direction = touch2Y - paddleCenter;
        paddle2Y += direction * 0.1;
    }
}

// Touch event listeners
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouch(e);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTouch(e);
});

canvas.addEventListener('touchend', () => {
    touch1Y = null;
    touch2Y = null;
});

function handleTouch(e) {
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX < canvas.width / 2) {
            touch1Y = touch.clientY;
        } else {
            touch2Y = touch.clientY;
        }
    }
}

// Game loop
function gameLoop() {
    draw();
    move();
    requestAnimationFrame(gameLoop);
}

gameLoop();
