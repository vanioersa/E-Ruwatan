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
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const navigate = useNavigate();
  const [penilaian, setPenilaian] = useState({
    kelasId: "",
    siswaId: "",
    deskripsi: "",
    nilai: "",
  });

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
      const token = localStorage.getItem("token");
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

  const handleKelasChange = (e) => {
    const selectedKelasId = e.target.value;
    setSelectedKelas(selectedKelasId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPenilaian((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  useEffect(() => {
    fetchSiswaByKelas(selectedKelas);
  }, [selectedKelas]);

  const batal = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataNilai = {
      kelasId: selectedKelas,
      siswaId: selectedStudentId,
      deskripsi: penilaian.deskripsi,
      nilai: penilaian.nilai,
    };

    try {
      await createPenilaian(dataNilai);
      Swal.fire({
        title: "Berhasil",
        text: "Penilaian berhasil ditambahkan",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Gagal menambahkan Penilaian: ", error);
      Swal.fire({
        title: "Gagal",
        text: "Gagal menambahkan penilaian. Silakan coba lagi.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>

      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Tambah Penilaian Guru</h1>
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Tambah Penilaian Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 mt-2">
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
                <p className="text-xs font-bold mt-2">*Pilih Kelas Terlebih dahulu</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nilai siswa"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nilai Siswa
                </label>
                <input
                  type="number"
                  name="nilai"
                  value={penilaian.nilai}
                  onChange={handleChange}
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
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value={penilaian.deskripsi}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="deskripsi"
                  autoComplete="off"
                />
              </div>
            </div>
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg mt-4">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Siswa
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-base font-normal">
                <tr
                  className="border-b border-gray-200"
                >
                  <td className="px-5 py-5">
                    <select
                      name="siswaId"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    >
                      <option value="">Pilih Siswa</option>
                      {siswaByKelas.map((siswaOption) => (
                        <option key={siswaOption.id} value={siswaOption.id}>
                          {siswaOption.nama_siswa}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
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

export default TambahPenilaian;
