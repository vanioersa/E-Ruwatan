import React, { useEffect, useState } from "react";
import { getAdminById } from "./api_admin";
import Swal from "sweetalert2";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import SidebarAdmin from "../../../component/Sidebar";
import NavproAdmin from "./Navpro_admin";

function Profile_Admin() {
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [admin, setAdmin] = useState({ username: "", email: "", image: "" });
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState( "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png" );
  const [previewImage, setPreviewImage] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [fadeOut, setFadeOut] = useState(0);
  
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll = 100;
    const newFadeOut = Math.min(1, scrollTop / maxScroll);
    setFadeOut(newFadeOut);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        setImage(null);
        setPreviewImage(null);
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Silakan masuk kembali.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
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
    setPreviewImage(URL.createObjectURL(file));
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
      <SidebarAdmin />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full md:mt-[15%] mt-[50%] md:overflow-auto overflow-hidden">
          <div
            className="relative"
          >
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                opacity: 1 - fadeOut,
                transition: "opacity 0.5s ease",
              }}
            >
              <NavproAdmin />
            </div>
          </div>

          <div className="block md:flex">
            <div className="md:flex-1 p-4 sm:p-6 bg-white shadow-md rounded-l-xl md:rounded-r-none rounded-r-xl overflow-y-auto md:max-h-[440px]">
              <div className="text-center flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">
                  <strong>Profile {admin.username || "User"}</strong>
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
                    <p className="text-center text-sm font text-gray-900">
                      Disarankan Ukuran Gambar 1:1
                    </p>
                    <h4 className="text-gray-900 font-bold">Preview Image</h4>
                    {editProfile && (
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

            <div className="md:flex-1 p-4 sm:p-6 md:ml-5 md:mt-0 mt-5 bg-white shadow-md rounded-r-xl md:rounded-l-none rounded-l-xl overflow-y-auto max-h-[500px]">
              <h1 className="text-xl font-semibold text-gray-800">
                <strong>Data Profile</strong>
              </h1>
              <br />
              <div className="pb-4">
                <div className="w-full">
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
                    value={admin.username || ""}
                  />
                </div>
                <div className="pt-4">
                  <div className="w-full">
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
                      type="text"
                      value={admin.email || ""}
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