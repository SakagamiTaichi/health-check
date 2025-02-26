import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state, { payload }) => state + payload,
    decrement: (state, { payload }) => state - payload,
    multiply: (state, { payload }) => state * payload,
    divide: (state, { payload }) => state / payload,
  },
});

export const { increment, decrement, multiply, divide } = counterSlice.actions;
export default counterSlice.reducer;
