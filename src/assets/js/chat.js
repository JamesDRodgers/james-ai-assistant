const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// CLEAR CHAT
function clearChat() {
  chatContainer.innerHTML = "";
}

// FORMAT BOT MESSAGE
// Converts plain text with newlines, **bold**, and [text](url) links into clean HTML.
// User messages are kept as plain text for safety.
function formatMessage(text) {

  // Escape HTML special characters first
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert **bold** markers
  safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert [text](url) links — only http(s) or site-relative URLs are ever
  // linkified, so no javascript: or other unsafe scheme can become clickable.
  safe = safe.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    (match, linkText, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
  );

  // Split on double newlines to create paragraphs
  const paragraphs = safe
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Within each paragraph, convert single newlines to <br>
  const html = paragraphs
    .map(p => "<p>" + p.replace(/\n/g, "<br>") + "</p>")
    .join("");

  return html;
}

// DISPLAY MESSAGE
function displayMessage(text, sender) {

  const wrapper =
    document.createElement("div");

  wrapper.classList.add(
    "message-wrapper",
    sender
  );

  const bubble =
    document.createElement("div");

  bubble.classList.add(
    "bubble",
    sender
  );

  // Bot messages render formatted HTML; user messages are plain text
  if (sender === "bot") {
    bubble.innerHTML = formatMessage(text);
  } else {
    bubble.textContent = text;
  }

  wrapper.appendChild(bubble);

  chatContainer.appendChild(wrapper);

  chatContainer.scrollTop =
    chatContainer.scrollHeight;
}

// TYPING INDICATOR
function showTyping() {

  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper", "bot");
  wrapper.id = "typingIndicator";

  const bubble = document.createElement("div");
  bubble.classList.add("bubble", "bot", "typing");
  bubble.innerHTML = "<span></span><span></span><span></span>";

  wrapper.appendChild(bubble);
  chatContainer.appendChild(wrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTyping() {

  const indicator = document.getElementById("typingIndicator");

  if (indicator) {
    indicator.remove();
  }
}

// SEND MESSAGE
async function sendMessage() {

  const message =
    userInput.value.trim();

  if (!message) return;

  displayMessage(message, "user");

  userInput.value = "";

  sendBtn.disabled = true;

  showTyping();

  try {

    const response = await fetch(
      "/.netlify/functions/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      }
    );

    const data = await response.json();

    hideTyping();

    if (response.ok && data.reply) {
      displayMessage(data.reply, "bot");
    } else {
      displayMessage("Something went wrong. Please try again.", "bot");
    }

  } catch (err) {

    hideTyping();

    displayMessage(
      "Something went wrong. Please try again.",
      "bot"
    );

  } finally {

    sendBtn.disabled = false;

    userInput.focus();
  }
}

// EVENTS
sendBtn.addEventListener(
  "click",
  sendMessage
);

userInput.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter") {
      sendMessage();
    }
  }
);

// DESKTOP SIDEBAR
if (window.innerWidth > 900) {

  document.querySelector(".sidebar")
    .classList.remove("collapsed");
}

// RESIZE
window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 900) {

      document.querySelector(".sidebar")
        .classList.remove("collapsed");

    } else {

      document.querySelector(".sidebar")
        .classList.add("collapsed");
    }
  }
);
