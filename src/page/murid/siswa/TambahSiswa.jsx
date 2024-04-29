import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { createSiswa } from "./api_siswa";

const TambahSiswa = () => {
  const [siswa, setSiswa] = useState({
    nama_siswa: "",
    nisn: "",
    kelasId: "",
    tempat: "",
    alamat: "",
  });
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const navigate = useNavigate();

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiswa((prevSiswa) => ({
      ...prevSiswa,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data murid akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createSiswa({ ...siswa, kelasId: selectedKelas });
          Swal.fire({
            title: "Berhasil",
            text: "Murid berhasil ditambahkan",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            navigate(-1);
          });
          setSiswa({
            nama_siswa: "",
            nisn: "",
            kelasId: "",
            tempat: "",
            alamat: "",
          });
        } catch (error) {
          console.error("Gagal menambahkan siswa: ", error);
          let errorMessage = "Gagal menambahkan murid. Silakan coba lagi.";
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
    window.location.href = "/siswa"
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Tambah Siswa</h1>
        <div className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah Siswa
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nama_siswa"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="nama_siswa"
                  name="nama_siswa"
                  value={siswa.nama_siswa}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nama Siswa"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="nisn"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  NISN
                </label>
                <input
                  type="number"
                  id="nisn"
                  name="nisn"
                  value={siswa.nisn}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NISN"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
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
                  <option value="">Pilih Kelas dan Nama Kelas</option>
                    {kelas.map((kelas) => (
                      <option key={kelas.id} value={kelas.id}>
                        {`${kelas.kelas} - ${kelas.nama_kelas}`}
                      </option>
                    ))}
                </select>
              </div>
              <div className="relative">
                <label
                  htmlFor="tempat"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  id="tempat"
                  name="tempat"
                  value={siswa.tempat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tempat Lahir"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="alamat"
                className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
              >
                Alamat
              </label>
              <input
                type="text"
                id="alamat"
                name="alamat"
                value={siswa.alamat}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Masukkan Alamat"
                required
                autoComplete="off"
              />
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
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-700 py-3 text-sm sm:text-sm font-medium"
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

export default TambahSiswa;