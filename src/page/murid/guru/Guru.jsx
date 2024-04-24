import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Guru = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="tabel-siswa mt-12 bg-white p-5 rounded-xl shadow-lg">
          <div className="bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center">
            <h1 className="judul text-3xl text-white font-semibold ">
              Data Guru
            </h1>
            <div className="flex items-center -space-x-4 hover:space-x-1">
              <Link to={``}>
                <button className="rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="h-5 w-5 text-blue-500"
                  />
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-s">
              <thead className="text-left">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    No
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Nama Guru
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    NIP
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Tempat Lahir
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Mapel
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guru;
