const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = ["F", "A", "N", "T", "H", "O", "M"];
const windowWidth = window.innerWidth;
const letterSize = windowWidth <= 500 ? 30 : 150;
const minDistance = letterSize;

const letterObjects = letters.map((letter, index) => ({
  letter,
  x: (canvas.width - letters.length * letterSize) / 2 + index * letterSize,
  y: (canvas.height - letterSize) / 3,
  width: letterSize,
  height: letterSize,
  isDragging: false,
  vx: 0,
  vy: 0,
}));

let dragIndex = null;

canvas.addEventListener("mousedown", (e) => {
  const { offsetX, offsetY } = e;
  letterObjects.forEach((letterObj, index) => {
    if (
      offsetX >= letterObj.x &&
      offsetX <= letterObj.x + letterObj.width &&
      offsetY >= letterObj.y &&
      offsetY <= letterObj.y + letterObj.height
    ) {
      letterObj.isDragging = true;
      dragIndex = index;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (dragIndex !== null) {
    const { offsetX, offsetY } = e;
    letterObjects[dragIndex].x = offsetX - letterObjects[dragIndex].width / 2;
    letterObjects[dragIndex].y = offsetY - letterObjects[dragIndex].height / 2;
    checkCollisions(dragIndex);
    drawLetters();
  }
});

canvas.addEventListener("mouseup", () => {
  if (dragIndex !== null) {
    letterObjects[dragIndex].isDragging = false;
    dragIndex = null;
  }
});

function drawLetter(letterObj) {
  ctx.font = `${letterSize}px Arial`;
  ctx.fillStyle = "white";
  ctx.fillText(letterObj.letter, letterObj.x, letterObj.y + letterSize); // Adjust for baseline alignment
}

function drawLetters() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  letterObjects.forEach((letterObj) => drawLetter(letterObj));
}

function checkCollisions(dragIndex) {
  for (let i = 0; i < letterObjects.length; i++) {
    if (i !== dragIndex) {
      const dx = letterObjects[dragIndex].x - letterObjects[i].x;
      const dy = letterObjects[dragIndex].y - letterObjects[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const tx = letterObjects[i].x + Math.cos(angle) * minDistance;
        const ty = letterObjects[i].y + Math.sin(angle) * minDistance;
        const ax = (tx - letterObjects[dragIndex].x) * 0.05;
        const ay = (ty - letterObjects[dragIndex].y) * 0.05;

        letterObjects[dragIndex].vx -= ax;
        letterObjects[dragIndex].vy -= ay;
        letterObjects[i].vx += ax;
        letterObjects[i].vy += ay;
      }
    }
  }
}

function update() {
  letterObjects.forEach((letterObj) => {
    if (!letterObj.isDragging) {
      letterObj.x += letterObj.vx;
      letterObj.y += letterObj.vy;
      letterObj.vx *= 0.95;
      letterObj.vy *= 0.95;
    }
  });
  drawLetters();
  requestAnimationFrame(update);
}

drawLetters();
update();
