const express = require('express');
const router = express.Router();
const multer = require('multer');
const { AssemblyAI } = require('assemblyai');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Received audio file:', req.file.filename);

    // Upload file to AssemblyAI
    const transcript = await client.transcripts.transcribe({
      audio: req.file.path
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    if (transcript.status === 'error') {
      return res.status(500).json({ error: 'Transcription failed' });
    }

    console.log('Transcription:', transcript.text);
    res.json({ transcript: transcript.text });

  } catch (err) {
    console.error('Transcription error:', err);
    // Clean up file if exists
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
    }
    res.status(500).json({ error: 'Transcription failed', details: err.message });
  }
});

module.exports = router;