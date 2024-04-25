import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import RegisterSiswa from './auth/register_siswa';
import RegisterGuru from './auth/register_guru';
import DashboardSiswa from './component/Dashboard';
import DashboardGuru from './component/DashboardGuru';
import Siswa from './page/murid/siswa/Siswa';
import Kelas from './page/murid/kelas/Kelas';
import Guru from './page/murid/guru/Guru';
import TambahSiswa from './page/murid/siswa/TambahSiswa';
import TambahKelas from './page/murid/kelas/TambahKelas';
import TambahGuru from './page/murid/guru/TambahGuru';

function App() {
  return (
    <div className="App">
    <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register_siswa' element={<RegisterSiswa />} />
        <Route path='/register_guru' element={<RegisterGuru />} />
        <Route path='/dashboard_siswa/*' element={<DashboardSiswa />} exact />
        <Route path='/dashboard_guru/*' element={<DashboardGuru />} exact />
        <Route path='/siswa' element={<Siswa />} exact />
        <Route path='/kelas' element={<Kelas />} exact />
        <Route path='/guru' element={<Guru />} exact />
        <Route path='/tambahsiswa' element={<TambahSiswa />} exact />
        <Route path='/tambahkelas' element={<TambahKelas />} exact />
        <Route path='/tambahguru' element={<TambahGuru />} exact />
      </Routes>
    </div>
  );
}

export default App;
