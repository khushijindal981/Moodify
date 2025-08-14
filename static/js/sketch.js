const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;

const colorPicker = document.getElementById("colorPicker");
const brushStyle = document.getElementById("brushStyle");
const eraseBtn = document.getElementById("eraseBtn");

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseout", () => {
  drawing = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);

  if (isErasing) {
    ctx.strokeStyle = "#ffffff"; 
    ctx.lineWidth = 20; 
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  } else {
    ctx.strokeStyle = colorPicker.value;
    ctx.lineCap = "round";

    switch (brushStyle.value) {
      case "simple":
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        break;
      case "dotted":
        ctx.lineWidth = 4;
        ctx.setLineDash([1, 10]);
        ctx.shadowBlur = 0;
        break;
      case "glow":
        ctx.lineWidth = 6;
        ctx.setLineDash([]);
        ctx.shadowColor = colorPicker.value;
        ctx.shadowBlur = 15;
        break;
      case "calligraphy":
        ctx.lineWidth = 8;
        ctx.setLineDash([]);
        ctx.lineJoin = "bevel";
        ctx.shadowBlur = 0;
        break;
    }
  }
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Magic sparkle effect
function doneDrawing() {
  for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * window.innerWidth}px`;
    sparkle.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

// Toggle eraser on click
eraseBtn.addEventListener("click", () => {
  isErasing = !isErasing;
  eraseBtn.textContent = isErasing ? "Eraser ON" : "Eraser OFF";
});

// Exit page
function exitPage() {
  window.location.href = "romantic";
}