import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faPlus,
  // faUpload,
  faEdit,
  faArrowLeft,
  faArrowRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

function PiketanGuru() {
  // const [showImportModal, setShowImportModal] = useState(false);
  // const [showPDFModal, setShowPDFModal] = useState(false);
  const [piketan, setPiketan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [kelas, setKelas] = useState([]);
  // const [selectedTanggal, setSelectedTanggal] = useState("");
  // const [selectedKelasId, setSelectedKelasId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPiketan();
    fetchKelas();
  }, []);

  const fetchPiketan = async () => {
    try {
      const response = await axios.get("/piket/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Piketan data:", response.data);
      setPiketan(response.data);
    } catch (error) {
      console.error("Error fetching piketan data", error);
    }
  };

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Failed to fetch Kelas: ", error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * itemsPerPage;
  const filteredPiketan = piketan.filter((piket) => {
    const kelasInfo = kelas.find((k) => k.id === piket.kelasId);
    const statusCounts = {
      Masuk: 0,
      Izin: 0,
      Sakit: 0,
      Alpha: 0,
    };

    piket.siswaStatusList.forEach((siswaStatus) => {
      siswaStatus.statusList.forEach((status) => {
        if (status in statusCounts) {
          statusCounts[status]++;
        }
      });
    });

    return (
      String(piket.tanggal).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(kelasInfo?.kelas)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(kelasInfo?.nama_kelas)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(piket.siswaStatusList.length)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(statusCounts.Masuk)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(statusCounts.Izin)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(statusCounts.Sakit)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(statusCounts.Alpha)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const currentPiketan = filteredPiketan.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredPiketan.length / itemsPerPage);

  const handleExport = async () => {
    if (piketan.length === 0) {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data Piketan untuk diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Konfirmasi",
      text: "Anda yakin ingin mengekspor data piket?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.get("/piket/export-excel", {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "piket_data.xlsx");
        document.body.appendChild(link);
        link.click();

        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "File berhasil diunduh",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error exporting data", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal mengekspor data!",
        });
      }
    }
  };

  // const handleImport = async (event) => {
  //   const file = event.target.files[0];
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     await axios.post("/piket/import", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     fetchPiketan();
  //     closeImportModal();
  //   } catch (error) {
  //     console.error("Error importing data", error);
  //   }
  // };

  // const openImportModal = () => {
  //   setShowImportModal(true);
  // };

  // const closeImportModal = () => {
  //   setShowImportModal(false);
  // };

  // const openPDFModal = () => {
  //   setShowPDFModal(true);
  // };

  // const closePDFModal = () => {
  //   setShowPDFModal(false);
  //   window.location.reload();
  // };

  const handleDeletePiketById = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Konfirmasi",
      text: "Anda yakin ingin menghapus piket ini?",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/piket/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          Swal.fire({
            title: "Berhasil",
            text: `Data piket berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          fetchPiketan();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Gagal menghapus piket!",
          });
        }
      } catch (error) {
        console.error("Error deleting piket", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menghapus piket!",
        });
      }
    }
  };

  // const handleExportPDF = async () => {
  //   if (selectedTanggal && selectedKelasId) {
  //     try {
  //       setShowPDFModal(false);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Berhasil!",
  //         text: "File PDF berhasil diunduh",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       }).then(() => {
  //         // Redirect to PDF page
  //         window.location.href = `/pdf/page?tanggal=${selectedTanggal}&kelasId=${selectedKelasId}`;
  //       });
  //     } catch (error) {
  //       console.error("Error exporting PDF", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: "Gagal mengekspor PDF!",
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Peringatan",
  //       text: "Silakan pilih tanggal dan kelas terlebih dahulu!",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //   }
  // };

  const formatTanggal = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

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
          <h1 className="text-3xl font-semibold text-gray-800">Piketan Guru</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari Piketan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
              <div className="flex space-x-2 w-full md:w-auto">
                <Link to={`/tambahpiketan`} className="w-full md:w-auto">
                  <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FontAwesomeIcon icon={faPlus} /> Tambah Piketan
                  </button>
                </Link>
                <button
                  onClick={handleExport}
                  className="w-full md:w-auto bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faFileExport} /> Export Piket
                </button>
                {/* <button
                  onClick={openPDFModal}
                  className="w-full md:w-auto bg-rose-500 hover:bg-rose-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faUpload} /> Export PDF
                </button>
                <button
                  onClick={openImportModal}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faUpload} /> Import Data
                </button> */}
              </div>
            </div>

            {/* {showPDFModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 w-11/12 sm:w-3/4 md:w-1/3 rounded-lg shadow-lg flex flex-col">
                  <h2 className="text-2xl font-semibold mb-4">Import Data</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggal:
                    </label>
                    <select
                      value={selectedTanggal}
                      onChange={(e) => setSelectedTanggal(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Pilih Tanggal</option>
                      {piketan.map((piket, index) => (
                        <option key={index} value={piket.tanggal}>
                          {formatTanggal(piket.tanggal)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Kelas:
                    </label>
                    <select
                      value={selectedKelasId}
                      onChange={(e) => setSelectedKelasId(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Pilih Kelas</option>
                      {kelas.map((kelas) => (
                        <option key={kelas.id_kelas} value={kelas.id_kelas}>
                          {kelas.kelas} - {kelas.nama_kelas}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={closePDFModal}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showImportModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 w-11/12 sm:w-3/4 md:w-1/3 rounded-lg shadow-lg flex flex-col">
                  <h2 className="text-2xl font-semibold mb-4">Import Data</h2>
                  <div className="mb-4">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleImport}
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
                    <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Import
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4">No</th>
                  <th className="py-2 px-4 text-center">Tanggal</th>
                  <th className="py-2 px-4 text-center">Kelas</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Jumlah Siswa
                  </th>
                  <th className="py-2 px-4 text-center">Masuk</th>
                  <th className="py-2 px-4 text-center">Izin</th>
                  <th className="py-2 px-4 text-center">Sakit</th>
                  <th className="py-2 px-4 text-center">Alpha</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: "white" }}
                className="text-gray-600 text-base font-normal"
              >
                {currentPiketan.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-4 px-6 text-center">
                      {filteredPiketan.length === 0
                        ? "Data yang Anda cari tidak ditemukan."
                        : "Tidak ada data piketan yang ditemukan."}
                    </td>
                  </tr>
                ) : (
                  currentPiketan.map((piket, index) => {
                    const statusCounts = {
                      Masuk: 0,
                      Izin: 0,
                      Sakit: 0,
                      Alpha: 0,
                    };

                    piket.siswaStatusList.forEach((siswaStatus) => {
                      siswaStatus.statusList.forEach((status) => {
                        if (status in statusCounts) {
                          statusCounts[status]++;
                        }
                      });
                    });

                    Object.keys(statusCounts).forEach((key) => {
                      if (statusCounts[key] === 0) {
                        statusCounts[key] = "-";
                      }
                    });

                    return (
                      <tr
                        key={piket.id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-2 px-4">
                          {index + 1 + currentPage * itemsPerPage}
                        </td>
                        <td className="py-2 px-4 text-center ">
                          {formatTanggal(piket.tanggal)}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-nowrap">
                          {kelas.find((k) => k.id === piket.kelasId)?.kelas} -{" "}
                          {
                            kelas.find((k) => k.id === piket.kelasId)
                              ?.nama_kelas
                          }
                        </td>
                        <td className="py-2 px-4 text-center">
                          {piket.siswaStatusList.length}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {statusCounts["Masuk"]}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {statusCounts["Izin"]}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {statusCounts["Sakit"]}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {statusCounts["Alpha"]}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/editpiketan/${piket.id}`}
                              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <button
                              onClick={() => handleDeletePiketById(piket.id)}
                              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                              title="Hapus"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
              nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              subContainerClassName={"pages pagination"}
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

export default PiketanGuru;
