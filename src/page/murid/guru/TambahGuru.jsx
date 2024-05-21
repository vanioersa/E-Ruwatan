import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const apiUrl = "http://localhost:4001";

const TambahGuru = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    alamat: "",
    gender: "",
    telepon: "",
    status_nikah: "",
  });

  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, alamat, gender, telepon, status_nikah } =
      formData;

    if (!username.match(/^[A-Za-z\s]+$/)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Username hanya boleh berisi huruf dan spasi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!username.charAt(0).match(/^[A-Z]$/)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Huruf pertama username harus kapital",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus terdiri dari minimal 8 karakter",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus terdiri dari angka dan huruf",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Validasi input di sini sebelum melakukan registrasi
    if (!username || !email || !password) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Semua kolom harus diisi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

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
          const response = await axios.post(`${apiUrl}/register`, {
            username,
            email,
            password,
            alamat,
            gender,
            telepon,
            status_nikah,
            role: "GURU",
          });

          if (response.data) {
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Guru berhasil ditambahkan",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              navigate(-1);
            });
          }
        } catch (error) {
          let errorMessage = "Registrasi gagal! Silakan coba lagi.";
          if (error.response?.status === 401) {
            errorMessage = "Username atau email sudah digunakan.";
          } else {
            errorMessage =
              error.response?.data?.message || "Terjadi kesalahan.";
          }
          Swal.fire({
            icon: "error",
            title: "Registrasi Gagal!",
            text: errorMessage,
            timer: 2000,
            showConfirmButton: false,
          });
          console.error(error);
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
        <div style={{ backgroundColor: "white" }} className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Tambah Guru
          </p>
          <form onSubmit={handleRegister}>
            {/* Form Input untuk Setiap Field */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Nama Pengguna (Username)
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nama Pengguna"
                  required
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Email"
                  required
                />
              </div>
            </div>

            <div className="relative mt-3">
              <label
                htmlFor="password"
                className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
              >
                Kata Sandi (Password)
              </label>
              <input
                id="password"
                name="password"
                type={passwordType}
                autoComplete="off"
                value={formData.password}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Masukkan Kata Sandi"
                required
              />
              <span
                onClick={togglePassword}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer bottom-7 sm:bottom-3"
              >
                {passwordType === "password" ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            {/* Pesan pemberitahuan di bawah field password */}
            <p className="text-gray-500 text-sm text-center my-5">
              *Field Alamat, Telepon, Jenis Kelamin, dan Status Nikah boleh
              kosong
            </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="alamat"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Alamat
                </label>
                <input
                  id="alamat"
                  name="alamat"
                  type="text"
                  autoComplete="off"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Alamat"
                  // required
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="telepon"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Nomor Telfon
                </label>
                <input
                  id="telepon"
                  name="telepon"
                  type="number"
                  autoComplete="off"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nomor Telepon"
                  // required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
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
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  // required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="relative">
                <label
                  htmlFor="status_nikah"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Status Nikah
                </label>
                <select
                  id="status_nikah"
                  name="status_nikah"
                  value={formData.status_nikah}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  // required
                >
                  <option value="">Pilih Status Nikah</option>
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Cerai">Cerai</option>
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

export default TambahGuru;
