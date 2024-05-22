import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/SidebarGuru";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { getGuruById, updateGuru } from "./api_guru";

const EditGuru = () => {const id = localStorage.getItem("id");


  const [guru, setGuru] = useState({
    username: "",
    email: "",
    alamat: "",
    gender: "",
    telepon: "",
    status_nikah: "",
  });

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const guruData = await getGuruById(id);
        setGuru(guruData);
      } catch (error) {
        console.error("Failed to fetch guru:", error);
      }
    };

    fetchGuru();
  }, [id]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setGuru(userData);
    }
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

    try {
      await updateGuru(id, guru);
      // Menampilkan pesan sukses menggunakan Swal
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data Guru berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        // Setelah berhasil, tidak perlu lagi reload halaman atau login ulang
        // Cukup set state guru dengan data yang baru
        setGuru(guru);
      });
    } catch (error) {
      console.error("Gagal memperbarui data guru:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui data guru. Silakan coba lagi.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex flex-grow items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="mt-20 md:mt-20">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="default-tab"
                data-tabs-toggle="#default-tab-content"
                role="tablist"
              >
                <li className="me-2" role="presentation">
                  <Link to={"/profile_guru"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg"
                      id="profile-tab"
                      data-tabs-target="#profile"
                      type="button"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >
                      Profile
                    </button>
                  </Link>
                </li>
                <li className="me-2" role="presentation">
                  <Link to={"/edit_guru"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      id="settings-tab"
                      data-tabs-target="#settings"
                      type="button"
                      role="tab"
                      aria-controls="settings"
                      aria-selected="false"
                    >
                      Edit Profile
                    </button>
                  </Link>
                </li>
                <li className="me-2" role="presentation">
                  <Link to={"/setting_guru"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      id="settings-tab"
                      data-tabs-target="#settings"
                      type="button"
                      role="tab"
                      aria-controls="settings"
                      aria-selected="false"
                    >
                      Settings
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-b-2 block md:flex">
            <div className="md:flex-1 p-8 bg-white lg:ml-4 shadow-md">
              <div className="rounded shadow p-6">
                <h1 className="text-xl font-semibold">
                  <strong>Edit Profile</strong>
                </h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="pb-4">
                      <label
                        htmlFor="username"
                        className="font-semibold text-gray-700 block pb-1"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        className="border rounded-r px-4 py-2 w-full"
                        type="text"
                        autoComplete="off"
                        value={guru.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pb-4">
                      <label
                        htmlFor="email"
                        className="font-semibold text-gray-700 block pb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        className="border rounded-r px-4 py-2 w-full"
                        type="email"
                        autoComplete="off"
                        value={guru.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pb-4">
                      <label
                        htmlFor="alamat"
                        className="font-semibold text-gray-700 block pb-1"
                      >
                        Alamat
                      </label>
                      <input
                        id="alamat"
                        name="alamat"
                        autoComplete="off"
                        className="border rounded-r px-4 py-2 w-full"
                        type="text"
                        value={guru.alamat}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pb-4">
                      <label
                        htmlFor="telepon"
                        className="font-semibold text-gray-700 block pb-1"
                      >
                        Telepon
                      </label>
                      <input
                        id="telepon"
                        name="telepon"
                        autoComplete="off"
                        className="border rounded-r px-4 py-2 w-full"
                        type="text"
                        value={guru.telepon}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pb-4">
                      <label
                        htmlFor="gender"
                        className="font-semibold text-gray-700 block pb-1"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        autoComplete="off"
                        className="border rounded-r px-4 py-2 w-full"
                        value={guru.gender}
                        onChange={handleChange}
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="pb-4">
                      <label
                        htmlFor="status_nikah"
                        className="font-semibold text-gray-700 block pb-1"
                      >
                        Status Nikah
                      </label>
                      <select
                        id="status_nikah"
                        name="status_nikah"
                        autoComplete="off"
                        className="border rounded-r px-4 py-2 w-full"
                        value={guru.status_nikah}
                        onChange={handleChange}
                      >
                        <option value="">Pilih Status Nikah</option>
                        <option value="Belum Menikah">Belum Menikah</option>
                        <option value="Menikah">Menikah</option>
                        <option value="Cerai">Cerai</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="text-md font-bold text-white bg-blue-500 rounded-full px-8 py-2 hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGuru;
