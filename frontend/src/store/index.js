import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
});

export const createTask = createAsyncThunk('tasks/create', async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, updates }) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, updates);
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await axios.delete(`${API_URL}/tasks/${id}`);
  return id;
});

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { 
    items: [], 
    loading: false,
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      });
  }
});

export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer
  }
});