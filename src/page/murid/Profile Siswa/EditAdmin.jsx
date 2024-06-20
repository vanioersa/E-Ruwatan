import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";

const EditAdmin = () => {
  const id = localStorage.getItem("id");
  const apiUrl = "http://localhost:4001";

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
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/users/by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(response.data);
      } catch (error) {
        console.error("Failed to fetch admin:", error);
      }
    };

    fetchAdmin();
  }, [id, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const initialResponse = await axios.get(`${apiUrl}/users/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const initialAdminData = initialResponse.data;

      const isUsernameEmailChanged =
        initialAdminData.username !== admin.username ||
        initialAdminData.email !== admin.email;

      const isDataChanged =
        isUsernameEmailChanged ||
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

      if (isUsernameEmailChanged) {
        Swal.fire({
          icon: "question",
          title: "Apakah Anda yakin ",
          text: "ingin mengubah email atau username?",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Ya",
          cancelButtonText: "Tidak",
          reverseButtons: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.put(`${apiUrl}/users/update/${id}`, admin, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data admin berhasil diperbarui",
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                localStorage.removeItem("token");
                Swal.fire({
                  icon: "info",
                  title: "Anda harus login kembali",
                  text: "Silakan login kembali untuk melanjutkan",
                  showConfirmButton: false,
                  timer: 3000,
                }).then(() => {
                  window.location.href = "/";
                });
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
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              icon: "error",
              title: "Dibatalkan",
              text: "Perubahan email atau username dibatalkan",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
      } else {
        try {
          await axios.put(`${apiUrl}/users/update/${id}`, admin, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data admin berhasil diperbarui",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
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
      }
    } catch (error) {
      console.error("Failed to fetch initial admin data:", error);
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
                  <div className="pb-3">
                    <label
                      htmlFor="username"
                      className="font-semibold text-gray-700 block pb-3"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      className="border rounded-lg px-4 py-2 w-full text-gray-600"
                      type="text"
                      autoComplete="off"
                      value={admin.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pb-3">
                    <label
                      htmlFor="email"
                      className="font-semibold text-gray-700 block pb-3"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      className="border rounded-lg px-4 py-2 w-full text-gray-600"
                      type="email"
                      autoComplete="off"
                      value={admin.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pb-3">
                    <label
                      htmlFor="alamat"
                      className="font-semibold text-gray-700 block pb-3"
                    >
                      Alamat
                    </label>
                    <input
                      id="alamat"
                      name="alamat"
                      autoComplete="off"
                      className="border rounded-lg px-4 py-2 w-full text-gray-600"
                      type="text"
                      value={admin.alamat}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pb-3">
                    <label
                      htmlFor="telepon"
                      className="font-semibold text-gray-700 block pb-3"
                    >
                      Telepon
                    </label>
                    <input
                      id="telepon"
                      name="telepon"
                      autoComplete="off"
                      className="border rounded-lg px-4 py-2 w-full text-gray-600"
                      type="number"
                      value={admin.telepon}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pb-3">
                    <label className="font-semibold text-gray-700 block pb-3">
                      Gender
                    </label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="Laki-laki"
                        checked={admin.gender === "Laki-laki"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="male" className="text-gray-700 mr-4">
                        Laki-laki
                      </label>

                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="Perempuan"
                        checked={admin.gender === "Perempuan"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="female" className="text-gray-700">
                        Perempuan
                      </label>
                    </div>
                  </div>
                  <div className="pb-3">
                    <label className="font-semibold text-gray-700 block pb-3">
                      Status Nikah
                    </label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="single"
                        name="status_nikah"
                        value="Belum Menikah"
                        checked={admin.status_nikah === "Belum Menikah"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="single" className="text-gray-700 mr-4">
                        Belum Menikah
                      </label>

                      <input
                        type="radio"
                        id="married"
                        name="status_nikah"
                        value="Menikah"
                        checked={admin.status_nikah === "Menikah"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="married" className="text-gray-700">
                        Menikah
                      </label>
                    </div>
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
