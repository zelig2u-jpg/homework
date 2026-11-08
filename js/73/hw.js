const theCanvas = document.querySelector('#theCanvas');
const context = theCanvas.getContext('2d');

const SNAKE_SIZE = 64;

function sizeCanvas() {
  theCanvas.width = window.innerWidth - (window.innerWidth % SNAKE_SIZE);
  theCanvas.height = window.innerHeight - (window.innerHeight % SNAKE_SIZE);
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

const snakeHead = document.createElement('img');
snakeHead.src = 'snakeHead.png';

const apple = document.createElement('img');
apple.src = 'apple.jpg';
let x = 0;
let y = 0;
let direction = 'ArrowRight';
let score = 1000;
let snakeAlive = true;

function isOutOfBounds(x, y) {
  return x < 0 || y < 0 || x >= theCanvas.width || y >= theCanvas.height;
}

snakeHead.onload = () => {
  const intervalId = setInterval(() => {
    // move first, then check bounds
    switch (direction) {
      case 'ArrowUp':    y -= SNAKE_SIZE; break;
      case 'ArrowDown':  y += SNAKE_SIZE; break;
      case 'ArrowLeft':  x -= SNAKE_SIZE; break;
      case 'ArrowRight': x += SNAKE_SIZE; break;
    }
apple.style.left = `${Math.floor(Math.random() * (theCanvas.width / SNAKE_SIZE)) * SNAKE_SIZE}px`;
    // re-evaluate bounds using the current canvas size
    if (isOutOfBounds(x, y)) {
      snakeAlive = false;
      clearInterval(intervalId);
      // handle game over (show message, stop input, etc.)
      let gameoverMessage = document.createElement('div');
      gameoverMessage.textContent = 'Game over';
      gameoverMessage.style.position = 'absolute';
      gameoverMessage.style.top = '50%';
      gameoverMessage.style.left = '50%';
      gameoverMessage.style.fontSize = '48px';
      gameoverMessage.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(gameoverMessage);
      return;
    }

    context.clearRect(0, 0, theCanvas.width, theCanvas.height);
    context.drawImage(snakeHead, x, y);

    context.fillStyle = 'green';
    context.font = '32px Cursive';
    const scoreText = `Score: ${score}`;
    const metrics = context.measureText(scoreText);
    context.fillText(scoreText, (theCanvas.width - metrics.width) - 10, 36);
  }, 500);
};

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      direction = e.key;
      break;
    default:
      console.log(`${e.key} not processed`);
  }
});