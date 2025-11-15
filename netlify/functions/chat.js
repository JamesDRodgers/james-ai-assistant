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
    if (!thread.id) throw new Error("Thread creation failed: " + JSON.stringify(thread));

    // 2. Add user message
    const addMessageRes = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/messages`,
      {
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
      }
    );

    const addMsgResult = await addMessageRes.json();
    if (addMsgResult.error) throw new Error(addMsgResult.error.message);

    // 3. Create a run
    const runRes = await fetch(
      `https://api.openai.com/v1/threads/${thread.id}/runs`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2"
        },
        body: JSON.stringify({
          assistant_id: "asst_PelBafh8N2QCLtAx9grAjWMu"
        })
      }
    );

    let run = await runRes.json();
    if (run.error) throw new Error(run.error.message);

    // 4. Poll until the run completes
    while (run.status !== "completed") {
      await new Promise((r) => setTimeout(r, 700));

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
      if (run.error) throw new Error(run.error.message);
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
    if (!messages.data) throw new Error("Messages fetch failed: " + JSON.stringify(messages));

    // ⭐ ROBUST REPLY EXTRACTION
    let botReply = "I’m here — but I couldn't read the reply.";

    try {
      const assistantMessage =
        messages.data.find((m) => m.role === "assistant") ||
        messages.data[0];

      if (assistantMessage?.content?.[0]?.text?.value) {
        botReply = assistantMessage.content[0].text.value;
      } else if (assistantMessage?.content?.[0]?.text?.[0]?.value) {
        botReply = assistantMessage.content[0].text[0].value;
      } else if (assistantMessage?.content?.[0]?.value) {
        botReply = assistantMessage.content[0].value;
      }
    } catch (ignoreErr) {
      // fall back to default message
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        details: err.stack,
        note: "This error is coming from netlify/functions/chat.js"
      })
    };
  }
}
