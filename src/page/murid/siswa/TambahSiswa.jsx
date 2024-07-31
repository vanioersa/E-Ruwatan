import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { createSiswa } from "./api_siswa";
import dayjs from "dayjs";

const TambahSiswa = () => {
  const [siswa, setSiswa] = useState({
    nama_siswa: "",
    gender: "",
    tanggal: "",
    tempat: "",
    alamat: "",
    telepon: "",
    nik: "",
    nis: "",
    nisn: "",
    kelasId: "",
  });
  const [kelas, setKelas] = useState([]);
  const [allSiswa, setAllSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const navigate = useNavigate();

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data.reverse());
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  const fetchAllSiswa = async () => {
    try {
      const response = await axios.get("http://localhost:4001/siswa/all");
      setAllSiswa(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Siswa: ", error);
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchAllSiswa();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telepon") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (!formattedValue.startsWith("08")) {
        formattedValue = "08" + formattedValue;
      }
      setSiswa((prevSiswa) => ({
        ...prevSiswa,
        [name]: formattedValue.slice(0, 13),
      }));
    } else if (name === "tanggal") {
      const formattedDate = dayjs(value, "YYYY-MM-DD").format("DD-MM-YYYY");
      setSiswa((prevSiswa) => ({
        ...prevSiswa,
        [name]: formattedDate,
      }));
    } else {
      setSiswa((prevSiswa) => ({
        ...prevSiswa,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (siswa.nisn.length !== 10) {
      Swal.fire({
        title: "Gagal",
        text: "NISN harus memiliki panjang 10 karakter",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (siswa.nik.length !== 16) {
      Swal.fire({
        title: "Gagal",
        text: "NIK harus memiliki panjang 16 karakter",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (siswa.nis.length < 8 || siswa.nis.length > 15) {
      Swal.fire({
        title: "Gagal",
        text: "NIS harus memiliki panjang antara 8 dan 15 karakter",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const nisnExists = allSiswa.some((s) => s.nisn === siswa.nisn);
    if (nisnExists) {
      Swal.fire({
        title: "Gagal",
        text: "NISN sudah digunakan",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const nisExists = allSiswa.some((s) => s.nis === siswa.nis);
    if (nisExists) {
      Swal.fire({
        title: "Gagal",
        text: "NIS sudah digunakan",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const nikExists = allSiswa.some((s) => s.nik === siswa.nik);
    if (nikExists) {
      Swal.fire({
        title: "Gagal",
        text: "NIK sudah digunakan",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data siswa akan disimpan",
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
            text: "Siswa berhasil ditambahkan",
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
            nik: "",
            nis: "",
            tanggal: "",
            telepon: "",
            gender: "",
          });
        } catch (error) {
          console.error("Gagal menambahkan siswa: ", error);
          let errorMessage = "Gagal menambahkan siswa. Silakan coba lagi.";
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
        <h1 className="judul text-3xl font-semibold">Tambah Siswa</h1>
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 bg-white p-5 mr-0 md:ml-8 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Tambah Siswa
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nama_siswa"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama_siswa"
                  name="nama_siswa"
                  value={siswa.nama_siswa}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nama Siswa"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Jenis Kelamin
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={siswa.gender}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="tanggal"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={dayjs(siswa.tanggal, "DD-MM-YYYY").format("YYYY-MM-DD")}
                  onChange={handleChange}
                  max={dayjs().format("YYYY-MM-DD")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="tempat"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  id="tempat"
                  name="tempat"
                  value={siswa.tempat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tempat Lahir"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="alamat"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Alamat Rumah
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={siswa.alamat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Alamat Rumah"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="telepon"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Telepon
                </label>
                <input
                  type="text"
                  id="telepon"
                  name="telepon"
                  value={siswa.telepon}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nomor Telepon"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nisn"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  NISN
                </label>
                <input
                  type="text"
                  id="nisn"
                  name="nisn"
                  value={siswa.nisn}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NISN"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="nik"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  NIK
                </label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={siswa.nik}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIK"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nis"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  NIS
                </label>
                <input
                  type="text"
                  id="nis"
                  name="nis"
                  value={siswa.nis}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIS"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Kelas
                </label>
                <select
                  id="kelasId"
                  name="kelasId"
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((kelas) => (
                    <option className="text-sm" key={kelas.id} value={kelas.id}>
                      {`${kelas.kelas} - ${kelas.nama_kelas}`}
                    </option>
                  ))}
                </select>
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

export default TambahSiswa;
