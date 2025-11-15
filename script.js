const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Fade-in animated bubble
function displayMessage(text, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  bubble.textContent = text;

  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("typing");
  typing.id = "typingIndicator";
  typing.innerHTML = "James is responding<span>.</span><span>.</span><span>.</span>";

  chatContainer.appendChild(typing);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

// Send message logic
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  displayMessage(message, "user");
  userInput.value = "";

  showTyping();

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    removeTyping();

    if (data.error) {
      displayMessage("⚠️ " + data.error, "bot");
      return;
    }

    displayMessage(data.reply, "bot");

  } catch (err) {
    removeTyping();
    displayMessage("❌ Network Error: " + err.message, "bot");
  }
}

// Send button
sendBtn.addEventListener("click", sendMessage);

// Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
