const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Preset question handler
function setPresetQuestion(btn) {
  const text = btn.textContent.replace(/^[^\s]+\s/, ''); // Remove emoji
  userInput.value = text;
  userInput.focus();
}

// Clear chat handler
function clearChat() {
  chatContainer.innerHTML = '';
}

// Display message with avatar for bot messages
function displayMessage(text, sender) {
  if (sender === "bot") {
    // Create wrapper for bot message with avatar
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "bot");
    
    // Create avatar
    const avatar = document.createElement("img");
    avatar.src = "headshot.png";
    avatar.alt = "James";
    avatar.classList.add("bot-avatar");
    
    // Create bubble
    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "bot");
    bubble.innerHTML = text; // Use innerHTML to support HTML formatting
    
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
  } else {
    // User messages don't need avatar
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "user");
    
    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "user");
    bubble.textContent = text;
    
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
  }
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add typing indicator with avatar
function showTyping() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("typing-wrapper");
  wrapper.id = "typingIndicator";
  
  const avatar = document.createElement("img");
  avatar.src = "headshot.png";
  avatar.alt = "James";
  avatar.classList.add("bot-avatar");
  
  const typing = document.createElement("div");
  typing.classList.add("typing");
  typing.innerHTML = 'James is thinking<span class="typing-dots"><span></span><span></span><span></span></span>';
  
  wrapper.appendChild(avatar);
  wrapper.appendChild(typing);
  chatContainer.appendChild(wrapper);
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
