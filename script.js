const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Display message in chat bubbles
function displayMessage(text, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  bubble.textContent = text;

  chatContainer.appendChild(bubble);

  // Auto-scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send user message
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  displayMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // ⭐ SHOW SERVER ERRORS IN CHAT BUBBLE
    if (data.error) {
      displayMessage(
        "⚠️ Server Error: " + data.error +
        (data.details ? "\n\nDetails: " + data.details : ""),
        "bot"
      );
      return;
    }

    // Normal assistant reply
    displayMessage(data.reply, "bot");

  } catch (err) {
    // ⭐ FRONT-END ERROR HANDLING
    displayMessage("❌ Frontend Error: " + err.message, "bot");
  }
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send with Enter key
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});
