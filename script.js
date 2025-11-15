window.onload = function() {
  const welcomeMessage = `Hi, I’m James. Thank you for taking the time to visit. I built this assistant so you can explore my work in a way that is simple, clear, and genuinely useful. You are welcome to browse my resume, dig into my qualifications, or ask direct questions about my background, instructional design approach, and the kinds of roles where I do my best work. My hope is to give you an honest sense of how I think, what I have built, and the values that shape my practice. If you are evaluating something specific or facing a challenge you would like perspective on, feel free to ask. I am glad you are here.`;
  addMessage(welcomeMessage, "bot");
};

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  addMessage(data.reply, "bot");
}

function addMessage(text, sender) {
  const chat = document.getElementById("chat-window");
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
