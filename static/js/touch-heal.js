document.addEventListener("DOMContentLoaded", () => {
  const brokenHeart = document.getElementById('brokenHeart');
  const healedHeart = document.getElementById('healedHeart');
  const healingText = document.getElementById('healingText');
  const heartBox = document.getElementById('heartBox');
  const quoteBox = document.getElementById('healingQuotes');
  const username = "{{ username }}"; 
  const gameName = "Touch and Heal";
  let healed = false;

  // Healing quotes
  const healingQuotes = [
    "“Every wound heals, just give it time.”",
    "“Your heart is stronger than you know.”",
    "“Healing begins the moment you choose to.”",
    "“One day this pain will become your strength.”",
    "“You are not broken, just bent and healing.”",
    "“Little by little, day by day.”",
    "“Even the darkest night ends with sunrise.”",
    "“You can do anything — just give some time.”",
    "“Every wound heals, just give it time.”",
   "“Your heart is stronger than you know.”",
   "“Healing begins the moment you choose to.”",
   "“One day this pain will become your strength.”",
   "“You are not broken, just bent and healing.”",
   "“Little by little, day by day.”",
   "“Even the darkest night ends with sunrise.”",
   "'Just remember you can do anything. just give some time'.",
   "This will also pass....",
   "You are the best...."
  ];

  let quoteInterval;
  let currentQuoteIndex = 1;

  function startHealing() {
    if (healed) return;
    healed = true;

    // Add glow to broken heart
    brokenHeart.classList.add('glow');

    // Transition effect
    setTimeout(() => {
      brokenHeart.style.opacity = 0;
      healedHeart.style.opacity = 1;
      healedHeart.style.transform = 'scale(1.2)';
      healingText.classList.add('show');
      quoteBox.classList.add('show');
      quoteBox.textContent = healingQuotes[currentQuoteIndex];

      // Start rotating quotes
      quoteInterval = setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % healingQuotes.length;
        quoteBox.style.opacity = 0;

        setTimeout(() => {
          quoteBox.textContent = healingQuotes[currentQuoteIndex];
          quoteBox.style.opacity = 1;
        }, 200);
      }, 5000);
    }, 2000);
  }

  // Trigger on mouse move or touch
  heartBox.addEventListener('mousemove', startHealing);
  heartBox.addEventListener('touchstart', startHealing);

});