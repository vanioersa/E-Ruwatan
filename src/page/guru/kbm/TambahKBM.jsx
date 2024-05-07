import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";
import { createKbm } from "./api_kbm";

const TambahKBM = () => {
  const [kbm, setKbm] = useState({
    namaId: "",
    kelasId: "",
    jam_masuk: "",
    jam_pulang: "",
    keterangan: "",
    materi: "",
  });

  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [username, setUsername] = useState(""); // Added state for username
  const navigate = useNavigate();

  useEffect(() => {
    fetchKelas();
    fetchUsername();
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }

  useEffect(() => {
    // Simulate fetching the username from localStorage
    const storedUsername = localStorage.getItem("username"); // Assume 'username' is saved in localStorage on login
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // Update the time every minute
    return () => clearInterval(interval);
  }, []);

  const fetchUsername = async () => {
    try { 
      const response = await axios.get("http://localhost:4001/users");
      setUsername(response.data.username);
    } catch (error) {
      console.error("Failed to retrieve user details: ", error);
    }
  };

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      const sanitizedKelas = response.data.map((kelas) => ({
        id: kelas.id,
        kelas: kelas.kelas ?? "", // Fallback to empty string if undefined
        nama_kelas: kelas.nama_kelas ?? "", // Fallback to empty string if undefined
      }));
      setKelas(sanitizedKelas);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKbm((prevKbm) => ({
      ...prevKbm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const kbmData = {
      namaId: username,
      kelasId: selectedKelas,
      jam_masuk: kbm.jam_masuk,
      jam_pulang: kbm.jam_pulang,
      keterangan: kbm.keterangan,
      materi: kbm.materi,
    };

    try {
      await createKbm(kbmData);
      Swal.fire({
        title: "Berhasil",
        text: "Data KBM Guru berhasil ditambahkan",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(-1); // Assuming you want to navigate back to a previous page
      });
    } catch (error) {
      console.error("Gagal menambahkan KBM Guru: ", error);
      let errorMessage = "Gagal menambahkan KBM Guru. Silakan coba lagi.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        title: "Gagal",
        text: errorMessage,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
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
        <h1 className="judul text-3xl font-semibold">Tambah KBM Guru</h1>
        <div className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah KBM Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
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
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.kelas && kelas.nama_kelas
                        ? `${kelas.kelas} - ${kelas.nama_kelas}`
                        : "No Class Info"}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
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
                  onChange={handleChange}
                  min={currentTime}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan Jam Masuk"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="jam_pulang"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Jam Selesai
                </label>
                <input
                  type="time"
                  id="jam_pulang"
                  name="jam_pulang"
                  value={kbm.jam_pulang}
                  onChange={handleChange}
                  min={currentTime}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan Jam Pulang"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="materi"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Materi
                </label>
                <input
                  type="text"
                  name="materi"
                  value={kbm.materi}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Materi"
                  required
                  autoComplete="off"
                />
              </div>
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
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan Keterangan"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={batal}
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-blue-700 py-3 text-sm sm:text-sm font-medium"
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

export default TambahKBM;