document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const clearChatBtn = document.getElementById("clear-chat");
  const username = "{{ username }}"; 
  const gameName = "Chat with Bot";
  // Load old messages when page loads
  loadChatHistory();

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message on Enter key
  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Optional: Clear chat history
  if (clearChatBtn) {
    clearChatBtn.addEventListener("click", () => {
      localStorage.removeItem("chatHistory");
      chatbotMessages.innerHTML = "";
    });
  }

  // Optional: Close button logic if you're still using it
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatbotContainer.classList.add("hidden");
    });
  }
});

function sendMessage() {
  const inputElement = document.getElementById("chatbot-input");
  const userMessage = inputElement.value.trim();
  if (userMessage) {
    appendMessage("user", userMessage);
    saveMessage("user", userMessage);
    inputElement.value = "";
    getBotResponse(userMessage);
  }
}

function appendMessage(sender, message) {
  const messageContainer = document.getElementById("chatbot-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
async function getBotResponse(userMessage) {
  try {
    const response = await fetch("/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMessage }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Adapt to your backend response structure
    let botMessage = "";
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      botMessage = data.candidates[0].content.parts[0].text;
    } else {
      botMessage = "Sorry, I couldn't understand that.";
    }

    appendMessage("bot", botMessage);
    saveMessage("bot", botMessage);
  } catch (error) {
    console.error("Error:", error);
    appendMessage(
      "bot",
      "Sorry, I'm having trouble responding. Please try again."
    );
    saveMessage("bot", "Sorry, I'm having trouble responding. Please try again.");
  }
}


// Save messages to localStorage
function saveMessage(sender, message) {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ sender, message });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Load messages from localStorage
function loadChatHistory() {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach((msg) => appendMessage(msg.sender, msg.message));
}