import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { getUsersById, updateUsers } from "./api_guru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import dayjs from "dayjs";

const UpdateGuru = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState([]);
  const [guru, setGuru] = useState({
    username: "",
    email: "",
    alamat: "",
    gender: "",
    telepon: "",
    password: "",
    tanggal: "",
    tempat: "",
    nik: "",
    nip: "",
    jabatan: "",
    hobi: "",
    kelasId: "",
  });

  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const guruData = await getUsersById(id);
        setGuru(guruData);
      } catch (error) {
        console.error("Failed to fetch guru:", error);
      }
    };

    fetchGuru();
  }, [id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "telepon") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (!formattedValue.startsWith("08")) {
        formattedValue = "08" + formattedValue;
      }
      setGuru((prevGuru) => ({
        ...prevGuru,
        [name]: formattedValue.slice(0, 13),
      }));
    } else if (name === "tanggal") {
      const formattedDate = dayjs(value, "YYYY-MM-DD").format("DD-MM-YYYY");
      setGuru((prevGuru) => ({
        ...prevGuru,
        [name]: formattedDate,
      }));
    } else if (name === "jabatan" && value !== "WaliKelas") {
      setGuru((prevGuru) => ({
        ...prevGuru,
        [name]: value,
        kelasId: "",
      }));
    } else {
      setGuru((prevGuru) => ({
        ...prevGuru,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const initialGuruData = await getUsersById(id);

    const isDataChanged =
      initialGuruData.username !== guru.username ||
      initialGuruData.email !== guru.email ||
      initialGuruData.alamat !== guru.alamat ||
      initialGuruData.gender !== guru.gender ||
      initialGuruData.telepon !== guru.telepon ||
      initialGuruData.password !== guru.password ||
      initialGuruData.tanggal !== guru.tanggal ||
      initialGuruData.tempat !== guru.tempat ||
      initialGuruData.nik !== guru.nik ||
      initialGuruData.nip !== guru.nip ||
      initialGuruData.jabatan !== guru.jabatan ||
      initialGuruData.hobi !== guru.hobi ||
      initialGuruData.kelasId !== guru.kelasId;

    if (!isDataChanged) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Minimal satu data harus diubah",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (guru.password && guru.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password harus minimal 8 karakter",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      const updatedGuru = { ...guru };
      await updateUsers(id, updatedGuru);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data guru berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Failed to update guru:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui data guru. Silakan coba lagi.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Update Guru</h1>
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Update Guru
          </p>
          <form onSubmit={handleSubmit}>
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
                  value={guru.username}
                  onChange={handleChange}
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
                  value={guru.email}
                  onChange={handleChange}
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
                  value={guru.password}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Kata Sandi"
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
                  Jenis Kelamin
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={guru.gender}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                  value={dayjs(guru.tanggal, "DD-MM-YYYY").format("YYYY-MM-DD")}
                  onChange={handleChange}
                  max={dayjs().format("YYYY-MM-DD")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tanggal"
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
                  value={guru.tempat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tempat"
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
                  value={guru.alamat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Alamat"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="telepon"
                  className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
                >
                  Nomor Telepon
                </label>
                <input
                  id="telepon"
                  name="telepon"
                  type="text"
                  value={guru.telepon}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Telepon"
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
                  value={guru.nik}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIK"
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
                  value={guru.nip}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIP"
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
                  value={guru.jabatan}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="Bukan WaliKelas">Bukan WaliKelas</option>
                  <option value="WaliKelas">WaliKelas</option>
                </select>
              </div>

              {guru.jabatan === "WaliKelas" && (
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
                      value={guru.kelasId}
                      onChange={handleChange}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    >
                      {kelas.map((kelas) => (
                    <option className="text-sm" key={kelas.id} value={kelas.id}>
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
                      value={guru.hobi}
                      onChange={handleChange}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Masukkan Hobi"
                      required
                    />
                  </div>
                </>
              )}

              {guru.jabatan !== "WaliKelas" && (
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
                    value={guru.hobi}
                    onChange={handleChange}
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
                onClick={handleCancel}
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

export default UpdateGuru;
