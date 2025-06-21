// api/chat.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This function sets the required CORS headers
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify your domain: 'https://glickko.github.io'
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle pre-flight requests for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  try {
    const userMessage = req.body.message;

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

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
};

// Wrap the handler with the CORS function
module.exports = allowCors(handler);