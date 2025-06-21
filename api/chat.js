// api/chat.js (with extra debugging logs)
const { OpenAI } = require('openai');

module.exports = async (request, response) => {
    // This tells us the function started
    console.log("--- Vercel Function Invoked ---");
    console.log("Request Method:", request.method);

    // Set CORS Headers
    response.setHeader('Access-Control-Allow-Origin', 'https://glickko.github.io');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight OPTIONS request
    if (request.method === 'OPTIONS') {
        console.log("Handling OPTIONS pre-flight request.");
        return response.status(200).end();
    }
    
    // Check if the API key exists
    if (!process.env.OPENAI_API_KEY) {
        console.error("CRITICAL ERROR: OpenAI API Key not found on Vercel server.");
        return response.status(500).json({ error: { message: "Server is not configured correctly. The API Key is missing." } });
    } else {
        console.log("Success: OpenAI API Key was found.");
    }
    
    // --- Main Logic ---
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const userMessage = request.body.message;
        console.log("Received message from user:", userMessage);

        if (!userMessage) {
            console.error("Error: The request did not contain a message.");
            return response.status(400).json({ error: { message: "No message found in request." } });
        }
        
        console.log("Calling OpenAI API...");
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
        
        const reply = completion.choices[0].message.content;
        console.log("Success: Received reply from OpenAI.");

        response.status(200).json({ reply: reply });

    } catch (error) {
        // This will catch any errors from the OpenAI API call itself
        console.error("--- ERROR FROM OPENAI CATCH BLOCK ---");
        console.error("Full Error Details:", error);
        response.status(500).json({
            error: {
                message: "An error occurred while communicating with the AI.",
                details: error.message,
            }
        });
    }
};