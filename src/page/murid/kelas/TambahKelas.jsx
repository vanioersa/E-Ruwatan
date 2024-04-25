import React, { useState } from "react";
import Sidebar from "../../../component/Sidebar";
import Swal from "sweetalert2";
import { createKelas } from "./api_kelas";

const TambahKelas = () => {
  const [nama_kelas, setNamaKelas] = useState("");
  const [kelas, setKelas] = useState("");

  const batal = () => {
    window.location.href = "/Kelas";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data kelas akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newKelas = {
          nama_kelas: nama_kelas,
          kelas: kelas,
        };
        try {
          await createKelas(newKelas);
          Swal.fire({
            title: "Berhasil",
            text: "Kelas berhasil ditambahkan",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          setNamaKelas("");
          setKelas("");
        } catch (error) {
          console.error("Failed to add Kelas: ", error);
          Swal.fire({
            title: "Gagal",
            text: "Gagal menambahkan kelas. Silakan coba lagi.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Tambah Kelas</h1>
        <div className="add-guru mt-12 bg-white p-5 ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah Kelas
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  id="nama_kelas"
                  value={nama_kelas}
                  onChange={(e) => setNamaKelas(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Kelas"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 ">
                  Kelas
                </label>
                <select
                  id="kelas"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  required
                >
                  <option value="">Pilih Kelas</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
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
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-700 py-3 text-sm sm:text-sm font-medium"
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

export default TambahKelas;
