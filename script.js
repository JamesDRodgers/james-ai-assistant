const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// MOBILE SIDEBAR
function toggleSidebar() {

  const sidebar = document.querySelector(".sidebar");

  const isCollapsed =
    sidebar.classList.toggle("collapsed");

  const toggleBtn =
    document.querySelector(".mobile-toggle");

  toggleBtn.textContent =
    isCollapsed ? "☰ Menu" : "✕ Close";
}

// PRESET QUESTIONS
function setPresetQuestion(btn) {

  const text = btn.innerText.trim();

  userInput.value = text;

  userInput.focus();

  requestAnimationFrame(() => {

    userInput.scrollLeft = 0;

    userInput.setSelectionRange(0, 0);
  });

  if (window.innerWidth <= 900) {

    const sidebar =
      document.querySelector(".sidebar");

    sidebar.classList.add("collapsed");

    document.querySelector(".mobile-toggle")
      .textContent = "☰ Menu";
  }
}

// CLEAR CHAT
function clearChat() {
  chatContainer.innerHTML = "";
}

// CONTACT MODAL
function showContactForm() {

  document.getElementById("contactModal")
    .style.display = "block";

  document.body.style.overflow = "hidden";
}

function closeContactForm() {

  document.getElementById("contactModal")
    .style.display = "none";

  document.body.style.overflow = "auto";
}

// CLICK OUTSIDE MODAL
window.onclick = function (event) {

  const modal =
    document.getElementById("contactModal");

  if (event.target === modal) {
    closeContactForm();
  }
};

// FORMAT BOT MESSAGE
// Converts plain text with newlines and **bold** into clean HTML.
// User messages are kept as plain text for safety.
function formatMessage(text) {

  // Escape HTML special characters first
  let safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert **bold** markers
  safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

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

    displayMessage(data.reply, "bot");

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
