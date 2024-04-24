import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Register_murid from './auth/register_murid';
import Sidebar from './component/Sidebar';
import Dashboard from './component/Dashboard';
import Register_guru from './auth/register_guru';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register_murid' element={<Register_murid />} />
        <Route path='/register_guru' element={<Register_guru/>} />
        <Route path='/Sidebar' element={<Sidebar />} />
        <Route path='/Dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
