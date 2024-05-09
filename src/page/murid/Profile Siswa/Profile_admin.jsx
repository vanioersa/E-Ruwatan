import React, { useEffect, useState } from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import Swal from "sweetalert2";

function Profile_admin() {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png"
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const apiUrl = "http://localhost:4001/user";
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      console.error("No auth token available");
      return;
    }

    fetch(`${apiUrl}/details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) =>
        response.ok
          ? response.json()
          : Promise.reject("Failed to fetch user details")
      )
      .then((data) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
        setProfilePic(
          data.profilePic ||
            "https://kimia.fkip.usk.ac.id/wp-content/uploads/2017/10/1946429.png"
        );
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [authToken, apiUrl]); // Added dependencies to refresh if these values change

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    // Convert selected image to base64 string or use existing base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      fetch(`${apiUrl}/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          username,
          email,
          profilePic: base64String,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Assuming the API returns a success property
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text: "Profile updated successfully.",
              confirmButtonColor: "#3085d6",
            });
            setEditMode(false);
          } else {
            throw new Error(data.message || "Unknown error occurred"); // Assuming API returns an error message
          }
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.toString(),
            confirmButtonColor: "#d33",
          });
        });
    };

    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    } else {
      Swal.fire({
        icon: "warning",
        title: "No Image Selected",
        text: "Please select an image to update your profile picture.",
        confirmButtonColor: "#f0ad4e",
      });
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
                <span className="text-xl font-semibold">
                  Profile {username}
                </span>
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
          {editMode && (
            <div className="text-center mt-4">
              <button
                onClick={handleSaveChanges}
                className="text-md font-bold text-white bg-blue-500 rounded-full px-8 py-2 hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile_admin;
