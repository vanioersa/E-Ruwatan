import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Register_murid from './auth/register_murid';
import Sidebar from './component/Sidebar';
import Dashboard from './component/Dashboard';
import Register_guru from './auth/register_guru';
import Siswa from './page/murid/siswa/Siswa';
import Kelas from './page/murid/kelas/Kelas';
import Guru from './page/murid/guru/Guru';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register_murid' element={<Register_murid />} />
        <Route path='/register_guru' element={<Register_guru />} />
        <Route element={<Sidebar />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/siswa' element={<Siswa />} />
          <Route path='/kelas' element={<Kelas />} />
          <Route path='/guru' element={<Guru />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
