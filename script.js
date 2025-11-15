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

// Contact James handler
function contactJames() {
  window.location.href = 'mailto:jdevin.rodgers@gmail.com?subject=Contact%20from%20jamesdrodgers.ai';
}

// Display message with avatar for bot messages
function displayMessage(text, sender) {
  if (sender === "bot") {
    // Strip citation markers like 【4:0†source】
    text = text.replace(/【[^】]+】/g, '');
    
    // Format the text with basic markdown-style parsing
    text = formatBotMessage(text);
    
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

// Format bot messages with better typography
function formatBotMessage(text) {
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  // Wrap each paragraph in <p> tags
  const formatted = paragraphs.map(p => {
    p = p.trim();
    
    // Check if it's a list (starts with - or *)
    if (p.match(/^[-*]\s/m)) {
      const items = p.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-*]\s/, '').trim())
        .map(line => `<li>${line}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
    
    // Regular paragraph
    return `<p>${p}</p>`;
  }).join('');
  
  return formatted;
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
