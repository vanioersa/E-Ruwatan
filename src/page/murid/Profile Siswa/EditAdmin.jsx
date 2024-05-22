import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import { getAdminById, updateAdmin } from "./api_admin";

const EditAdmin = () => {const id = localStorage.getItem("id");

  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    alamat: "",
    gender: "",
    telepon: "",
    status_nikah: "",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminData = await getAdminById(id);
        setAdmin(adminData);
      } catch (error) {
        console.error("Failed to fetch admin:", error);
      }
    };

    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const initialAdminData = await getAdminById(id);

    const isDataChanged =
      initialAdminData.username !== admin.username ||
      initialAdminData.email !== admin.email ||
      initialAdminData.alamat !== admin.alamat ||
      initialAdminData.gender !== admin.gender ||
      initialAdminData.telepon !== admin.telepon ||
      initialAdminData.status_nikah !== admin.status_nikah;

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

    try {
      await updateAdmin(id, admin);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data admin berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload()
      });
    } catch (error) {
      console.error("Failed to update admin:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui data admin. Silakan coba lagi.",
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
                  <Link to={"/profile_admin"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
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
                  <Link to={"/edit_profile_admin"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
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
                  <Link to={"/edit_password_admin"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                      id="settings-tab"
                      data-tabs-target="#settings"
                      type="button"
                      role="tab"
                      aria-controls="settings"
                      aria-selected="false"
                    >
                      Edit Password
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="block md:flex">
            <div
              style={{ backgroundColor: "white" }}
              className="md:flex-1 py-10 px-14 lg:ml-4 rounded-xl shadow-md"
            >
              <h1 className="text-xl font-semibold text-gray-800">
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
                      className="border rounded-r px-4 py-2 w-full text-gray-600"
                      type="text"
                      autoComplete="off"
                      value={admin.username}
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
                      className="border rounded-r px-4 py-2 w-full text-gray-600"
                      type="email"
                      autoComplete="off"
                      value={admin.email}
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
                      className="border rounded-r px-4 py-2 w-full text-gray-600"
                      type="text"
                      value={admin.alamat}
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
                      className="border rounded-r px-4 py-2 w-full text-gray-600"
                      type="number"
                      value={admin.telepon}
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
                      className="border rounded-r px-4 py-2 w-full text-gray-700"
                      value={admin.gender}
                      onChange={handleChange}
                    >
                      <option className="text-gray-700" value="">Pilih Jenis Kelamin</option>
                      <option className="text-gray-700" value="Laki-laki">Laki-laki</option>
                      <option className="text-gray-700" value="Perempuan">Perempuan</option>
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
                      className="border rounded-r px-4 py-2 w-full text-gray-700"
                      value={admin.status_nikah}
                      onChange={handleChange}
                    >
                      <option className="text-gray-700" value="">Pilih Status Nikah</option>
                      <option className="text-gray-700" value="Belum Menikah">Belum Menikah</option>
                      <option className="text-gray-700" value="Menikah">Menikah</option>
                      <option className="text-gray-700" value="Cerai">Cerai</option>
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
  );
};

export default EditAdmin;
