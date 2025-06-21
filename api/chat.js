// api/chat.js
const { OpenAI } = require('openai');

// This is the main function Vercel will run
module.exports = async (request, response) => {
  
  // --- Set CORS headers to allow your website to make requests ---
  response.setHeader('Access-Control-Allow-Origin', 'https://glickko.github.io');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- Handle the browser's pre-flight "OPTIONS" request ---
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // --- Ensure the request is a POST request ---
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- Check if the API key is set on the server ---
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API Key not found in Vercel environment variables.");
    return response.status(500).json({ error: { message: "Server is not configured correctly. Missing API Key." } });
  }
  
  // --- Initialize OpenAI Client ---
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // --- Process the chat message ---
  try {
    const userMessage = request.body.message;
    if (!userMessage) {
      return response.status(400).json({ error: { message: "No message found in request." } });
    }

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
    console.error('Error calling OpenAI API:', error);
    response.status(500).json({
      error: {
        message: "An error occurred while communicating with the AI.",
        details: error.message,
      }
    });
  }
};