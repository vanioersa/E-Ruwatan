import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Register_murid from './auth/register_murid';
import Sidebar from './component/Sidebar';
import Dashboard from './component/Dashboard';
import Register_guru from './auth/register_guru';
import Siswa from './page/admin/siswa/Siswa';
import Kelas from './page/admin/kelas/Kelas';
import Guru from './page/admin/guru/Guru';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register_murid' element={<Register_murid />} />
        <Route path='/register_guru' element={<Register_guru />} />
        <Route path='/Sidebar' element={<Sidebar />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Siswa' element={<Siswa />} />
        <Route path='/Kelas' element={<Kelas />} />
        <Route path='/Guru' element={<Guru />} />
      </Routes>
    </div>
  );
}

export default App;
