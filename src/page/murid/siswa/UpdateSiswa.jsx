import React from "react";
import Sidebar from "../../../component/Sidebar";

const UpdateSiswa = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div class="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Update Siswa</h1>
        <div className="add-siswa mt-12 bg-white p-5 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Update Siswa
          </p>
          <form onSubmit="{}">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  id="nama guru"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Siswa"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  NISN
                </label>
                <input
                  type="number"
                  id="nip"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan NISN"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  Kelas
                </label>
                <input
                  type="text"
                  id="kelas"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Pilih Kelas"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  id="tempat lahir"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Mapel Yang Diampu"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  Alamat
                </label>
                <input
                  type="text"
                  id="kelas"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Kelas"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick="window.history.back()"
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-[#0b409c] py-3 text-sm sm:text-xs font-medium"
              >
                Perbarui
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSiswa;