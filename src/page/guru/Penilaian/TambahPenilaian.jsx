import React, { useEffect, useState } from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { createPenilaian } from "./api_penilaian";

const TambahPenilaian = () => {
  const [selectedKelas, setSelectedKelas] = useState("");
  const [siswaByKelas, setSiswaByKelas] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [kelasId, setKelasId] = useState({});
  const [selectedStudentIds, setSelectedStudentIds] = useState({});
  const navigate = useNavigate();

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  const fetchSiswaByKelas = async (kelasId) => {
    try {
      if (kelasId) {
        const response = await axios.get(
          `http://localhost:4001/siswa/by-kelas-id/${kelasId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSiswaByKelas(response.data);
      } else {
        setSiswaByKelas([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data Siswa: ", error);
    }
  };

  const handleKelasChange = async (e) => {
    const selectedKelasId = e.target.value;

    setSelectedKelas(selectedKelasId);
    if (selectedKelasId) {
      setKelasId(selectedKelasId); // Atur nilai kelasId dengan selectedKelasId
      try {
        const response = await axios.get(
          `http://localhost:4001/siswa/by-kelas-id/${selectedKelasId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSiswaByKelas(response.data);
      } catch (error) {
        console.error("Gagal mengambil data Siswa: ", error);
      }
    } else {
      setSiswaByKelas([]);
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchSiswaByKelas();
  }, []);

  const batal = () => {
    navigate(-1);
  };

  const token = localStorage.getItem("token"); // Ganti dengan token akses yang valid

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
          await createPenilaian({
            kelasId: selectedKelas,
            // tanggal: piketan.tanggal,
            siswaId: selectedStudentIds,
          });
          Swal.fire(
            "Berhasil",
            "Penilaian berhasil ditambahkan",
            "success"
          ).then(() => {
            navigate(-1);
          });
        } catch (error) {
          console.error("Gagal menambahkan Penilaian: ", error);
          Swal.fire(
            "Gagal",
            "Gagal menambahkan penilaian. Silakan coba lagi.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>

      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Tambah Penilaian Guru</h1>
        <div className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah Penilaian Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              {/* <div className="relative">
                <label
                  htmlFor="siswaId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nama Siswa
                </label>
                <select
                  id="siswaId"
                  name="siswaId"
                  value=""
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                ></select>
              </div> */}

              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Kelas
                </label>
                <select
                  name="kelasId"
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kelas} - {item.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label
                  htmlFor="nilai siswa"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Deskripsi Siswa
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value=""
                  onChange=""
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="deskripsi"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nilai siswa"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nilai Siswa
                </label>
                <input
                  type="text"
                  name="materi"
                  value=""
                  onChange=""
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="nilai siswa"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="nilai siswa"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Deskripsi Siswa
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value=""
                  onChange=""
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="deskripsi"
                  required
                  autoComplete="off"
                />
              </div>
            </div> */}
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

          <div className="mt-5">
            <h2 className="text-xl font-semibold mb-4">
              Daftar Siswa
               {/* {selectedKelas ? `Kelas ${selectedKelas}` : ""} */}
            </h2>
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Siswa
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    NISN
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Alamat
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedKelas && siswaByKelas.length > 0 ? (
                  siswaByKelas.map((siswa) => (
                    <tr key={siswa.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {siswa.nama_siswa}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {siswa.nisn}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {siswa.alamat}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                      colSpan="3"
                    >
                      {selectedKelas
                        ? "Data Kosong"
                        : "Silakan pilih kelas untuk melihat siswa."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahPenilaian;
