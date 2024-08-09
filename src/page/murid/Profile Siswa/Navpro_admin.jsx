import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navpro_admin() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div
      className="mt-50 md:mt-20 fixed w-full z-10 bg-white md:top-8 top-[15%]"
    >
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="default-tab"
          data-tabs-toggle="#default-tab-content"
        >
          <li className="mr-2">
            <Link to="/profile_admin">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  currentPath === "/profile_admin"
                    ? "text-gray-400 border-gray-300"
                    : "hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                id="profile-tab"
                data-tabs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected={currentPath === "/profile_admin"}
              >
                Profile
              </button>
            </Link>
          </li>
          <li className="mr-2">
            <Link to="/edit_profile_admin">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  currentPath === "/edit_profile_admin"
                    ? "text-gray-400 border-gray-300"
                    : "hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                id="edit-profile-tab"
                data-tabs-target="#edit-profile"
                type="button"
                role="tab"
                aria-controls="edit-profile"
                aria-selected={currentPath === "/edit_profile_admin"}
              >
                Edit Profile
              </button>
            </Link>
          </li>
          <li className="mr-2">
            <Link to="/edit_password_admin">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  currentPath === "/edit_password_admin"
                    ? "text-gray-400 border-gray-300"
                    : "hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
                id="edit-password-tab"
                data-tabs-target="#edit-password"
                type="button"
                role="tab"
                aria-controls="edit-password"
                aria-selected={currentPath === "/edit_password_admin"}
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
