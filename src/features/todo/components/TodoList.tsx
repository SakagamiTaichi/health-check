import React, { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { addTodoAsync, fetchTodosAsync } from '../slices/todoSlice';
import { Todo } from '../../../share/types';

const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodosAsync());
    }
  }, [status, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodoAsync(newTodo.trim()));
      setNewTodo('');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Todo List</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder='Add new todo'
        />
        <button type='submit'>Add</button>
      </form>

      <ul>
        {items.map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
