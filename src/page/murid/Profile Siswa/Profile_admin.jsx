import React, { useEffect, useState } from "react";
import Sidebar from "../../../component/SidebarGuru";
import { getAdminById } from "./api_admin";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function Profile_Admin() {
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [admin, setAdmin] = useState({
    username: "",
    email: "",
    alamat: "",
    gender: "",
    telepon: "",
    status_nikah: "",
    image: "",
  });
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState(
    "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png"
  );
  const [previewImage, setPreviewImagepreviewImage] = useState(null);
  const [editProfil, setEditProfile] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      Swal.fire({
        icon: "error",
        title: "Upload Gagal",
        text: "Pilih gambar terlebih dahulu.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `http://localhost:4001/edit/image/${id}`,
        formData,
        config
      );
      Swal.fire({
        title: "Berhasil",
        text: "Berhasil mengunggah foto profil",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        setProfilePic(response.data.imageUrl);
        setAdmin((prevState) => ({
          ...prevState,
          image: response.data.imageUrl,
        }));
        window.location.reload();
        setImage(null);
        setPreviewImagepreviewImage(null);
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized: Silakan masuk kembali.");
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Silakan masuk kembali.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setError("Terjadi kesalahan.");
        console.error("Kesalahan saat mengunggah foto:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengunggah gambar.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleImageChange = (e) => {
    setEditProfile(true);
    const file = e.target.files[0];
    setImage(file);
    setPreviewImagepreviewImage(URL.createObjectURL(file));
    setError(null);
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminData = await getAdminById(id);
        setAdmin(adminData);
        if (adminData.image) {
          setProfilePic(adminData.image);
        }
      } catch (error) {
        console.error("Failed to fetch admin:", error);
      }
    };

    fetchAdmin();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex flex-grow items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full space-y-6">
          <div className="mt-20 md:mt-20">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="default-tab"
                data-tabs-toggle="#default-tab-content"
              >
                <li className="me-2">
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
                <li className="me-2">
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
                <li className="me-2">
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
              className="md:flex-1 p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-tl-xl rounded-bl-xl"
            >
              <div className="text-center flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">
                  <strong>Profile {admin.username}</strong>
                </span>
              </div>
              <div className="mt-3 rounded-lg">
                <div className="w-full p-4 mx-auto flex justify-center">
                  <label
                    htmlFor="unggahGambar"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <img
                      className="max-w-xs w-40 h-40 object-cover rounded-full border mb-2"
                      src={profilePic}
                      alt="Profile"
                    />
                    <p className="text-center text-sm font">
                      Disarankan Ukuran Gambar 1:1
                    </p>
                    <h4 className="text-gray-900 font-bold">Preview Image</h4>
                    {editProfil && (
                      <>
                        <img
                          className="max-w-xs w-40 h-40 object-cover rounded-full border mb-2 mt-1"
                          src={previewImage}
                          alt="Profile"
                        />
                      </>
                    )}
                    <input
                      id="unggahGambar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <div className="text-center px-8 pb-3 pt-1">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{ backgroundColor: "white" }}
              className="md:flex-1 p-4 sm:p-6 lg:p-8 lg:ml-4 shadow-md rounded-tr-xl rounded-br-xl"
            >
              <h1 className="text-xl font-semibold text-gray-800">
                <strong>Data Profile</strong>
              </h1>{" "}
              <br />
              <div className="pb-4">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 pr-2">
                    <label
                      htmlFor="username"
                      className="font-semibold text-gray-700 block pb-1"
                    >
                      Name
                    </label>
                    <input
                      readOnly
                      id="username"
                      className="border rounded-xl px-4 py-2 w-full text-gray-900"
                      type="text"
                      value={admin.username}
                    />
                  </div>
                  <div className="w-full sm:w-1/2 pl-2">
                    <label
                      htmlFor="email"
                      className="font-semibold text-gray-700 block pb-1"
                    >
                      Email
                    </label>
                    <input
                      readOnly
                      id="email"
                      className="border rounded-xl px-4 py-2 w-full text-gray-900"
                      type="email"
                      value={admin.email}
                    />
                  </div>
                </div>
              </div>
              <div className="pb-4">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 pr-2">
                    <label
                      htmlFor="alamat"
                      className="font-semibold text-gray-700 block pb-1"
                    >
                      Alamat
                    </label>
                    <input
                      readOnly
                      id="alamat"
                      className={`border rounded-xl px-4 py-2 w-full ${
                        !admin.alamat ? "text-gray-400" : "text-gray-900"
                      }`}
                      type="text"
                      value={admin.alamat ? admin.alamat : "Data kosong"}
                    />
                  </div>
                  <div className="w-full sm:w-1/2 pl-2">
                    <label
                      htmlFor="gender"
                      className="font-semibold text-gray-700 block pb-1"
                    >
                      Gender
                    </label>
                    <input
                      readOnly
                      id="gender"
                      className={`border rounded-xl px-4 py-2 w-full ${
                        !admin.gender ? "text-gray-400" : "text-gray-900"
                      }`}
                      type="text"
                      value={admin.gender ? admin.gender : "Data kosong"}
                    />
                  </div>
                </div>
              </div>
              <div className="pb-4">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2 pr-2">
                    <label
                      htmlFor="telepon"
                      className="font-semibold text-gray-700 block pb-1"
                    >
                      Telepon
                    </label>
                    <input
                      readOnly
                      id="telepon"
                      className={`border rounded-xl px-4 py-2 w-full ${
                        !admin.telepon ? "text-gray-400" : "text-gray-900"
                      }`}
                      type="text"
                      value={admin.telepon ? admin.telepon : "Data kosong"}
                    />
                  </div>
                  <div className="w-full sm:w-1/2 pl-2">
                    <label
                      htmlFor="status_nikah"
                      className="font-semibold text-gray-700 block pb-1"
                    >
                      Status Nikah
                    </label>
                    <input
                      readOnly
                      id="status_nikah"
                      className={`border rounded-xl px-4 py-2 w-full ${
                        !admin.status_nikah ? "text-gray-400" : "text-gray-900"
                      }`}
                      type="text"
                      value={
                        admin.status_nikah ? admin.status_nikah : "Data kosong"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_Admin;
