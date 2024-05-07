import React, { useEffect, useState } from "react";
import SidebarGuru from "../../../component/SidebarGuru";

function ProfileGuru() {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(
    'https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=200'
  );

  const apiUrl = "http://localhost:4001/user";
  const authToken = localStorage.getItem("authToken");

  // Fetch user data
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
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      })
      .catch(err => console.error("Error fetching user data:", err));
  }, [authToken, apiUrl]);

  // Handle save
  const handleSave = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    
    // Add profile picture if available
    const profilePicInput = document.getElementById('profilePic');
    if (profilePicInput && profilePicInput.files[0]) {
      formData.append('profilePic', profilePicInput.files[0]);
    }

    fetch(`${apiUrl}/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Add notification to the user that the profile was updated successfully
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating user:', error);
        // Add notification to the user that there was an error updating the profile
      });
  };

  // Handle profile picture change
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setProfilePic(objectURL);
      // Revoke the object URL when it's no longer needed
      setTimeout(() => URL.revokeObjectURL(objectURL), 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <SidebarGuru />
      <div className="flex flex-grow items-center justify-center p-4 my-24">
        <div className="max-w-4xl w-full space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-200">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:mr-6">
                  <img
                    className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-2 border-gray-300"
                    src={profilePic}
                    alt="Profile"
                  />
                </div>
                <div className="text-center md:text-left mt-4 md:mt-0">
                  <p className="text-2xl font-bold mb-2">Profile {username}</p>
                  <p><strong>Name:</strong> {username}</p>
                  <p><strong>Email:</strong> {email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`text-md font-bold px-6 py-2 rounded-lg transition duration-300 ease-in-out 
                            ${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} 
                            text-white shadow-lg`}
              >
                {editMode ? "Simpan" : "Ubah"}
              </button>
            </div>
            
            {editMode && (
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-gray-700 font-semibold">
                      Nama
                    </label>
                    <input
                      id="username"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-gray-700 font-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label htmlFor="profilePic" className="block text-gray-700 font-semibold">
                      Unggah Foto
                    </label>
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg shadow-lg transition duration-300 ease-in-out"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileGuru;
