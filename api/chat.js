// api/chat.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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