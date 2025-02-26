import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../api';
import { Todo } from '../../../share/types';

interface TodoState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTodosAsync = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await api.fetchTodos();
    return response.data;
  }
);

export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (text: string) => {
    const response = await api.addTodo(text);
    return response.data;
  }
);

export const toggleTodoAsync = createAsyncThunk(
  'todos/toggleTodo',
  async (id: number) => {
    const response = await api.toggleTodo(id);
    return response.data;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: initialState,
  reducers: {
    clearTodos: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchTodosAsync.fulfilled,
        (state, action: PayloadAction<Todo[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addTodoAsync.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.items.push(action.payload);
      })
      .addCase(
        toggleTodoAsync.fulfilled,
        (state, action: PayloadAction<Todo>) => {
          const index = state.items.findIndex(
            (todo) => todo.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      );
  },
});

export const { clearTodos } = todoSlice.actions;
export default todoSlice.reducer;
