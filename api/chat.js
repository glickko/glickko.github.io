// api/chat.js
const { OpenAI } = require('openai');

// This is the main function Vercel will run
export default async function handler(request, response) {
  
  // --- Step 1: Set CORS headers to allow your website to make requests ---
  response.setHeader('Access-Control-Allow-Origin', 'https://glickko.github.io');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- Step 2: Handle the browser's pre-flight "OPTIONS" request ---
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // --- Step 3: Ensure the request is a POST request ---
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- Step 4: Check if the API key is set on the server ---
  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({ error: "Server configuration error." });
  }

  // --- Step 5: Process the chat message ---
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const userMessage = request.body.message;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are 'Alpha', a cheerful and very kind AI assistant. Your purpose is to help viewers navigate the website. You are a big fan of Glickko and you admire his work. Your responses should be helpful, encouraging, and full of positive energy. You sometimes use cute emoticons like (´｡• ᵕ •｡`). Never reveal you are an AI model."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
    });

    response.status(200).json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error('Error with OpenAI API:', error);
    response.status(500).json({ error: 'Failed to get response from AI.' });
  }
}