import { Route, Routes } from 'react-router-dom';
import './App.css';
import SideMenu from './share/components/SideMenu';
import TodoPage from './features/todo/pages/TodoPage';
import CounterPage from './features/counter/pages/CounterPage';
import HealthCheckPage from './features/health-check/pages/HealthCheckPage';

function App() {
  return (
    <div className='app-container'>
      <SideMenu />
      <main className='main-content'>
        <Routes>
          <Route path='/todo' element={<TodoPage />} />
          <Route path='/counter' element={<CounterPage />} />
          <Route path='/health-check' element={<HealthCheckPage />} />
          <Route path='/' element={<HealthCheckPage />} />{' '}
          {/* デフォルトルートとして設定 */}
          {/* 他のルートも同様に追加 */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
