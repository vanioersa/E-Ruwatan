import React from "react";
import { FaBars } from "react-icons/fa";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
  return (
    <nav className="bg-gray-800 px-1 py-5 flex justify-between ml-45">
      <div className="flex items-center text-xl">
        <FaBars
          className="text-white me-4 cursor-pointer"
          onClick={() => setSidebarToggle(!sidebarToggle)}
        />
        <span className="text-white font-semibold">Admin</span>
      </div>
    </nav>
  );
};

export default Navbar;
