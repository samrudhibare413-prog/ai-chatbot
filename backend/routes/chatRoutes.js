const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Chat = require('../Models/Chat');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'llama-3.3-70b-versatile',
    });

    const aiResponse = completion.choices[0].message.content;

    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = new Chat({ sessionId, messages: [] });
    }
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    res.json({ success: true, response: aiResponse, sessionId });

  } catch (error) {
    console.error('Full Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  try {
    const chat = await Chat.findOne({ sessionId: req.params.sessionId });
    res.json({ success: true, messages: chat ? chat.messages : [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/clear/:sessionId', async (req, res) => {
  try {
    await Chat.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ success: true, message: 'Chat cleared!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;