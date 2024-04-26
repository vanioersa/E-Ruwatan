import React from "react";
import SidebarGuru from "../../../component/SidebarGuru";

const TambahPiketan = () => {
    const batal = () => {
        window.location.href = "/piketan_guru";
    };
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="sidebar w-full md:w-64">
                <SidebarGuru />
            </div>
            <div class="content-page max-h-screen container p-8 min-h-screen">
                <h1 className="judul text-3xl font-semibold">Tambah Piketan</h1>
                <div className="add-guru mt-12 bg-white p-5 ml-8 border border-gray-200 rounded-xl shadow-lg">
                    <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
                        Tambah Piketan
                    </p>
                    <form onSubmit="{}">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                            <div className="relative">
                                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                                    Kelas
                                </label>
                                <input
                                    type="text"
                                    id="kelas"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    placeholder="Masukan Kelas"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="relative">
                                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    id="tanggal"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    placeholder="Masukan Tanggal"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                            <div className="relative">
                                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                                    Izin
                                </label>
                                <input
                                    type="text"
                                    id="izin"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    placeholder="Masukkan Izin"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="relative">
                                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                                    Sakit
                                </label>
                                <input
                                    type="text"
                                    id="sakit"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    placeholder="Masukan Sakit"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="relative">
                                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                                    Alfa
                                </label>
                                <input
                                    type="text"
                                    id="alfa"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                    placeholder="Masukan Alfa"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
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
};

export default TambahPiketan;
