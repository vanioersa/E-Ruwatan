import { Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './auth/login';
import RegisterSiswa from './auth/register_siswa';
import RegisterGuru from './auth/register_guru';
import DashboardSiswa from './component/Dashboard';
import Siswa from './page/murid/siswa/Siswa';
import Kelas from './page/murid/kelas/Kelas';
import Guru from './page/murid/guru/Guru';
import TambahSiswa from './page/murid/siswa/TambahSiswa';
import TambahKelas from './page/murid/kelas/TambahKelas';
import TambahGuru from './page/murid/guru/TambahGuru';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register_siswa"
          element={<RegisterSiswa setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/register_guru"
          element={<RegisterGuru setIsLoggedIn={setIsLoggedIn} />}
        />
        {isLoggedIn ? (
          <>
            <Route
              path="/dashboard_siswa/*"
              element={<DashboardSiswa />}
            />
            <Route path="/siswa" element={<Siswa />} />
            <Route path="/kelas" element={<Kelas />} />
            <Route path="/guru" element={<Guru />} />
            <Route path="/tambahsiswa" element={<TambahSiswa />} />
            <Route path="/tambahkelas" element={<TambahKelas />} />
            <Route path="/tambahguru" element={<TambahGuru />} />
          </>
        ) : (
          <Route
            path="*"
            element={<Navigate to="/" replace={true} />}
          />
        )}
      </Routes>
    </div>
  );
}

export default App;