export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
