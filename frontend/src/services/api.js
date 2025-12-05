import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const parseVoiceInput = async (transcript) => {
  try {
    console.log('Calling parse API with:', transcript);
    const response = await axios.post(`${API_URL}/parse`, { transcript });
    console.log('Parse API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Parse API error:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};