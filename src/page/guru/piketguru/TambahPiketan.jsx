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
  const [selectedStudentIds, setSelectedStudentIds] = useState({});
  const [piketan, setPiketan] = useState({
    kelasId: "",
    tanggal: new Date().toISOString().slice(0, 10),
  });
  const navigate = useNavigate();
  const [kelasId, setKelasId] = useState({});

  useEffect(() => {
    fetchKelas();
    fetchSiswaByKelas();
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

  const handleStudentCheckboxChange = (studentId, status) => {
    setSelectedStudentIds((prev) => ({
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
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data piketan akan disimpan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createPiket({
            kelasId: selectedKelas,
            tanggal: piketan.tanggal,
            siswaId: selectedStudentIds,
          });
          Swal.fire("Berhasil", "Piketan berhasil ditambahkan", "success").then(
            () => {
              navigate(-1);
            }
          );
        } catch (error) {
          console.error("Gagal menambahkan piketan: ", error);
          Swal.fire(
            "Gagal",
            "Gagal menambahkan piketan. Silakan coba lagi.",
            "error"
          );
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
        <h1 className="judul text-3xl font-semibold">Tambah Piketan</h1>
        <div className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Tambah Piketan
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
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
                  htmlFor="tanggal"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={piketan.tanggal}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Daftar Siswa
                 {/* {selectedKelas} */}
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
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Kelas
                        </th> */}
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
                <tbody>
                  {selectedKelas && siswaByKelas.length > 0 ? (
                    siswaByKelas.map((siswa) => (
                      <tr key={siswa.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-nowrap">
                          {siswa.nama_siswa}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {siswa.nisn}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {siswa.alamat}
                        </td>
                        {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {siswa.kelasId.nama_kelas}
                          </td> */}
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-left">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "masuk")
                            }
                            checked={selectedStudentIds[siswa.id] === "masuk"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-left">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "izin")
                            }
                            checked={selectedStudentIds[siswa.id] === "izin"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-left">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "sakit")
                            }
                            checked={selectedStudentIds[siswa.id] === "sakit"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-left">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "alpha")
                            }
                            checked={selectedStudentIds[siswa.id] === "alpha"}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-5 py-5 border-b border-gray-200 bg-white text-right"
                        colSpan="4"
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