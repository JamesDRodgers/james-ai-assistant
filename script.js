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

  bubble.textContent = text;

  wrapper.appendChild(bubble);

  chatContainer.appendChild(wrapper);

  chatContainer.scrollTop =
    chatContainer.scrollHeight;
}

// SEND MESSAGE
async function sendMessage() {

  const message =
    userInput.value.trim();

  if (!message) return;

  displayMessage(message, "user");

  userInput.value = "";

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

    displayMessage(data.reply, "bot");

  } catch (err) {

    displayMessage(
      "Network error.",
      "bot"
    );
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
