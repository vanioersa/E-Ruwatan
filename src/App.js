import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./auth/login";
import RegisterSiswa from "./auth/register_siswa";
import RegisterGuru from "./auth/register_guru";
import DashboardSiswa from "./component/Dashboard";
import DashboardGuru from "./component/DashboardGuru";
import Siswa from "./page/murid/siswa/Siswa";
import Kelas from "./page/murid/kelas/Kelas";
import Guru from "./page/murid/guru/Guru";
import TambahSiswa from "./page/murid/siswa/TambahSiswa";
import TambahKelas from "./page/murid/kelas/TambahKelas";
import TambahGuru from "./page/murid/guru/TambahGuru";
import PiketanGuru from "./page/guru/guru/PiketanGuru";
import KBMGuru from "./page/guru/kbm/KBMGuru";
import TambahPiketan from "./page/guru/guru/TambahPiketan";
import TambahKBM from "./page/guru/kbm/TambahKBM";
import UpdateSiswa from "./page/murid/siswa/UpdateSiswa";
import UpdataKelas from "./page/murid/kelas/UpdataKelas";
import UpdateGuru from "./page/murid/guru/UpdateGuru";
import PDFpiket from "./component/PDF";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Rute ke halaman login jika pengguna belum login */}
        <Route path="/" element={<Login />} />
        <Route path="/register_siswa" element={<RegisterSiswa />} />
        <Route path="/register_guru" element={<RegisterGuru />} />

        {/* Rute ke halaman lain */}
        {isLoggedIn ? (
          <>
            <Route path="/dashboard_siswa" element={<DashboardSiswa />} />
            <Route path="/dashboard_guru" element={<DashboardGuru />} />
            <Route path="/piketan_guru/" element={<PiketanGuru />} />
            <Route path="/kbm_guru/" element={<KBMGuru />} />
            <Route path="/siswa" element={<Siswa />} />
            <Route path="/kelas" element={<Kelas />} />
            <Route path="/guru" element={<Guru />} />
            <Route path="/tambahsiswa" element={<TambahSiswa />} />
            <Route path="/tambahkelas" element={<TambahKelas />} />
            <Route path="/tambahguru" element={<TambahGuru />} />
            <Route path="/tambahkbm" element={<TambahKBM />} />
            <Route path="/tambahpiketan" element={<TambahPiketan />} />
            <Route path="/updatesiswa" element={<UpdateSiswa />} />
            <Route path="/updatekelas/:id" element={<UpdataKelas />} />
            <Route path="/updateguru" element={<UpdateGuru />} />
            <Route path="/pdf" element={<PDFpiket />} />
          </>
        ) : null}
      </Routes>
    </div>
  );
}

export default App;