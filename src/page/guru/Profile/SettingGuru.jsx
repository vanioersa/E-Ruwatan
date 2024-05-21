import React from "react";
import Sidebar from "../../../component/SidebarGuru";
import { Link } from "react-router-dom";

function Setting() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex flex-grow items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="mt-20 md:mt-20">
            <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                class="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="default-tab"
                data-tabs-toggle="#default-tab-content"
                role="tablist"
              >
                <li class="me-2" role="presentation">
                  <Link to={"/profile_guru"}>
                    <button
                      class="inline-block p-4 border-b-2 rounded-t-lg"
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
                <li class="me-2" role="presentation">
                  <Link to={"/edit_guru"}>
                    <button
                      class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
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
                <li class="me-2" role="presentation">
                  <Link to={"/setting_guru"}>
                    <button
                      class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
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
            <div className="md:flex-1 p-8 bg-white lg:ml-4 shadow-md">
              <div className="rounded shadow p-6">
                <h1 className="text-xl font-semibold">
                  <strong>Setting</strong>
                </h1>{" "}
                <br />
                <div className="pb-6">
                  <label
                    htmlFor="username"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Password Lama
                  </label>
                  <input
                    id="username"
                    className="border rounded-r px-4 py-2 w-full"
                    type="text"
                  />
                </div>
                <div className="pb-4">
                  <label
                    htmlFor="email"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Password Baru
                  </label>
                  <input
                    id="email"
                    className="border rounded-r px-4 py-2 w-full"
                    type="email"
                  />
                </div>
                <div className="pb-4">
                  <label
                    htmlFor="profilePic"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type="text"
                    id="profilePic"
                    accept="image/*"
                    className="border rounded-r px-4 py-2 w-full"
                  />
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="text-md font-bold text-white bg-blue-500 rounded-full px-8 py-2 hover:bg-blue-600">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
