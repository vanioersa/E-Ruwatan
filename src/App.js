import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register_admin" element={<RegisterAdmin />} />
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
          <Route path="/setting" element={<Setting />} />
          <Route path="/editProfileAdmin" element={<EditAdmin />} />
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
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/pdf" element={<PDFpiket />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
