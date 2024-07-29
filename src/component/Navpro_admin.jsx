import React from "react";
import { Link } from "react-router-dom";

function Navpro_admin() {
  return (
    <div
      className="mt-50 md:mt-20 fixed w-full z-50 bg-white"
      style={{ top: "10%" }}
    >
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="default-tab"
          data-tabs-toggle="#default-tab-content"
        >
          <li className="mr-2">
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
  );
}

export default Navpro_admin;
