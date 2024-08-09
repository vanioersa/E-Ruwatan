import React, { useState, useEffect } from "react";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import NavproAdmin from "./Navpro_admin";

const EditAdmin = () => {
  const id = localStorage.getItem("id");
  const apiUrl = "http://localhost:4001";

  const [admin, setAdmin] = useState({
    username: "",
    email: "",
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

      const isDataChanged = isUsernameEmailChanged;

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
          title: "Apakah Anda yakin",
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
      <div className="flex flex-grow items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl md:mt-[15%] mt-[10%]">
          <NavproAdmin />
          <div className="flex flex-col md:flex-row">
            <div
              style={{ backgroundColor: "white" }}
              className="md:flex-1 p-4 sm:p-6 lg:p-8 rounded-xl shadow-md flex flex-col"
            >
               <h1 className="text-xl font-semibold text-gray-800">
                <strong>Edit Profile</strong>
              </h1>
              <br />
              <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
                <div className="pb-2 pt-2">
                  <label
                    htmlFor="username"
                    className="font-semibold text-gray-700 block"
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
                    placeholder="Tambahkan username anda"
                  />
                </div>
                <div className="pb-2 pt-2">
                  <label
                    htmlFor="email"
                    className="font-semibold text-gray-700 block"
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
                    placeholder="Tambahkan email anda"
                  />
                </div>
                <div className="md:mt-auto flex justify-end mt-5">
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
