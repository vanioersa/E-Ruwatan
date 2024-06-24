import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SidebarGuru from "../../../component/SidebarGuru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faArrowLeft,
  faArrowRight,
  faFileExport,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { getAllKbms, deleteKbm } from "./api_kbm";
import axios from "axios";
import ReactPaginate from "react-paginate";

function KBMGuru() {
  const [data, setData] = useState([]);
  const [kbmGuru, setKbmGuru] = useState([]);
  const [users, setUsers] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null); // State untuk menyimpan file Excel
  const [currentPage, setCurrentPage] = useState(0);
  const location = useLocation();
  const itemsPerPage = 10;
  const storedUsername = localStorage.getItem("username");

  // Ambil data KBM Guru dari API
  useEffect(() => {
    const fetchKBMGuru = async () => {
      try {
        const data = await getAllKbms();
        setKbmGuru(data.reverse());
      } catch (error) {
        console.error("Failed to fetch KBM Guru: ", error);
      }
    };
    fetchKBMGuru();
  }, [location.pathname]);

  // Ambil data User dari API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4001/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch user: ", error);
      }
    };
    fetchUsers();
  }, []);

  // Ambil data Kelas dari API
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kelas/all");
        setKelas(response.data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  const openImportModal = () => {
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  //IMPORT EXCEL KBM
  const importExcell = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      Swal.fire("Error", "Anda belum memilih file untuk diimport!.", "error");
      return;
    }

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda akan mengimpor data dari file ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, impor!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("file", excelFile);

        const token = localStorage.getItem("token");

        try {
          const response = await axios.post(
            `http://localhost:4001/kbm/upload/import-KBM`, // Sesuaikan dengan endpoint untuk impor file Excel
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "Sukses!",
            text: "Berhasil Ditambahkan",
            showConfirmButton: false,
            timer: 2500,
          });
          window.location.reload(); // Refresh halaman setelah berhasil impor
        } catch (error) {
          console.error("Error importing file:", error);
          Swal.fire("Error", "Gagal mengimpor file. " + error.message, "error");
        }
      }
    });
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllKbms();
      setData(response.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  // Fungsi untuk menghapus KBM Guru
  const handleDeleteKBM = async (id) => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin menghapus data KBM Guru?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKbm(id);
          setKbmGuru((prevKbmGuru) =>
            prevKbmGuru.filter((kbm) => kbm.id !== id)
          );
          Swal.fire({
            title: "Berhasil",
            text: "Data KBM Guru berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Gagal menghapus KBM Guru: ", error);
          Swal.fire("Gagal", "Gagal menghapus data KBM Guru", "error");
        }
      }
    });
  };

  // Filter data berdasarkan term pencarian
  const filteredKBMGuru = kbmGuru.filter((kbm) => {
    const namaGuru = users.find((u) => u.id === kbm.userId)?.username?.toLowerCase();
    const kelass = kelas.find((k) => k.id === kbm.kelasId);
    const kelasName = kelass?.kelas;
    const namaKelas = kelass?.nama_kelas;
    const isNamaGuruMatch = namaGuru && namaGuru.includes(searchTerm.toLowerCase());
    const isKelasMatch = kelass && namaKelas &&
      `${kelasName} - ${namaKelas}`.toLowerCase().includes(searchTerm.toLowerCase());
    const isMateriMatch = kbm.materi && kbm.materi.toLowerCase().includes(searchTerm.toLowerCase());
    const isKeteranganMatch = kbm.keterangan && kbm.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    return isNamaGuruMatch || isKelasMatch || isMateriMatch || isKeteranganMatch;
  });

  const pageCount = Math.ceil(filteredKBMGuru.length / itemsPerPage);
  const changePage = ({ selected }) => setCurrentPage(selected);

  const dataToExport = filteredKBMGuru
    .filter((kbm) => users.find((u) => u.id === kbm.userId)?.username === storedUsername)
    .map((kbm) => ({
      "Nama Guru": kbm.userId ? users.find((u) => u.id === kbm.userId)?.username : "",
      Kelas: kbm.kelasId ? `${kelas.find((k) => k.id === kbm.kelasId)?.kelas} - ${kelas.find((k) => k.id === kbm.kelasId)?.nama_kelas}` : "",
      "Jam Masuk": kbm.jam_masuk || "",
      "Jam Pulang": kbm.jam_pulang || "",
      Materi: kbm.materi || "",
      Keterangan: kbm.keterangan || "",
    }));

  // EXPORT KBM
  const exportExcellKBM = () => {
    const storedUsername = localStorage.getItem("username");
    const currentKbm = filteredKBMGuru.find(
      (kbm) => users.find((u) => u.id === kbm.userId)?.username === storedUsername
    );
    if (currentKbm) {
      exportExcell(currentKbm.kelasId, currentKbm.userId);
    } else {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data KBM untuk diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const exportExcell = async (kelasId, userId) => {
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Anda yakin ingin mengexport data KBM?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:4001/kbm/upload/export-kbm?kelas_id=${kelasId}&user_id=${userId}`,
            {
              responseType: 'blob',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'ExportKBM.xlsx');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);

          Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'File berhasil diunduh',
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ekspor KBM Gagal!',
            showConfirmButton: false,
            timer: 1500,
          });
          console.log(error);
        }
      }
    });
  };
  // EXPORT KBM

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <SidebarGuru />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div
          style={{ backgroundColor: "white" }}
          className="my-10 border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-semibold text-gray-800">KBM Guru</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari KBM"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Link to={`/tambahkbm`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FontAwesomeIcon icon={faPlus} /> Tambah KBM
                  </button>
                </Link>
                <button
                  onClick={exportExcellKBM}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faFileExport} /> Export KBM
                </button>
              </div>
              <button
                onClick={openImportModal}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faUpload} /> Import Data
              </button>
            </div>
          </div>

          {showImportModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 w-11/12 sm:w-3/4 md:w-1/3 rounded-lg shadow-lg flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">Import Data</h2>
                <div className="mb-4">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelChange}
                    className="border border-gray-400 p-2 w-full mb-4"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={closeImportModal}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Batal
                  </button>
                  <button
                    onClick={importExcell}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Nama Guru
                  </th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Jam Masuk
                  </th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Jam Selesai
                  </th>
                  <th className="py-2 px-4 text-left">Materi</th>
                  <th className="py-2 px-4 text-center">Keterangan</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: "white" }}
                className="text-gray-600 text-base font-normal"
              >
                {filteredKBMGuru.length > 0 ? (
                  filteredKBMGuru
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
                    .map((kbm, index) => {
                      const username = users.find(
                        (u) => u.id === kbm.userId
                      )?.username;
                      if (username !== storedUsername) {
                        return null;
                      }
                      return (
                        <tr
                          key={kbm.id}
                          className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">
                            {currentPage * itemsPerPage + index + 1}
                          </td>
                          <td className="py-2 px-4">
                            {users.find((u) => u.id === kbm.userId)?.username}
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">
                            {kelas.find((k) => k.id === kbm.kelasId)?.kelas} -{" "}
                            {
                              kelas.find((k) => k.id === kbm.kelasId)
                                ?.nama_kelas
                            }
                          </td>
                          <td className="py-2 px-4">{kbm.jam_masuk}</td>
                          <td className="py-2 px-4">{kbm.jam_pulang}</td>
                          <td className="py-2 px-4">{kbm.materi}</td>
                          <td className="py-2 px-4 text-center">
                            {kbm.keterangan ? (
                              <span>{kbm.keterangan}</span>
                            ) : (
                              <span className="text-gray-400 italic whitespace-nowrap">
                                Keterangan belum ditambahkan
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Link to={`/EditKBM/${kbm.id}`}>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDeleteKBM(kbm.id)}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      Tidak ada data KBM yang ditemukan
                    </td>
                  </tr>
                )}
                {filteredKBMGuru.length > 0 &&
                  filteredKBMGuru.every(
                    (kbm) =>
                      users.find((u) => u.id === kbm.userId)?.username !==
                      storedUsername
                  ) && (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        Data KBM tidak tersedia untuk pengguna ini
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
              nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName="pagination flex justify-center items-center gap-2"
              previousLinkClassName="py-2 px-4 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              nextLinkClassName="py-2 px-4 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabledClassName="paginationDisabled"
              activeClassName="paginationActive py-2 px-4 bg-blue-600 text-white rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KBMGuru;
