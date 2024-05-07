import React, { useEffect, useState } from "react";
import SidebarGuru from "../../../component/SidebarGuru";

function Profile_guru() {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png");
  const apiUrl = "http://localhost:4001/user";
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetch(`${apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
        setProfilePic(data.profilePic || profilePic);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [authToken, apiUrl, profilePic]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <SidebarGuru />
      <div className="flex flex-grow items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="border-b-2 block md:flex">
            <div className="md:flex-1 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
              <div className="text-center flex justify-between items-center">
                <span className="text-xl font-semibold">Profile {username}</span>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-md font-bold text-white bg-gray-700 rounded-full px-8 py-2 hover:bg-gray-800"
                >
                  {editMode ? "Save" : "Edit"}
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
                    onChange={handleProfilePicChange}
                    className="border rounded-r px-4 py-2 w-full"
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile_guru;