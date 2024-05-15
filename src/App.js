import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
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
import UpdataKelas from "./page/murid/kelas/UpdataKelas";
import UpdateGuru from "./page/murid/guru/UpdateGuru";
import PDFpiket from "./component/PDF";
import UpdateKBM from "./page/guru/kbm/UpdateKBM";
import ProfileGuru from "./page/guru/Profile/Profile_guru";
import UpdatePiketan from "./page/guru/piketguru/UpdatePiketan";
import ProfileAdmin from "./page/murid/Profile Siswa/Profile_admin";
import Penilaian from "./page/guru/Penilaian/Penilaian";
import Setting from "./page/murid/Profile Siswa/Setting";
import EditAdmin from "./page/murid/Profile Siswa/EditAdmin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register_admin" element={<RegisterAdmin />} />

        {isLoggedIn ? (
          <>
            <Route path="/dashboard_admin" element={<DashboardSiswa />} />
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
            <Route path="/EditSiswa/:id" element={<UpdateSiswa />} />
            <Route path="/EditKelas/:id" element={<UpdataKelas />} />
            <Route path="/EditGuru/:id" element={<UpdateGuru />} />
            <Route path="/EditKBM/:id" element={<UpdateKBM />} />
            <Route path="/EditPiketan/:id" element={<UpdatePiketan />} />
            <Route path="/pdf" element={<PDFpiket />} />
            <Route path="/profile_guru" element={<ProfileGuru />} />
            <Route path="/profile_admin" element={<ProfileAdmin />} />
            <Route path="/Penilaian" element={<Penilaian />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/editprofileadmin" element={<EditAdmin />} />
          </>
        ) : (
          <>
            <Route path="/dashboard_admin" element={<Login />}/>
            <Route path="/dashboard_guru" element={<Login />}/>
            <Route path="/piketan_guru/" element={<Login />}/>
            <Route path="/kbm_guru/" element={<Login />}/>
            <Route path="/siswa" element={<Login />}/>
            <Route path="/kelas" element={<Login />}/>
            <Route path="/guru" element={<Login />}/>
            <Route path="/tambahsiswa" element={<Login />}/>
            <Route path="/tambahkelas" element={<Login />}/>
            <Route path="/tambahguru" element={<Login />}/>
            <Route path="/tambahkbm" element={<Login />}/>
            <Route path="/tambahpiketan" element={<Login />}/>
            <Route path="/EditSiswa/:id" element={<Login />}/>
            <Route path="/EditKelas/:id" element={<Login />}/>
            <Route path="/EditGuru/:id" element={<Login />}/>
            <Route path="/pdf" element={<Login />}/>
            <Route path="/profile_guru" element={<Login />} />
            <Route path="/profile_admin" element={<Login />} />
            <Route path="/Penilaian" element={<Login />} />
            <Route path="/EditPiketan/:id" element={<Login />} />
            <Route path="/setting" element={<Login />} />
            <Route path="/editprofileadmin" element={<Login />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
