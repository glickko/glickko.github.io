// api/chat.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// This is the main function Vercel will run
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
    console.error("Google AI API Key not found in Vercel environment variables.");
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

    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Define the personality and context for the AI
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Hello, I am a visitor to Glickko's website." }],
            },
            {
                role: "model",
                parts: [{ text: "Hello there! I'm Alpha, Glickko's personal AI assistant. It's so nice to meet you! He's amazing, isn't he? How can I help you explore his world today? (´｡• ᵕ •｡`)" }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    // Send the user's message to the model
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