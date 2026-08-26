// Floating chat launcher (desktop only) — opens a panel over the current page
// instead of navigating to the chat homepage. Calls the same Netlify function
// the homepage chat uses.

(function () {
  const btn = document.getElementById("chatLauncherBtn");
  const panel = document.getElementById("chatLauncherPanel");
  const closeBtn = document.getElementById("chatLauncherClose");
  const messages = document.getElementById("chatLauncherMessages");
  const input = document.getElementById("chatLauncherInput");
  const sendBtn = document.getElementById("chatLauncherSend");

  if (!btn || !panel) return;

  let lastFocused = null;

  function openPanel() {
    lastFocused = document.activeElement;
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    input.focus();
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onDocClick, true);
  }

  function closePanel() {
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onDocClick, true);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape") closePanel();
  }

  function onDocClick(e) {
    if (!panel.contains(e.target) && e.target !== btn) closePanel();
  }

  btn.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  closeBtn.addEventListener("click", closePanel);

  // Same escaping + link-formatting approach as chat.js: user text is always
  // plain text, bot text is escaped first and only **bold** / [text](url)
  // markers (http(s) or site-relative only) are turned into markup.
  function formatBotMessage(text) {
    let safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    safe = safe.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
      (match, linkText, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
    );

    return safe;
  }

  function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = "lm-bubble " + sender;
    if (sender === "bot") {
      bubble.innerHTML = formatBotMessage(text);
    } else {
      bubble.textContent = text;
    }
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    sendBtn.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        addMessage(data.reply, "bot");
      } else {
        addMessage("Something went wrong. Please try again.", "bot");
      }
    } catch (err) {
      addMessage("Something went wrong. Please try again.", "bot");
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") send();
  });
})();
