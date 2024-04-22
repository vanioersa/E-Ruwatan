import React from "react";
import {
  FaHome,
  FaBookReader,
  FaChalkboardTeacher,
  FaDoorClosed,
} from "react-icons/fa";

const sidebar = ({ sidebarToggle }) => {
  return (
    <div
      className={`${
        sidebarToggle ? " hidden " : " block "
      }w-64 bg-gray-800 fixed h-full px-4 py-5`}
    >
      <div className="my-2 mb-4">
        <h1 className="text-4x text-white font-bold">E-RUWATAN</h1>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <a href="" className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2"></FaHome>
            Dashboard
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <a href="" className="px-3">
            <FaBookReader className="inline-block w-6 h-6 mr-2 -mt-2"></FaBookReader>
            Siswa
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <a href="" className="px-3">
            <FaChalkboardTeacher className="inline-block w-6 h-6 mr-2 -mt-2"></FaChalkboardTeacher>
            Guru
          </a>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <a href="" className="px-3">
            <FaDoorClosed className="inline-block w-6 h-6 mr-2 -mt-2"></FaDoorClosed>
            Kelas
          </a>
        </li>
      </ul>
    </div>
  );
};

export default sidebar;
