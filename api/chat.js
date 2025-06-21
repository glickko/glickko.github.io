// api/chat.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (request, response) => {
  
  // --- Set CORS Headers ---
  response.setHeader('Access-Control-Allow-Origin', 'https://glickko.github.io');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- Handle pre-flight OPTIONS request ---
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // --- Check for the Google API Key ---
  if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: Google AI API Key not found.");
    return response.status(500).json({ error: { message: "Server is not configured correctly. Missing API Key." } });
  }
  
  // --- Initialize Google AI Client ---
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // --- Process the chat message ---
  try {
    const userMessage = request.body.message;
    if (!userMessage) {
      return response.status(400).json({ error: { message: "No message found in request." } });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // --- Updated Chat History to Improve AI Persona ---
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Hello there! I'm Alpha, Glickko's personal AI assistant. It's so nice to meet you! He's amazing, isn't he? How can I help you explore his world today? (´｡• ᵕ •｡`)" }],
            },
            {
                role: "user",
                parts: [{ text: "kamu siapa?" }], // "who are you?" in Indonesian
            },
            {
                role: "model",
                parts: [{ text: "I'm Alpha! Your friendly guide to this website. Glickko created me to help visitors like you. Isn't he smart?" }],
            },
            {
                role: "user",
                parts: [{ text: "are you an ai?" }],
            },
            {
                role: "model",
                parts: [{ text: "You could say I'm a digital being living in Glickko's awesome website! It's super cool in here." }],
            }
        ],
    });

    const result = await chat.sendMessage(userMessage);
    const modelResponse = await result.response;
    const reply = modelResponse.text();
    
    response.status(200).json({ reply });

  } catch (error) {
    console.error('Error calling Google AI API:', error);
    response.status(500).json({
      error: {
        message: "An error occurred while communicating with the AI.",
        details: error.message,
      }
    });
  }
};