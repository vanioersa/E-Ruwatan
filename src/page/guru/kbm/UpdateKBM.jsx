import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";
import { getKbmById, updateKbm } from "./api_kbm";

const UpdateKBM = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const [kbm, setKbm] = useState({
    namaId: "",
    kelasId: "",
    jam_masuk: "",
    jam_pulang: "",
    keterangan: "",
    materi: "",
  });

  const [kelas, setKelas] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kelas/all");
        setKelas(response.data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchKelas();

    const fetchKbmData = async () => {
      try {
        const kbmData = await getKbmById(id);
        setKbm({
          ...kbmData,
          namaId: username,
        });
      } catch (error) {
        console.error("Failed to fetch KBM data:", error);
      }
    };

    fetchKbmData();
  }, [id, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKbm((prevKbm) => ({
      ...prevKbm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { jam_masuk, jam_pulang } = kbm;

    if (
      new Date(`2000-01-01T${jam_masuk}`) >=
      new Date(`2000-01-01T${jam_pulang}`)
    ) {
      Swal.fire("Gagal", "Jam pulang harus lebih dari jam masuk.", "error");
      return;
    }

    try {
      await updateKbm(id, kbm);
      Swal.fire("Berhasil", "Data KBM berhasil diperbarui", "success").then(
        () => {
          navigate(-1);
        }
      );
    } catch (error) {
      console.error("Failed to update KBM:", error);
      Swal.fire("Gagal", "Gagal memperbarui KBM. Silakan coba lagi.", "error");
    }
  };

  const batal = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Update KBM Guru</h1>
        <div className="update-kbm mt-12 bg-white p-5 ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Update KBM Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              {/* Tampilkan nama guru yang sedang login dan tidak dapat diubah */}
              <div className="relative">
                <label
                  htmlFor="namaId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Guru
                </label>
                <input
                  type="text"
                  id="namaId"
                  name="namaId"
                  value={username}
                  readOnly
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg block w-full p-2.5"
                />
              </div>
              {/* Selector untuk kelas */}
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Kelas
                </label>
                <select
                  id="kelasId"
                  name="kelasId"
                  value={kbm.kelasId}
                  onChange={(e) => handleChange(e)}
                  className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg block w-full p-2.5"
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                     {kelas.kelas} - {kelas.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Form input untuk jam masuk dan pulang */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div className="relative">
                <label
                  htmlFor="jam_masuk"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Jam Masuk
                </label>
                <input
                  type="time"
                  id="jam_masuk"
                  name="jam_masuk"
                  value={kbm.jam_masuk}
                  onChange={(e) => handleChange(e)}
                  className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg block w-full p-2.5"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="jam_pulang"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Jam Pulang
                </label>
                <input
                  type="time"
                  id="jam_pulang"
                  name="jam_pulang"
                  value={kbm.jam_pulang}
                  onChange={(e) => handleChange(e)}
                  className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg block w-full p-2.5"
                />
              </div>
            </div>
            {/* Form input untuk keterangan dan materi */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div className="relative">
                <label
                  htmlFor="keterangan"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Keterangan
                </label>
                <input
                  type="text"
                  id="keterangan"
                  name="keterangan"
                  value={kbm.keterangan}
                  onChange={(e) => handleChange(e)}
                  className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg block w-full p-2.5"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="materi"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Materi
                </label>
                <input
                  type="text"
                  id="materi"
                  name="materi"
                  value={kbm.materi}
                  onChange={(e) => handleChange(e)}
                  className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg block w-full p-2.5"
                />
              </div>
            </div>
            {/* Button untuk submit dan batal */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={batal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-white rounded-lg transition duration-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateKBM;