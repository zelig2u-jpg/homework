// hw.js
const theCanvas = document.querySelector('#theCanvas');
const ctx = theCanvas.getContext('2d');

const form = document.querySelector('#theForm');
const colorInput = document.querySelector('#newballcolor');
const sizeInput = document.querySelector('#ballsize');

let balls = [];

function sizeCanvas() {
  theCanvas.width = window.innerWidth;
  theCanvas.height = window.innerHeight;
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

// Ball factory
function makeBall(x, y, radius, color) {
  return {
    x, y,
    radius,
    color,
    dx: (Math.random() * 4 - 2) || 1,
    dy: (Math.random() * 4 - 2) || 2
  };
}

// add initial demo ball (optional)
balls.push(makeBall(60, 60, 50, 'red'));

// form submit -> add a ball
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const radius = Math.max(1, parseInt(sizeInput.value, 10) || 50);
  const color = colorInput.value ;
  // add ball near top-left (or random if you prefer)
  const x = radius + 5;
  const y = radius + 5;
  balls.push(makeBall(x, y, radius, color));
});

// animation loop
function animate() {
  ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);

  for (const b of balls) {
    // move
    b.x += b.dx;
    b.y += b.dy;

    // bounce on canvas bounds (use canvas width/height)
    if (b.x - b.radius <= 0) { b.x = b.radius; b.dx = -b.dx; }
    if (b.x + b.radius >= theCanvas.width) { b.x = theCanvas.width - b.radius; b.dx = -b.dx; }
    if (b.y - b.radius <= 0) { b.y = b.radius; b.dy = -b.dy; }
    if (b.y + b.radius >= theCanvas.height) { b.y = theCanvas.height - b.radius; b.dy = -b.dy; }

    // draw
    ctx.beginPath();
    ctx.fillStyle = b.color;
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);