import { Route, Routes } from 'react-router-dom';
import './App.css';
import SideMenu from './share/components/SideMenu';
import TodoPage from './features/todo/pages/TodoPage';
import CounterPage from './features/counter/pages/CounterPage';

function App() {
  return (
    <div className='app-container'>
      <SideMenu />
      <main className='main-content'>
        <Routes>
          <Route path='/todo' element={<TodoPage />} />
          <Route path='/counter' element={<CounterPage />} />
          {/* 他のルートも同様に追加 */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
