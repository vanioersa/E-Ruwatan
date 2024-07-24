import React from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import { useNavigate } from "react-router-dom";

function UpdatePiketan() {
  const navigate = useNavigate();

  const batal = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page flex-grow p-8 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Update Piketan</h1>
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Update Piketan
          </p>
          <form action="">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Kelas
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                  required
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="tanggal"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tanggal
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                  required
                />
              </div>
            </div>

            <div className="my-7 px-0 sm:px-3">
              <h2 className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-3 sm:ml-3">
                Daftar Siswa
              </h2>
              <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
                <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama Siswa
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    style={{ backgroundColor: "white" }}
                    className="divide-y-2 divide-gray-200"
                  >
                    <tr>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900"></td>
                      <td className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={batal}
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-blue-700 py-3 text-sm sm:text-sm font-medium"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePiketan;
