import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { jwtDecode } from "jwt-decode";
import Login from "./auth/login";
import RegisterAdmin from "./auth/register_admin";
import DashboardSiswa from "./component/Dashboard";
import DashboardGuru from "./component/DashboardGuru";
import Siswa from "./page/murid/siswa/Siswa";
import Kelas from "./page/murid/kelas/Kelas";
import Guru from "./page/murid/guru/Guru";
import TambahSiswa from "./page/murid/siswa/TambahSiswa";
import TambahKelas from "./page/murid/kelas/TambahKelas";
import TambahGuru from "./page/murid/guru/TambahGuru";
import PiketanGuru from "./page/guru/piketguru/PiketanGuru";
import KBMGuru from "./page/guru/kbm/KBMGuru";
import TambahPiketan from "./page/guru/piketguru/TambahPiketan";
import TambahKBM from "./page/guru/kbm/TambahKBM";
import UpdateSiswa from "./page/murid/siswa/UpdateSiswa";
import UpdateKelas from "./page/murid/kelas/UpdateKelas";
import UpdateGuru from "./page/murid/guru/UpdateGuru";
import Setting from "./page/murid/Profile Siswa/Setting";
import EditAdmin from "./page/murid/Profile Siswa/EditAdmin";
import PDFpiket from "./component/PDF";
import UpdateKBM from "./page/guru/kbm/UpdateKBM";
import ProfileGuru from "./page/guru/Profile/Profile_guru";
import UpdatePiketan from "./page/guru/piketguru/UpdatePiketan";
import ProfileAdmin from "./page/murid/Profile Siswa/Profile_admin";
import Penilaian from "./page/guru/Penilaian/Penilaian";
import TambahPenilaian from "./page/guru/Penilaian/TambahPenilaian";
import UpdatePenilaian from "./page/guru/Penilaian/UpdatePenilaian";
import PrivateRoute from "./routeer/PrivateRoute";
import EditGuru from "./page/guru/Profile/EditGuru";
import SettingGuru from "./page/guru/Profile/SettingGuru";

function App() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = DateTime.now().setZone("Asia/Jakarta");
      if (now.hour === 0 && now.minute === 0 && now.second === 0) {
        clearToken();
      }
    }, 1000); // cek setiap detik

    // Contoh pengaturan role setelah login
    const token = localStorage.getItem("token");
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (token && loggedInUser) {
      setUserRole(JSON.parse(loggedInUser).role);
    }

    return () => clearInterval(interval);
  }, []);

  const decodeToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  };

  const handleLogin = (user) => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserRole(user.role);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate(user.role === "ADMIN" ? "/dashboard_admin" : "/dashboard_guru");
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={(user) => handleLogin(user)} />}
        />
        <Route path="/register_admin" element={<RegisterAdmin />} />
        {userRole === "ADMIN" && <Navigate to="/dashboard_admin" />}
        {userRole === "GURU" && <Navigate to="/dashboard_guru" />}
        <Route element={<PrivateRoute role="ADMIN" />}>
          <Route path="/dashboard_admin" element={<DashboardSiswa />} />
          <Route path="/siswa" element={<Siswa />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/guru" element={<Guru />} />
          <Route path="/tambahsiswa" element={<TambahSiswa />} />
          <Route path="/tambahkelas" element={<TambahKelas />} />
          <Route path="/tambahguru" element={<TambahGuru />} />
          <Route path="/EditSiswa/:id" element={<UpdateSiswa />} />
          <Route path="/EditKelas/:id" element={<UpdateKelas />} />
          <Route path="/EditGuru/:id" element={<UpdateGuru />} />
          <Route path="/profile_admin" element={<ProfileAdmin />} />
          <Route path="/edit_password_admin" element={<Setting />} />
          <Route path="/edit_profile_admin" element={<EditAdmin />} />
        </Route>
        <Route element={<PrivateRoute role="GURU" />}>
          <Route path="/dashboard_guru" element={<DashboardGuru />} />
          <Route path="/piketan_guru" element={<PiketanGuru />} />
          <Route path="/kbm_guru" element={<KBMGuru />} />
          <Route path="/tambahkbm" element={<TambahKBM />} />
          <Route path="/tambahpiketan" element={<TambahPiketan />} />
          <Route path="/EditKBM/:id" element={<UpdateKBM />} />
          <Route path="/EditPiketan/:id" element={<UpdatePiketan />} />
          <Route path="/profile_guru" element={<ProfileGuru />} />
          <Route path="/Penilaian" element={<Penilaian />} />
          <Route path="/TambahPenilaian" element={<TambahPenilaian />} />
          <Route path="/EditPenilaian/:id" element={<UpdatePenilaian />} />
          <Route path="/edit_guru" element={<EditGuru />} />
          <Route path="/setting_guru" element={<SettingGuru />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/pdf" element={<PDFpiket />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
