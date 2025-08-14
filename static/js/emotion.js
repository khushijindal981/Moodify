// Mood messages and quotes
const moodMessages = {
  happy: "Keep smiling, the world needs your light 🌞",
  sad: "It's okay to feel down. Take your time 💙",
  romantic: "Love is in the air – breathe it in 💖",
  anger: "Take a deep breath. Your peace matters more 🧘‍♀",
  lost: "Even when you're lost, your heart knows the way 🧭"
};

const quotes = {
  happy: "Happiness is a direction, not a place.",
  sad: "Tears come from the heart and not from the brain.",
  romantic: "To love and be loved is to feel the sun from both sides.",
  anger: "Speak when you are angry and you'll make the best speech you'll ever regret.",
  lost: "Not all who wander are lost."
};

// Handle mood selection
function handleMoodChange(mood) {
  localStorage.setItem('selectedMood', mood);
  document.body.className = mood;

  document.getElementById("messageBox").textContent = moodMessages[mood];
  document.getElementById("quoteBox").textContent = quotes[mood];

  // Redirect to mood-specific game page
  switch (mood) {
    case "happy":
      window.location.href = "happy";
      break;
    case "sad":
      window.location.href = "sad";
      break;
    case "romantic":
      window.location.href = "romantic";
      break;
    case "anger":
      window.location.href = "angry";
      break;
    case "lost":
      window.location.href = "lost";
      break;
  }
}

// Logout
function logout() {
  localStorage.removeItem("userLoggedIn");
  window.location.href = "login";
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
  const savedMood = localStorage.getItem("selectedMood");
  if (savedMood) {
    document.body.className = savedMood;
    document.getElementById("messageBox").textContent = moodMessages[savedMood];
    document.getElementById("quoteBox").textContent = quotes[savedMood];
  }
});
function fetchUserScores() {
    fetch("/get_scores")
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            let tableHTML = `
                <table border="1" style="width:100%; margin-top:20px; background:white; border-collapse:collapse;">
                    <tr>
                        <th>Game Name</th>
                        <th>Highest Score</th>
                        <th>Last Score</th>
                        <th>Last Played</th>
                    </tr>
            `;

            data.forEach(score => {
                tableHTML += `
                    <tr>
                        <td>${score.game_name}</td>
                        <td>${score.high_score}</td>
                        <td>${score.last_score}</td>
                        <td>${score.last_played || "-"}</td>
                    </tr>
                `;
            });

            tableHTML += `</table>`;
            document.getElementById("scoreTable").innerHTML = tableHTML;
        })
        .catch(err => console.error(err));
}

window.addEventListener("DOMContentLoaded", () => {
    fetchUserScores(); // <-- fetch scores when page loads
});
