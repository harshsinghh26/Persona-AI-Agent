import { OpenAI } from "openai";
import "dotenv/config";
import { hiteshPrompt } from "../prompts/hitesh";
import { piyushPrompt } from "../prompts/piyush";

const client = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY,
});

interface ChatMessage {
  content: string;
  sender: "user" | "bot";
}

export async function POST(req: Request) {
  try {
    const { message, persona, conversationHistory = [] } = await req.json();

    let systemPrompt = "";
    if (persona === "hitesh") {
      systemPrompt = hiteshPrompt();
    } else if (persona === "piyush") {
      systemPrompt = piyushPrompt();
    } else {
      throw new Error("Unknown persona");
    }

    const historyMessages = conversationHistory.map((msg: ChatMessage) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              // Send content immediately without any artificial delays
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Error processing chat request", { status: 500 });
  }
}
