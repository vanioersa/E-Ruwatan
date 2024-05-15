import React, { useEffect, useState } from "react";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";

function Profile_admin() {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png"
  );
  const [image, setImage] = useState(null);
  const id = localStorage.getItem("id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const user = {
      email: email,
      username: username,
    };

    formData.append("user", JSON.stringify(user));
    formData.append("image", image);

    try {
      const response = await axios.put(
        `http://localhost:2024/api/users/ubahUser/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Berhasil", "Berhasil mengubah profil", "success");
      window.location.reload();
    } catch (error) {
      console.error("There was an error uploading the organization!", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = localStorage.getItem("authToken");
      const apiUrl = "http://localhost:4001/user";

      if (!authToken) {
        console.error("No auth token available");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUsername(data.username || "");
        setEmail(data.email || "");
        setProfilePic(
          data.profilePic ||
            "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png"
        );

        // Simpan data pengguna di localStorage
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Coba ambil data pengguna dari localStorage
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);
      setUsername(parsedUserData.username || "");
      setEmail(parsedUserData.email || "");
      setProfilePic(
        parsedUserData.profilePic ||
          "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png"
      );
    } else {
      // Jika tidak ada data pengguna yang tersimpan, ambil dari server
      fetchUserData();
    }
  }, []);

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
                  <Link to={"/Profile_admin"}>
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
                <li className="me-2">
                  <Link to={"/editprofileadmin"}>
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
                <li className="me-2">
                  <Link to={"/setting"}>
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
            <div className="md:flex-1 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
              <div className="text-center flex justify-between items-center">
                <span className="text-xl font-semibold">
                  Profile {username}
                </span>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-md font-bold text-white bg-gray-700 rounded-full px-8 py-2 hover:bg-gray-800"
                >
                  Edit
                </button>
              </div>
              <div className="w-full p-8 mx-auto flex justify-center">
                <img
                  className="max-w-xs w-64 h-64 object-cover rounded-full border"
                  src={profilePic}
                  alt="Profile"
                />
              </div>
              <div className="text-center mt-4">
                <p>
                  <strong>Name:</strong> {username}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
              </div>
            </div>

            <div className="md:flex-1 p-8 bg-white lg:ml-4 shadow-md">
              <div className="rounded shadow p-6">
                <h1 className="text-xl font-semibold">
                  <strong>Edit Data Profile</strong>
                </h1>{" "}
                <br />
                <div className="pb-6">
                  <label
                    htmlFor="username"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Name
                  </label>
                  <input
                    id="username"
                    className="border rounded-r px-4 py-2 w-full"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!editMode}
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
                    className="border rounded-r px-4 py-2 w-full"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div className="pb-4">
                  <label
                    htmlFor="profilePic"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border rounded-r px-4 py-2 w-full"
                    disabled={!editMode}
                  />
                </div>
              </div>
              {editMode && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleSubmit}
                    className="text-md font-bold text-white bg-blue-500 rounded-full px-8 py-2 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_admin;
