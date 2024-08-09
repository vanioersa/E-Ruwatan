import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";

const apiUrl = "http://localhost:4001";

const TambahGuru = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    tanggal: "",
    tempat: "",
    alamat: "",
    telepon: "",
    nik: "",
    nip: "",
    jabatan: "",
    kelasId: null,
    hobi: "",
  });
  const [kelas, setKelas] = useState([]);
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kelas/all");
        setKelas(response.data.reverse());
      } catch (error) {
        console.error("Gagal mengambil data Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "telepon") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (!formattedValue.startsWith("08")) {
        formattedValue = "08" + formattedValue;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedValue.slice(0, 13),
      }));
    } else if (name === "tanggal") {
      const formattedDate = dayjs(value, "YYYY-MM-DD").format("DD-MM-YYYY");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedDate,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      username,
      email,
      password,
      gender,
      tanggal,
      tempat,
      alamat,
      telepon,
      nik,
      nip,
      jabatan,
      kelasId,
      hobi,
    } = formData;

    if (!username.match(/^[A-Za-z\s]+$/)) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Username hanya boleh berisi huruf dan spasi",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!username.charAt(0).match(/^[A-Z]$/)) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Huruf pertama username harus kapital",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password harus terdiri dari minimal 8 karakter",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password harus terdiri dari angka dan huruf",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const { data } = await axios.get(`${apiUrl}/users`, {
        params: { nik, nip, telepon },
      });
      if (data.nik) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "NIK sudah digunakan",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      if (data.nip) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "NIP sudah digunakan",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      if (data.telepon) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Telepon sudah digunakan",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data guru akan disimpan",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
      });

      if (result.isConfirmed) {
        const response = await axios.post(`${apiUrl}/register`, {
          username,
          email,
          password,
          gender,
          tanggal,
          tempat,
          alamat,
          telepon,
          nik,
          nip,
          jabatan,
          kelasId: jabatan === "WaliKelas" ? kelasId : null,
          hobi,
          role: "GURU",
        });

        if (response.data) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Guru berhasil ditambahkan",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => navigate(-1));
        }
      }
    } catch (error) {
      let errorMessage = "gagal! Silakan coba lagi.";
      if (error.response?.status === 401) {
        errorMessage = "Username atau email sudah digunakan.";
      } else {
        errorMessage = error.response?.data?.message || "Terjadi kesalahan.";
      }
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
        timer: 2000,
        showConfirmButton: false,
      });
      console.error(error);
    }
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
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-8 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Tambah Guru
          </p>
          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Nama Guru
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Kata Sandi
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
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer md:top-10 top-7 sm:top-8 sm:bottom-3"
                >
                  {passwordType === "password" ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>

              <div className="relative">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Gender</option>
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
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  value={dayjs(formData.tanggal, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  )}
                  onChange={handleInputChange}
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
                  id="tempat"
                  name="tempat"
                  type="text"
                  autoComplete="off"
                  value={formData.tempat}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tempat Lahir"
                  required
                />
              </div>
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
                  required
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
                  id="telepon"
                  name="telepon"
                  type="number"
                  autoComplete="off"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nomor Telepon"
                  maxLength={12}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nik"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  NIK
                </label>
                <input
                  id="nik"
                  name="nik"
                  type="text"
                  autoComplete="off"
                  value={formData.nik}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIK"
                  required
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="nip"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  NIP
                </label>
                <input
                  id="nip"
                  name="nip"
                  type="text"
                  autoComplete="off"
                  value={formData.nip}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIP"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="jabatan"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Jabatan
                </label>
                <select
                  id="jabatan"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="Bukan WaliKelas">Bukan WaliKelas</option>
                  <option value="WaliKelas">WaliKelas</option>
                </select>
              </div>

              {formData.jabatan === "WaliKelas" && (
                <>
                  <div className="relative">
                    <label
                      htmlFor="kelasId"
                      className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                    >
                      Pilih Kelas
                    </label>
                    <select
                      id="kelasId"
                      name="kelasId"
                      value={formData.kelasId}
                      onChange={handleInputChange}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      {kelas.map((kelas) => (
                        <option
                          className="text-sm"
                          key={kelas.id}
                          value={kelas.id}
                        >
                          {`${kelas.kelas} - ${kelas.nama_kelas}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative col-span-2">
                    <label
                      htmlFor="hobi"
                      className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                    >
                      Hobi
                    </label>
                    <input
                      id="hobi"
                      name="hobi"
                      type="text"
                      autoComplete="off"
                      value={formData.hobi}
                      onChange={handleInputChange}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Masukkan Hobi"
                      required
                    />
                  </div>
                </>
              )}

              {formData.jabatan !== "WaliKelas" && (
                <div className="relative">
                  <label
                    htmlFor="hobi"
                    className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                  >
                    Hobi
                  </label>
                  <input
                    id="hobi"
                    name="hobi"
                    type="text"
                    autoComplete="off"
                    value={formData.hobi}
                    onChange={handleInputChange}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Masukkan Hobi"
                    required
                  />
                </div>
              )}
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
