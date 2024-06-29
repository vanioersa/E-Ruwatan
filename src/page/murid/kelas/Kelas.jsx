import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faFileExport,
  faArrowLeft,
  faArrowRight,
  faUpload,
  // faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { importKelas, getAllKelas, deleteKelas } from "./api_kelas";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import axios from "axios";

function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const kelasPerPage = 10;
  const pagesVisited = pageNumber * kelasPerPage;
  const [selectedFile, setSelectedFile] = useState(null); // State untuk menyimpan file yang dipilih

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]); // Update state dengan file yang dipilih
  };

  const handleImportData = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      // Periksa apakah file sudah dipilih
      Swal.fire("Error", "Anda belum memilih file untuk diimport!", "error");
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengimpor data dari file ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, impor!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("file", selectedFile); // Menggunakan selectedFile yang sudah diupdate

        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `http://localhost:4001/kelas/upload/import`,
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

  // Fetch data for Kelas from the API
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const data = await getAllKelas();
        setKelas(data.reverse());
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  // Function to delete a Kelas
  const handleDelete = async (id, namaKelas, kelasName) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data kelas ${kelasName} ${namaKelas}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKelas(id);
          setKelas((prevKelas) => prevKelas.filter((k) => k.id !== id));
          Swal.fire({
            title: "Berhasil",
            text: `Data kelas ${kelasName} ${namaKelas} berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Kelas: ", error);
          Swal.fire({
            title: "Gagal",
            text: `Gagal menghapus kelas ${kelasName} ${namaKelas}`,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredKelas = kelas.filter((k) => {
    return (
      (k.nama_kelas &&
        k.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (k.kelas && k.kelas.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const pageCount = Math.ceil(filteredKelas.length / kelasPerPage);
  const dataToExport = filteredKelas.map((k, index) => ({
    No: index + 1 + pagesVisited,
    "Nama Kelas": k.nama_kelas,
    Kelas: k.kelas,
  }));

  // Export data to Excel
  const exportExcelKelas = async () => {
    if (dataToExport.length > 0) {
      Swal.fire({
        title: "Konfirmasi",
        text: "Anda yakin ingin mengexport data kelas?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              "http://localhost:4001/kelas/upload/export-kelas",
              {
                responseType: "blob",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ExportKelas.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "File berhasil diunduh",
              showConfirmButton: false,
              timer: 2000,
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Ekspor Kelas Gagal!",
              showConfirmButton: false,
              timer: 1500,
            });
            console.error("Ekspor Kelas Error:", error);
          }
        }
      });
    } else {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data Kelas untuk diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const downloadFormat = async (e) => {
    e.preventDefault();

    const isConfirmed = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengunduh template ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, unduh!",
    });

    if (!isConfirmed.isConfirmed) {
      return; // Jika pengguna tidak mengonfirmasi, keluar dari fungsi
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4001/kelas/download/template",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template_Kelas.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error saat mengunduh file:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className={`sidebar w-full md:w-64 bg-gray-100 shadow-lg ${
          isModalOpen ? "bg-gray-100" : ""
        }`}
        style={{
          backgroundColor: isModalOpen ? "#F3F4F6" : "",
        }}
      >
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div
          style={{ backgroundColor: "white" }}
          className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-semibold text-gray-800">Data Kelas</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari Kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex flex-col md:flex-row justify-center md:justify-start gap-2 md:gap-4">
              <div className="flex flex-row gap-2 md:gap-4">
                <Link to="/TambahKelas">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white px-1 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FontAwesomeIcon icon={faPlus} /> Tambah Kelas
                  </button>
                </Link>
                <button
                  onClick={exportExcelKelas}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faFileExport} /> Export Kelas
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)} // Buka modal untuk import data
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <FontAwesomeIcon icon={faUpload} /> Import Data
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-base leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-center">Kelas</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Nama Kelas
                  </th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: "white" }}
                className="text-gray-600 text-base font-normal"
              >
                {filteredKelas.length > 0 ? (
                  filteredKelas
                    .slice(pagesVisited, pagesVisited + kelasPerPage)
                    .map((k, index) => (
                      <tr
                        key={k.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">
                          {index + 1 + pagesVisited}
                        </td>
                        <td className="py-2 px-4 text-center">{k.kelas}</td>
                        <td className="py-2 px-4 text-center">
                          {k.nama_kelas}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link to={`/EditKelas/${k.id}`}>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(k.id, k.nama_kelas, k.kelas)
                              }
                              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      Tidak ada data kelas yang ditemukan.
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 w-11/12 sm:w-3/4 md:w-1/3 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Import Data</h2>
            <div className="mb-4">
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileSelect}
                className="border border-gray-400 p-2 w-full mb-4"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
                >
                  Batal
                </button>
                <button
                  onClick={handleImportData}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Import
                </button>
              </div>
              <button
                onClick={downloadFormat}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Unduh Templat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kelas;
