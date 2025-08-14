const basket = document.getElementById("basket");
const scoreSpan = document.getElementById("score");
const missedSpan = document.getElementById("missed");
const popup = document.getElementById("gameOverPopup");
const levelBar = document.getElementById("levelBar");
const levelLabel = document.getElementById("levelLabel");
let score = 0;
let missed = 0;
let falling = true;

let spawnInterval = 800;
let heartSpeedFactor = 1;
let gameLoop = setInterval(() => spawnHeart(), spawnInterval);

function spawnHeart() {
  if (!falling) return;

  const heart = document.createElement("img");
  heart.src = "/static/images/heart.png";
  heart.classList.add("heart");

  const x = Math.random() * (window.innerWidth - 50);
  heart.style.left = `${x}px`;

  const duration = (Math.random() * 2 + 3) / heartSpeedFactor;
  heart.style.animationDuration = `${duration}s`;

  document.body.appendChild(heart);

  const fall = setInterval(() => {
    const heartRect = heart.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    // Check if caught
    if (
      heartRect.bottom >= basketRect.top &&
      heartRect.left < basketRect.right &&
      heartRect.right > basketRect.left &&
      heartRect.bottom < basketRect.bottom
    ) {
      score++;
      scoreSpan.textContent = score;
      heart.remove();
      clearInterval(fall);
      adjustDifficulty(); // new
    }

    // Check if missed
    if (heartRect.top >= window.innerHeight - 20) {
      missed++;
      missedSpan.textContent = missed;
      heart.remove();
      clearInterval(fall);

      if (missed >= 5) {
        endGame();
      }
    }
  }, 40);
}

window.addEventListener("mousemove", (e) => {
  const basket = document.getElementById("basket");
  const x = e.clientX - basket.offsetWidth / 2;
  basket.style.left = `${x}px`;
});

function adjustDifficulty() {
  if (score % 5 === 0 && score !== 0) {
    if (heartSpeedFactor < 2.5) {
      heartSpeedFactor += 0.1;
    }

    if (spawnInterval > 400) {
      spawnInterval -= 20;
      clearInterval(gameLoop);
      gameLoop = setInterval(() => spawnHeart(), spawnInterval);
    }

    updateProgressBar();
  }
}

function updateProgressBar() {
  const maxScore = 50;
  const progress = Math.min((score / maxScore) * 100, 100);
  levelBar.style.width = `${progress}%`;

  if (score < 50) {
    levelLabel.textContent = "Level: Beginner";
  } else if (score < 120) {
    levelLabel.textContent = "Level: Intermediate";
  } else if (score < 220) {
    levelLabel.textContent = "Level: Pro";
  } else if (score < 450) {
    levelLabel.textContent = "Level: Master";
  } else {
    levelLabel.textContent = "Level: Legend 👑";
  }
}

function sendScoreToBackend(username, gameName, score) {
    fetch('/update_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            game_name: gameName,
            score: score
        })
    })
    .then(res => res.json())
    .then(data => console.log("Score update:", data))
    .catch(err => console.error(err));
}

function endGame() {
  falling = false;
  clearInterval(gameLoop);
  popup.classList.remove("hidden");
  let finalScore = score; 
  sendScoreToBackend(username, gameName, finalScore);
}

function restartGame() {
  score = 0;
  missed = 0;
  scoreSpan.textContent = score;
  missedSpan.textContent = missed;
  popup.classList.add("hidden");
  falling = true;

  // Reset difficulty
  spawnInterval = 800;
  heartSpeedFactor = 1;
  levelBar.style.width = "0%";
  levelLabel.textContent = "Level: Beginner";

  clearInterval(gameLoop);
  gameLoop = setInterval(() => spawnHeart(), spawnInterval);
}

function exitGame() {
  window.location.href = "romantic"; 
}