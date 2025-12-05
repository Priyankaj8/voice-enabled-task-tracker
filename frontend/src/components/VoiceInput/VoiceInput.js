/* global webkitSpeechRecognition */

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import axios from 'axios';

function VoiceInput({ onTaskParsed }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('🎤 Recording started');
      };

      recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        console.log('📝 Transcript received:', text);
        setIsRecording(false);

        try {
          console.log('🔄 Sending to backend...');
          
          const response = await axios.post('http://localhost:5000/api/parse', {
            transcript: text
          });
          
          console.log('✅ Backend response:', response.data);
          onTaskParsed(response.data.transcript, response.data.parsed);
          
        } catch (error) {
          console.error('❌ Error:', error);
          console.error('❌ Error details:', error.response?.data);
          alert('Failed to parse: ' + (error.response?.data?.error || error.message));
        }
      };

      recognition.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        setIsRecording(false);
        alert('Speech recognition error: ' + event.error);
      };

      recognition.onend = () => {
        console.log('🛑 Recording ended');
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.error('❌ Speech recognition not supported');
    }
  }, [onTaskParsed]);

  const startRecording = () => {
    console.log('👆 Voice Input button clicked');
    if (recognitionRef.current) {
      console.log('🎙️ Starting recognition...');
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert('Speech recognition not supported. Please use Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    console.log('⏹️ Stopping recording...');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
        isRecording 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      {isRecording ? 'Recording...' : 'Voice Input'}
    </button>
  );
}

export default VoiceInput;