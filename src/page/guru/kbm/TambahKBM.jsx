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

  const [guru, setGuru] = useState([]);
  const [selectedGuru, setSelectedGuru] = useState("");
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const currentTime = useState(getCurrentTime());
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuru();
    fetchKelas();
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }

  const fetchGuru = async () => {
    try {
      const response = await axios.get("http://localhost:4001/guru/all");
      setGuru(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Guru: ", error);
    }
  };

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "jam_masuk" || name === "jam_pulang") {
      if (value < currentTime) {
        // Menampilkan pesan error jika waktu yang dimasukkan kurang dari waktu sekarang
        Swal.fire({
          title: "Gagal",
          text: `Jam ${name === "jam_masuk" ? "masuk" : "pulang"} harus lebih besar dari waktu sekarang.`,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }
    }

    setKbm((prevKbm) => ({
      ...prevKbm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { jam_masuk, jam_pulang } = kbm;

    const startTime = new Date(`2000-01-01T${jam_masuk}`);
    const endTime = new Date(`2000-01-01T${jam_pulang}`);

    // Memastikan jam pulang lebih besar dari jam masuk
    if (endTime <= startTime) {
      Swal.fire({
        title: "Gagal",
        text: "Jam pulang harus lebih dari jam masuk.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data KBM Guru akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createKbm({
            namaId: selectedGuru,
            kelasId: selectedKelas,
            jam_masuk: kbm.jam_masuk,
            jam_pulang: kbm.jam_pulang,
            materi: kbm.materi,
            keterangan: kbm.keterangan,
          });
          Swal.fire({
            title: "Berhasil",
            text: "Data KBM Guru berhasil ditambahkan",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            navigate(-1);
          });
          setKbm({
            namaId: "",
            kelasId: "",
            jam_masuk: "",
            jam_pulang: "",
            keterangan: "",
            materi: "",
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
      }
    });
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
        <div className="add-guru mt-12 bg-white p-5 ml-8 border border-gray-200 rounded-xl shadow-lg">
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
                      {kelas.kelas}
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
                <select
                  id="namaId"
                  name="namaId"
                  value={selectedGuru}
                  onChange={(e) => setSelectedGuru(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Guru</option>
                  {guru.map((guru) => (
                    <option key={guru.id} value={guru.id}>
                      {guru.nama_guru}
                    </option>
                  ))}
                </select>
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
                  Jam Pulang
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
                  id="materi"
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
