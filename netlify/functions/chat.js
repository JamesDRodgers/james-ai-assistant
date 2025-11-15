import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { message } = JSON.parse(event.body);

    // 1. Create a thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      }
    });

    const thread = await threadRes.json();

    // 2. Add user message
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        role: "user",
        content: message
      })
    });

    // 3. Create a run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        assistant_id: "asst_PelBafh8N2QCLtAx9grAjWMu"
      })
    });

    let run = await runRes.json();

    // 4. Poll until the run completes
    while (run.status !== "completed") {
      await new Promise(r => setTimeout(r, 500));
      const check = await fetch(
        `https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v2"
          }
        }
      );
      run = await check.json();
    }

    // 5. Retrieve final messages
    const messagesRes = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2"
        }
      }
    );

    const messages = await messagesRes.json();

    // ⭐ ROBUST REPLY EXTRACTION (fixes "undefined")
    let botReply = "I’m here — but I couldn't read the reply.";

    try {
      const msg =
        messages.data.find(m => m.role === "assistant") ||
        messages.data[0];

      if (msg?.content?.[0]?.text?.value) {
        botReply = msg.content[0].text.value;
      } else if (msg?.content?.[0]?.text?.[0]?.value) {
        botReply = msg.content[0].text[0].value;
      } else if (msg?.content?.[0]?.value) {
        botReply = msg.content[0].value;
      }
    } catch (err) {
      // fallback stays in place
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
