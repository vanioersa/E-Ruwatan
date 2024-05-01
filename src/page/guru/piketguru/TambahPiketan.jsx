import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";
import { createPiket } from "./api_piket";

const TambahPiketan = () => {
  const [piketan, setPiketan] = useState({
    kelasId: "",
    siswaId: "",
    tanggal: new Date().toISOString().slice(0, 10),
    status: "",
  });
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState("");
  const navigate = useNavigate();

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  const fetchSiswa = async () => {
    try {
      const response = await axios.get("http://localhost:4001/siswa/all");
      setSiswa(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Siswa: ", error);
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchSiswa();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPiketan((prevPiketan) => ({
      ...prevPiketan,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data piketan akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const date = new Date(piketan.tanggal);
          const day = date.getDate();
          const month = new Intl.DateTimeFormat("id-ID", {
            month: "long",
          }).format(date);
          const year = date.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;

          await createPiket({
            ...piketan,
            kelasId: selectedKelas,
            siswaId: selectedSiswa,
            tanggal: formattedDate,
          });
          Swal.fire({
            title: "Berhasil",
            text: "Piketan berhasil ditambahkan",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            navigate(-1);
          });
          setPiketan({
            kelasId: "",
            siswaId: "",
            tanggal: new Date().toISOString().slice(0, 10),
            status: "",
          });
        } catch (error) {
          console.error("Gagal menambahkan piketan: ", error);
          let errorMessage = "Gagal menambahkan piketan. Silakan coba lagi.";
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
        <h1 className="judul text-3xl font-semibold">Tambah Piketan</h1>
        <div className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah Piketan
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Kelas
                </label>
                <select
                  name="kelasId"
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((kelas) => (
                    <option className="text-sm" key={kelas.id} value={kelas.id}>
                      {kelas.kelas} - {kelas.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label
                  htmlFor="siswaId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Siswa
                </label>
                <select
                  name="siswaId"
                  value={selectedSiswa}
                  onChange={(e) => setSelectedSiswa(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Siswa</option>
                  {siswa.map((siswa) => (
                    <option className="text-sm" key={siswa.id} value={siswa.id}>
                      {siswa.nama_siswa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="tanggal"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={piketan.tanggal}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukan Tanggal"
                  required
                  readOnly
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Status
                </label>
                <input
                  type="radio"
                  id="status-masuk"
                  name="status"
                  value="masuk"
                  checked={piketan.status === "masuk"}
                  onChange={handleChange}
                  className="mr-1"
                />
                <label htmlFor="status-masuk" className="mr-3">
                  Masuk
                </label>
                <input
                  type="radio"
                  id="status-izin"
                  name="status"
                  value="izin"
                  checked={piketan.status === "izin"}
                  onChange={handleChange}
                  className="mr-1"
                />
                <label htmlFor="status-izin" className="mr-3">
                  Izin
                </label>
                <input
                  type="radio"
                  id="status-sakit"
                  name="status"
                  value="sakit"
                  checked={piketan.status === "sakit"}
                  onChange={handleChange}
                  className="mr-1"
                />
                <label htmlFor="status-sakit" className="mr-3">
                  Sakit
                </label>
                <input
                  type="radio"
                  id="status-alpha"
                  name="status"
                  value="alpha"
                  checked={piketan.status === "alpha"}
                  onChange={handleChange}
                  className="mr-1"
                />
                <label htmlFor="status-alpha">Alpha</label>
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

export default TambahPiketan;
