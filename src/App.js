import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import RegisterSiswa from './auth/register_siswa';
import RegisterGuru from './auth/register_guru';
import DashboardSiswa from './component/Dashboard';
import Siswa from './page/murid/siswa/Siswa';
import Kelas from './page/murid/kelas/Kelas';
import Guru from './page/murid/guru/Guru';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register_siswa' element={<RegisterSiswa />} />
        <Route path='/register_guru' element={<RegisterGuru />} />
        <Route path='/dashboard_siswa/*' element={<DashboardSiswa />} />
        <Route path='/siswa' element={<Siswa />} />
        <Route path='/kelas' element={<Kelas />} />
        <Route path='/guru' element={<Guru />} />
      </Routes>
    </div>
  );
}

export default App;
