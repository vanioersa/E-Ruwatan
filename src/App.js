import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import Sidebar from './component/Sidebar';
import Dashboard from './component/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Sidebar' element={<Sidebar />} />
        <Route path='/Dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
