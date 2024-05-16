import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarGuru from "../../../component/SidebarGuru";
import axios from "axios";
import { getPenilaianById, updatePenilaian } from "./api_penilaian";
import Swal from "sweetalert2";

const UpdatePenilaian = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [penilaian, setPenilaian] = useState({ deskripsi: "", nilai: "" });
  const [kelas, setKelas] = useState([]);
  const [siswaByKelas, setSiswaByKelas] = useState([]);

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  const fetchSiswaByKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/siswa/all");
      setSiswaByKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Siswa: ", error);
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchSiswaByKelas();
    fetchPenilaian();
  }, []);

  const fetchPenilaian = async () => {
    try {
      const response = await getPenilaianById(id);
      setPenilaian(response);
    } catch (error) {
      console.error("Gagal mengambil data Penilaian: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPenilaian((prevPenilaian) => ({
      ...prevPenilaian,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Penilaian akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updatePenilaian(id, penilaian);
          Swal.fire({
            title: "Berhasil",
            text: "Penilaian berhasil diperbarui",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            navigate(-1);
          });
        } catch (error) {
          console.error("Gagal memperbarui Penilaian: ", error);
          Swal.fire({
            title: "Gagal",
            text: "Gagal memperbarui penilaian. Silakan coba lagi.",
            icon: "error",
          });
        }
      }
    });
  };

  const batal = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>

      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Perbarui Penilaian Guru</h1>
        <div className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Perbarui Penilaian Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Kelas
                </label>
                <input
                  type="text"
                  value={`${kelas.find((item) => item.id === penilaian.kelasId)?.kelas} - ${kelas.find((item) => item.id === penilaian.kelasId)?.nama_kelas}`}  
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="siswaId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nama Siswa
                </label>
                <input
                  type="text"
                  value={siswaByKelas.find((siswa) => siswa.id === penilaian.siswaId)?.nama_siswa}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nilai"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nilai
                </label>
                <input
                  type="number"
                  name="nilai"
                  value={penilaian.nilai}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan nilai"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value={penilaian.deskripsi}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan deskripsi"
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

export default UpdatePenilaian;