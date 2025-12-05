const express = require('express');
const router = express.Router();
const { parseTaskFromTranscript } = require('../services/aiParser');

router.post('/', async (req, res) => {
  try {
    const { transcript } = req.body;
    
    console.log('Received parse request:', req.body); // Debug log
    
    if (!transcript || transcript.trim() === '') {
      return res.status(400).json({ error: 'Transcript is required' });
    }
    
    console.log('Parsing transcript:', transcript);
    
    const parsed = await parseTaskFromTranscript(transcript);
    
    console.log('Parse result:', parsed); // Debug log
    
    res.json({ 
      transcript, 
      parsed 
    });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ 
      error: 'Failed to parse transcript',
      details: err.message 
    });
  }
});

module.exports = router;