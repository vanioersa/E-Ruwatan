import React, { useEffect, useState } from "react";
import Sidebar from "../../../component/SidebarGuru";
import { getAdminById } from "./api_guru";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Profile_Guru() {
  const id = localStorage.getItem("id");
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
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await axios.post(
        "http://localhost:4001/upload/image",
        formData,
        config
      );
      Swal.fire("Berhasil", "Berhasil mengunggah foto profil", "success");
      setProfilePic(response.data.imageUrl);
      setAdmin((prevState) => ({
        ...prevState,
        image: response.data.imageUrl,
      }));
    } catch (error) {
      setError("Error uploading profile picture. Please try again later.");
      console.error("Error uploading profile picture:", error);
      Swal.fire("Gagal", "Gagal mengunggah foto profil", "error");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
      <div className="flex flex-grow items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="mt-20 md:mt-20">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="default-tab"
                data-tabs-toggle="#default-tab-content"
              >
                <li className="me-2">
                  <Link to={"/profile_guru"}>
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
                  <Link to={"/edit_guru"}>
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
                  <Link to={"/setting_guru"}>
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
              <div className="shadow mt-2 rounded-lg">
                <div className="w-full p-4 mx-auto flex justify-center">
                  <img
                    className="max-w-xs w-64 h-64 object-cover rounded-full border"
                    src={profilePic}
                    alt="Profile"
                  />
                </div>
                <div className="text-center px-8 pb-3 pt-2">
                  <div className="pb-2">
                    <input
                      id="image"
                      className="border px-4 py-2 w-full rounded-lg bg-white text-gray-600"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{ backgroundColor: "white" }}
              className="md:flex-1 p-8 lg:ml-4 shadow-md rounded-tr-xl rounded-br-xl"
            >
              <div className="rounded shadow p-6">
                <h1 className="text-xl font-semibold text-gray-800">
                  <strong>Data Profile</strong>
                </h1>{" "}
                <br />
                <form onSubmit={handleSubmit}>
                  <div className="pb-4">
                    <div className="flex">
                      <div className="w-1/2 pr-2">
                        <label
                          htmlFor="username"
                          className="font-semibold text-gray-700 block pb-1"
                        >
                          Name
                        </label>
                        <input
                          readOnly
                          id="username"
                          className="border rounded-r px-4 py-2 w-full text-gray-600"
                          type="text"
                          value={admin.username}
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <label
                          htmlFor="email"
                          className="font-semibold text-gray-700 block pb-1"
                        >
                          Email
                        </label>
                        <input
                          readOnly
                          id="email"
                          className="border rounded-r px-4 py-2 w-full text-gray-600"
                          type="email"
                          value={admin.email}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pb-4">
                    <div className="flex">
                      <div className="w-1/2 pr-2">
                        <label
                          htmlFor="alamat"
                          className="font-semibold text-gray-700 block pb-1"
                        >
                          Alamat
                        </label>
                        <input
                          readOnly
                          id="alamat"
                          className="border rounded-r px-4 py-2 w-full text-gray-600"
                          type="text"
                          value={admin.alamat}
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <label
                          htmlFor="gender"
                          className="font-semibold text-gray-700 block pb-1"
                        >
                          Gender
                        </label>
                        <input
                          readOnly
                          id="gender"
                          className="border rounded-r px-4 py-2 w-full text-gray-600"
                          type="text"
                          value={admin.gender}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pb-4">
                    <div className="flex">
                      <div className="w-1/2 pr-2">
                        <label
                          htmlFor="telepon"
                          className="font-semibold text-gray-700 block pb-1"
                        >
                          Telepon
                        </label>
                        <input
                          readOnly
                          id="telepon"
                          className="border rounded-r px-4 py-2 w-full text-gray-600"
                          type="text"
                          value={admin.telepon}
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <label
                          htmlFor="status_nikah"
                          className="font-semibold text-gray-700 block pb-1"
                        >
                          Status Nikah
                        </label>
                        <input
                          readOnly
                          id="status_nikah"
                          className="border rounded-r px-4 py-2 w-full text-gray-600"
                          type="text"
                          value={admin.status_nikah}
                        />
                      </div>
                    </div>
                  </div>
                  {error && <div className="text-red-500">{error}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_Guru;
