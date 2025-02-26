import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../features/todo/slices/todoSlice';
import counterReducer from '../features/counter/slices/counterSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
