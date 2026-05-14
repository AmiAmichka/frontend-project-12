import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  channels: [],
  messages: [],
  activeChannelId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setActiveChannelId: (state, action) => {
      state.activeChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const {
  setChannels,
  setMessages,
  setActiveChannelId,
  addChannel,
  addMessage,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;