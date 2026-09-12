import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  tool,
} from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

type Card = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

// Allow streaming responses up to 60 seconds on Vercel
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // retrieve the messages and the context cards from the request...
    const {
      messages,
      cards = [],
    }: {
      messages: UIMessage[];
      cards?: Card[];
    } = await req.json();

    // create a context of the cards
    const cardsContext =
      cards.length > 0
        ? `Currently available cards on the user's screen:\n${cards
            .map(
              (c, i) =>
                `${i + 1}. [ID: "${c.id}"] Title: "${c.title}" | Description: "${c.description}" | Tags: [${(c.tags || []).join(', ')}]`
            )
            .join('\n')}`
        : 'There are currently no cards on the user screen.';

    const system = `You are a helpful assistant for managing a card board.

${cardsContext}

Rules:
1. Whenever the user asks to create, add, or make a card, you MUST call the "addCard" tool.
2. Whenever the user asks to remove, delete, or dismiss a card:
   - If the user provides an ID directly (e.g. "remove card <id>"), use that ID.
   - If the user specifies a card by its title, topic, or description (e.g. "remove the card about Next.js"), find the matching card from the list above and use its exact "id".
   - You MUST call the "removeCard" tool with that "id" and the card's "title".
   - If no matching card is found, inform the user and tell them what cards are available.`;

    const result = streamText({
      model: google('gemini-3.1-flash-lite'),
      messages: await convertToModelMessages(messages),
      system,
      tools: {
        addCard: tool({
          description: 'Add a new card to the UI',
          inputSchema: z.object({
            title: z.string().describe('title of the card'),
            description: z.string().describe('description of the card'),
            tags: z
              .union([
                z.array(z.string()),
                z.string().transform((str) => str.split(',').map((s) => s.trim())),
              ])
              .describe('relevant tags for the card'),
          }),
          execute: async ({ title, description, tags }) => {
            const tagsArray = Array.isArray(tags) ? tags : [tags];
            return {
              id: crypto.randomUUID(),
              title,
              description,
              tags: tagsArray,
            };
          },
        }),
        removeCard: tool({
          description: 'Remove a card from the UI by its ID',
          inputSchema: z.object({
            id: z.string().describe('ID of the card to be removed'),
            title: z.string().optional().describe('Title of the card being removed'),
          }),
          execute: async ({ id, title }) => {
            return {
              id,
              title: title || "Title not found",
            };
          },
        }),
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
