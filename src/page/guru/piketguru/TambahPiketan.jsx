import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";

const TambahPiketan = () => {
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [siswaByKelas, setSiswaByKelas] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchKelas();
  }, []);

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  };

  useEffect(() => {
    if (selectedKelas) {
      fetchSiswaByKelas(selectedKelas);
    }
  }, [selectedKelas]);

  const token = localStorage.getItem("token");

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
      try {
        await fetchSiswaByKelas(selectedKelasId);
      } catch (error) {
        console.error("Gagal mengambil data Siswa: ", error);
      }
    } else {
      setSiswaByKelas([]);
    }
  };

  const handleStudentCheckboxChange = (studentId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? undefined : status, // Toggle status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedKelas) {
      Swal.fire({
        title: "Error",
        text: "Silakan pilih kelas.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const selectedStudents = Object.keys(selectedStatus);
    if (selectedStudents.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Silakan pilih setidaknya satu siswa.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const siswaStatusList = selectedStudents.map((studentId) => ({
      siswaId: parseInt(studentId),
      statusList: selectedStatus[studentId] ? [selectedStatus[studentId]] : [],
    }));

    const data = {
      kelasId: parseInt(selectedKelas),
      siswaStatusList,
      tanggal,
    };

    try {
      await axios.post("http://localhost:4001/piket/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Berhasil",
        text: "Piketan berhasil ditambahkan",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Gagal menambahkan piketan: ", error);
      Swal.fire({
        title: "Gagal",
        text: "Gagal menambahkan piketan. Silakan coba lagi.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const batal = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page flex-grow p-8 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Tambah Piketan</h1>
        <div style={{ backgroundColor: "white" }} className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Tambah Piketan
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Kelas
                </label>
                <select
                  name="kelasId"
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kelas} - {item.nama_kelas}
                    </option>
                  ))}
                </select>
                {error && !selectedKelas && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="tanggal"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={tanggal.slice(0, 10)}
                  onChange={(e) => setTanggal(e.target.value + "T00:00")}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                  readOnly
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
                  <tbody style={{ backgroundColor: "white" }} className="divide-y-2 divide-gray-200">
                    {siswaByKelas.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="text-center py-4">
                          {selectedKelas
                            ? "Tidak ada siswa yang tersedia untuk kelas ini."
                            : "Silakan pilih kelas terlebih dahulu."}
                        </td>
                      </tr>
                    ) : (
                      siswaByKelas.map((siswa) => (
                        <tr key={siswa.id}>
                          <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {siswa.nama_siswa}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={selectedStatus[siswa.id] || ""}
                              onChange={(e) =>
                                handleStudentCheckboxChange(
                                  siswa.id,
                                  e.target.value
                                )
                              }
                              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                              <option value="">Pilih Status</option>
                              <option value="Masuk">Masuk</option>
                              <option value="Izin">Izin</option>
                              <option value="Sakit">Sakit</option>
                              <option value="Alpha">Alpha</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {error && selectedKelas && (
                  <p className="text-red-500 text-sm mt-2 sm:mt-1">{error}</p>
                )}
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
};

export default TambahPiketan;
