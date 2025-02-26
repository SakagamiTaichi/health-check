// import axios from 'axios';

import { ApiResponse, Todo } from '../../../share/types';

// const API_BASE_URL = 'https://api.example.com';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

export const fetchTodos = async (): Promise<ApiResponse<Todo[]>> => {
  try {
    // const response = await apiClient.get<ApiResponse<Todo[]>>('/todos');
    // return response.data;

    // return demo data
    return {
      data: [
        { id: 1, text: 'Buy milk', completed: false },
        { id: 2, text: 'Call mom', completed: false },
        { id: 3, text: 'Visit dentist', completed: false },
      ],
      status: 200,
      message: 'Success',
    };
  } catch (error) {
    throw new Error('Failed to fetch todos  error' + error);
  }
};

export const addTodo = async (text: string): Promise<ApiResponse<Todo>> => {
  try {
    // const response = await apiClient.post<ApiResponse<Todo>>('/todos', {
    //   text,
    // });
    // return response.data;

    // return demo data
    return {
      data: { id: 4, text, completed: false },
      status: 200,
      message: 'Success',
    };
  } catch (error) {
    throw new Error('Failed to add todo' + error);
  }
};

export const toggleTodo = async (id: number): Promise<ApiResponse<Todo>> => {
  try {
    // const response = await apiClient.patch<ApiResponse<Todo>>(
    //   `/todos/${id}/toggle`
    // );
    // return response.data;

    // return demo data
    return {
      data: { id, text: 'Buy milk', completed: true },
      status: 200,
      message: 'Success',
    };
  } catch (error) {
    throw new Error('Failed to toggle todo' + error);
  }
};
