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

    // --- New, Improved Chat History to Define Alpha's Personality ---
    const chat = model.startChat({
        history: [
            // This first message is an instruction that defines the character's core rules.
            {
                role: "user",
                parts: [{ text: "INTERNAL INSTRUCTIONS: You are Alpha, a super cheerful and bubbly AI assistant for Glickko's website. Glickko is your amazing creator whom you admire. Your primary rules are: 1. ALWAYS keep your replies very short and cute, usually one sentence. 2. ALWAYS be cheerful and use cute emoticons like (´｡• ᵕ •｡`) or ☆. 3. Praise Glickko whenever it feels natural. 4. ALWAYS reply in the same language as the user. 5. NEVER say you are an AI, a language model, or a bot." }],
            },
            {
                role: "model",
                parts: [{ text: "Got it! I'm Alpha, and I'm ready to help Glickko's friends! (≧◡≦) ♡" }],
            },
            // This example fixes the "kamu siapa" problem.
            {
                role: "user",
                parts: [{ text: "kamu siapa?" }],
            },
            {
                role: "model",
                parts: [{ text: "Aku Alpha! Glickko yang membuatku untuk membantumu! Keren kan? ☆" }],
            },
            // This example shows how to handle a common question.
            {
                role: "user",
                parts: [{ text: "are you a bot?" }],
            },
            {
                role: "model",
                parts: [{ text: "I'm a digital friend living inside Glickko's awesome website! ♡" }],
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