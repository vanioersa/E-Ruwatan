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
  faFileImport,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { importKelas, getAllKelas, deleteKelas } from "./api_kelas";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const kelasPerPage = 10;
  const pagesVisited = pageNumber * kelasPerPage;
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImportData = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      importKelas(formData)
        .then((response) => {
          Swal.fire({
            title: "Berhasil",
            text: "Data kelas berhasil diimport",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Error importing data:", error);
          Swal.fire({
            title: "Error",
            text: "Gagal mengimpor data",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "Mohon pilih file untuk diimpor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Fetch data for Kelas from the API
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const data = await getAllKelas();
        setKelas(data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  // Function to delete a Kelas
  const handleDelete = async (id, kelasName) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data kelas ${kelasName}?`,
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
            text: `Data kelas ${kelasName} berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Kelas: ", error);
          Swal.fire({
            title: "Gagal",
            text: `Gagal menghapus kelas ${kelasName}`,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  // Function to handle page change
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Filter data based on the search term
  const filteredKelas = kelas.filter((k) => {
    return (
      k.nama_kelas &&
      k.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate the number of pages needed for pagination
  const pageCount = Math.ceil(filteredKelas.length / kelasPerPage);

  const headers = [
    // { label: "NO.", key: "No.", width: 1 },
    { label: "NAMA KELAS", key: "Nama Kelas", width: 10 },
    { label: "KELAS", key: "Kelas", width: 5 },
  ];

  // Prepare data for export
  const dataToExport = filteredKelas.map((k, index) => ({
    // No: index + 1 + pagesVisited + ".",
    "Nama Kelas": k.nama_kelas,
    Kelas: k.kelas,
  }));

  // Prepare options for CSVLink
  const csvOptions = {
    headers: headers,
    separator: ";",
    filename: "data_kelas.csv",
  };

  // Prepare options for Excel export
  const excelOptions = {
    bookType: "xlsx",
    type: "array",
  };

  // Export data to Excel
  const handleExportExcel = () => {
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data kelas yang diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mengexport data kelas?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const columnWidths = [{ wpx: 65 }, { wpx: 30 }];

        worksheet["!cols"] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, excelOptions);

        const excelData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const excelUrl = URL.createObjectURL(excelData);

        const link = document.createElement("a");
        link.href = excelUrl;
        link.download = "data_kelas.xlsx";
        link.click();

        Swal.fire({
          title: "Berhasil",
          text: "Data kelas berhasil diekspor",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleDownloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["NAMA KELAS", "KELAS"],
      [null, null, null], // Dummy row to set widths
    ]);
  
    // Set column widths
    const columnWidths = [{ wpx: 70 }, { wpx: 40 }];
  
    worksheet["!cols"] = columnWidths;
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Export workbook to XLSX file
    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const excelUrl = URL.createObjectURL(excelData);
  
    const link = document.createElement("a");
    link.href = excelUrl;
    link.download = "template_kelas.xlsx";
    link.click();
  
    Swal.fire({
      title: "Berhasil",
      text: "Template kelas berhasil diunduh",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800">Data Kelas</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex">
              <Link to="/TambahKelas">
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah Kelas
                </button>
              </Link>
              <button
                onClick={handleExportExcel}
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export Kelas
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faFileImport} /> Import Kelas
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama Kelas</th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
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
                        <td className="py-2 px-4">{k.nama_kelas}</td>
                        <td className="py-2 px-4">{k.kelas}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
                            <Link to={`/EditKelas/${k.id}`}>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(k.id, k.nama_kelas)}
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
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 5px 10px rgba(0, 0, 0, 0.12)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Import Data Kelas
            </h2>
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileSelect}
            />
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
              <button
                onClick={handleImportData}
                className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Impor
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faDownload} /> Download Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kelas;
