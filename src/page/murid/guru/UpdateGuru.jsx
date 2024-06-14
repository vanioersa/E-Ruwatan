import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { getUsersById, updateUsers } from "./api_guru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const UpdateGuru = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [guru, setGuru] = useState({
    username: "",
    email: "",
    alamat: "",
    gender: "",
    telepon: "",
    status_nikah: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuru((prevGuru) => ({
      ...prevGuru,
      [name]: value,
    }));
  };

  const handleSubmiit = async (e) => {
    e.preventDefault();

    const initialGuruData = await getUsersById(id);

    const isDataChanged =
      initialGuruData.username !== guru.username ||
      initialGuruData.email !== guru.email ||
      initialGuruData.alamat !== guru.alamat ||
      initialGuruData.gender !== guru.gender ||
      initialGuruData.telepon !== guru.telepon ||
      initialGuruData.status_nikah !== guru.status_nikah;

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

    // Validasi password minimal 8 karakter saat ingin mengganti password
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

  const handleChangey = (e) => {
    const { name, value } = e.target;
    setGuru((prevGuru) => {
      // Logika khusus untuk kolom nomor telepon
      if (name === "telepon") {
        // Pastikan angka 08 tetap di depan
        if (value.startsWith("08")) {
          return { ...prevGuru, [name]: value };
        } else {
          return { ...prevGuru, [name]: "08" };
        }
      }
      return { ...prevGuru, [name]: value };
    });
  };

  const handleSubmite = (e) => {
    e.preventDefault();
    if (guru.telepon.length < 10) {
      // Menampilkan SweetAlert jika nomor telepon kurang dari 10 digit
      Swal.fire({
        icon: "error",
        title: "Nomor telepon tidak valid",
        text: "Nomor telepon harus memiliki minimal 10 digit.",
      });
    } else {
      // Logika untuk submit data yang valid
      console.log("Data valid:", guru);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diperbarui.",
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
          <form onSubmit={handleSubmite}>
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
                  value={guru.alamat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Alamat"
                />
              </div>

              <form onSubmit={handleSubmiit}>
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
                    type="number"
                    autoComplete="off"
                    value={guru.telepon}
                    onChange={handleChangey}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Masukkan Nomor Telepon"
                    minLength={10}
                  />
                </div>
              </form>
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
                  value={guru.gender}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                  value={guru.status_nikah}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Pilih Status Nikah</option>
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Menikah">Menikah</option>
                  <option value="Cerai">Cerai</option>
                </select>
              </div>
            </div>

            <div className="relative mt-4">
              <label
                htmlFor="password"
                className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                value={guru.password}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Masukkan password yang akan diubah"
              />
              <div
                className="icon-container"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-400"
                />
              </div>
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
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-[#0b409c] py-3 text-sm sm:text-sm font-medium"
              >
                Perbarui
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
      .icon-container {
        position: absolute;
        top: 70%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
      }
      `}</style>
    </div>
  );
};

export default UpdateGuru;
