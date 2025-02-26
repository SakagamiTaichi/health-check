import React from 'react';
import { Todo } from '../../../share/types';
import { useAppDispatch } from '../../../hooks/hooks';
import { toggleTodoAsync } from '../slices/todoSlice';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleTodoAsync(todo.id));
  };

  return (
    <li
      style={{
        textDecoration: todo.completed ? 'line-through' : 'none',
        cursor: 'pointer',
      }}
      onClick={handleToggle}
    >
      {todo.text}
    </li>
  );
};

export default TodoItem;
