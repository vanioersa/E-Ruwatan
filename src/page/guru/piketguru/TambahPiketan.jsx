import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";
import { createPiket } from "./api_piket";

const TambahPiketan = () => {
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [siswaByKelas, setSiswaByKelas] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [piketan, setPiketan] = useState({
    kelasId: "",
    tanggal: new Date().toISOString().slice(0, 10),
  });
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

  const token = localStorage.getItem("token"); // Ganti dengan token akses yang valid

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPiketan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const siswaStatus = Object.keys(selectedStatus).map((studentId) => ({
      siswaId: studentId,
      status: selectedStatus[studentId],
    }));

    try {
      const createPiketPromises = siswaStatus.map((status) =>
        createPiket({
          kelasId: selectedKelas,
          tanggal: piketan.tanggal,
          siswaStatus: [status],
        })
      );

      await Promise.all(createPiketPromises);

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
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg"
        >
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
                  value={piketan.tanggal}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tanggal"
                  required
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={batal}
                className="w-24 rounded-lg text-black border border-red-500 py-2 text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-24 rounded-lg text-black border border-blue-700 py-2 text-sm font-medium"
              >
                Simpan
              </button>
            </div>
          </form>

          <div
            style={{ backgroundColor: "white" }}
            className="my-2 rounded-xl py-4 px-0 sm:px-5 mt-5"
          >
            <h2 className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
              Daftar Siswa
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nama Siswa
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Masuk
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Izin
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sakit
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Alpha
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{ backgroundColor: "white" }}
                  className="text-gray-600 text-base font-normal"
                >
                  {selectedKelas && siswaByKelas.length > 0 ? (
                    siswaByKelas.map((siswa) => (
                      <tr
                        className="px-5 py-5 border-b border-gray-200"
                        key={siswa.id}
                        style={{ backgroundColor: "white" }}
                      >
                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                          {siswa.nama_siswa}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "masuk")
                            }
                            checked={selectedStatus[siswa.id] === "masuk"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "izin")
                            }
                            checked={selectedStatus[siswa.id] === "izin"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "sakit")
                            }
                            checked={selectedStatus[siswa.id] === "sakit"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "alpha")
                            }
                            checked={selectedStatus[siswa.id] === "alpha"}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        style={{ backgroundColor: "white" }}
                        className="bg-white border border-gray-200 p-4 text-center"
                        colSpan="5"
                      >
                        {selectedKelas
                          ? "Data yang anda cari tidak ada"
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
    </div>
  );
};

export default TambahPiketan;
