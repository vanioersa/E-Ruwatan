import React from "react";
import SidebarGuru from "../../component/SidebarGuru";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <SidebarGuru />
      <div className="flex flex-grow items-center justify-center"> {/* Adjusted for centering content */}
        <div className="max-w-4xl w-full"> {/* Constraint for max width and full width */}
          <div className="border-b-2 block md:flex">
            <div className="md:flex-1 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
              <div className="flex justify-between">
                <span className="text-xl font-semibold block">Admin Profile</span>
                <button className="text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800">
                  Edit
                </button>
              </div>
              <span className="text-gray-600">This information is secret so be careful</span>
              <div className="w-full p-8 mx-2 flex justify-center">
                <img
                  id="showImage"
                  className="max-w-xs w-32 items-center border"
                  src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200"
                  alt="Admin Profile"
                />
              </div>
            </div>

            <div className="md:flex-1 p-8 bg-white lg:ml-4 shadow-md">
              <div className="rounded shadow p-6">
                <div className="pb-6">
                  <label htmlFor="username" className="font-semibold text-gray-700 block pb-1">Name</label>
                  <input
                    disabled
                    id="username"
                    className="border rounded-r px-4 py-2 w-full"
                    type="text"
                    value="Jane Doe"
                  />
                </div>
                <div className="pb-4">
                  <label htmlFor="email" className="font-semibold text-gray-700 block pb-1">Email</label>
                  <input
                    disabled
                    id="email"
                    className="border rounded-r px-4 py-2 w-full"
                    type="email"
                    value="example@example.com"
                  />
                  <span className="text-gray-600 pt-4 block opacity-70">Personal login information of your account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
