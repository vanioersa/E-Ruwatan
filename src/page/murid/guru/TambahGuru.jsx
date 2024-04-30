import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { createGuru } from "./api_guru";

const TambahGuru = () => {
  const [guru, setGuru] = useState({
    nama_guru: "",
    nip: "",
    tempat_lahir: "",
    mapel: "",
    kelasId: "",
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
    setGuru((prevGuru) => ({
      ...prevGuru,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data guru akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createGuru({ ...guru, kelasId: selectedKelas });
          Swal.fire({
            title: "Berhasil",
            text: "Guru berhasil ditambahkan",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            navigate(-1);
          });
          setGuru({
            nama_guru: "",
            nip: "",
            tempat_lahir: "",
            mapel: "",
            kelasId: "",
          });
        } catch (error) {
          console.error("Gagal menambahkan guru: ", error);
          let errorMessage = "Gagal menambahkan guru. Silakan coba lagi.";
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
        <Sidebar />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Tambah Guru</h1>
        <div className="add-guru mt-12 bg-white p-5 ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label htmlFor="nama_guru" className="block mb-2 text-sm sm:text-sm font-medium text-gray-900">
                  Nama Guru
                </label>
                <input
                  type="text"
                  name="nama_guru"
                  value={guru.nama_guru}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan Nama Guru"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label htmlFor="nip" className="block mb-2 text-sm sm:text-sm font-medium text-gray-900">
                  NIP
                </label>
                <input
                  type="number"
                  name="nip"
                  value={guru.nip}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan NIP"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label htmlFor="tempat_lahir" className="block mb-2 text-sm sm:text-sm font-medium text-gray-900">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={guru.tempat_lahir}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Tempat Lahir"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label htmlFor="mapel" className="block mb-2 text-sm sm:text-sm font-medium text-gray-900">
                  Mapel
                </label>
                <input
                  type="text"
                  name="mapel"
                  value={guru.mapel}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan Nama Mapel Yang Diampu"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="kelasId" className="block mb-2 text-sm sm:text-sm font-medium text-gray-900">
                Kelas
              </label>
              <select
                name="kelasId"
                value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option value="">Pilih Kelas</option>
                {kelas.map((kelas) => (
                  <option className="text-sm" key={kelas.id} value={kelas.id}>
                    {kelas.kelas}
                  </option>
                ))}
              </select>
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
                onClick={handleSubmit}
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

export default TambahGuru;
