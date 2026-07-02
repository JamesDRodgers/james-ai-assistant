import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./system-prompt.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function handler(event) {
  try {
    const { message } = JSON.parse(event.body);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }]
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const botReply = textBlock?.text || "I'm here — but I couldn't read the reply.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botReply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
        note: "This error is coming from netlify/functions/chat.js"
      })
    };
  }
}
