import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { decrement, divide, increment, multiply } from '../slices/counterSlice';

// 操作ボタンの共通インターフェース
interface CounterButtonProps {
  onClick: () => void;
  label: string;
}

// 再利用可能なボタンコンポーネント
const CounterButton: React.FC<CounterButtonProps> = ({ onClick, label }) => (
  <button
    className='px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors'
    onClick={onClick}
  >
    {label}
  </button>
);

// ファイル名をTodoPageからCounterPageに変更
const CounterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.counter);

  // ボタンの設定をオブジェクトの配列として定義
  const buttons = [
    {
      label: '増加',
      action: () => dispatch(increment(2)),
    },
    {
      label: '減少',
      action: () => dispatch(decrement(2)),
    },
    {
      label: '乗算',
      action: () => dispatch(multiply(2)),
    },
    {
      label: '除算',
      action: () => dispatch(divide(2)),
    },
  ];

  return (
    <div className='max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-lg'>
      <h1 className='text-2xl font-bold text-center mb-4'>カウンターアプリ</h1>
      <h2 className='text-4xl font-bold text-center mb-6'>{counter}</h2>

      <div className='flex flex-wrap justify-center'>
        {buttons.map((button, index) => (
          <CounterButton
            key={index}
            label={button.label}
            onClick={button.action}
          />
        ))}
      </div>
    </div>
  );
};

export default CounterPage;
