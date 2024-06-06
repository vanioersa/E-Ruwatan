import React, { useState, useEffect } from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faArrowRight,
  faFileExport,
  faUpload,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { deletePiket, getAllPiket, updatePiket } from "./api_piket";
import Swal from "sweetalert2";
import * as xlsx from "xlsx";
import axios from "axios";

function PiketanGuru() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateOptions, setDateOptions] = useState([]);
  const [data, setData] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [filteredDate, setFilteredDate] = useState("");
  const [piketByDateAndClass, setPiketByDateAndClass] = useState({});
  const [showImportModal, setShowImportModal] = useState(false);

  const openImportModal = () => {
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
  };

  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await getAllPiket();
      setData(response);

      // Organize data by date and class
      const groupedData = {};
      response.forEach((item) => {
        const key = `${item.tanggal}_${item.kelasId}`;
        if (groupedData[key]) {
          groupedData[key].push(item);
        } else {
          groupedData[key] = [item];
        }
      });
      setPiketByDateAndClass(groupedData);
    } catch (error) {
      console.error("Failed to fetch Piketan Guru: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDateOptions = async () => {
      try {
        const response = await getAllPiket();
        const dateSet = new Set();
        response.forEach((item) => {
          dateSet.add(item.tanggal);
        });
        const sortedDates = Array.from(dateSet).sort(
          (a, b) => new Date(b) - new Date(a)
        );
        setDateOptions(sortedDates);
      } catch (error) {
        console.error("Failed to fetch Piketan Guru: ", error);
      }
    };
    fetchDateOptions();
  }, []);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await axios.get("http://localhost:4001/siswa/all");
        setSiswa(response.data);
      } catch (error) {
        console.error("Failed to fetch Siswa: ", error);
      }
    };
    fetchSiswa();
  }, []);

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

  const handleUpdatePiket = async (id, piketDTO) => {
    if (!id) {
      Swal.fire({
        title: "Gagal",
        text: "ID tidak valid",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const updatedPiket = await updatePiket(id, piketDTO);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedPiket : item))
      );
      Swal.fire({
        title: "Berhasil",
        text: "Data piket berhasil diperbarui",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Failed to update piket: ", error);
      Swal.fire({
        title: "Gagal",
        text: "Gagal memperbarui piket",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleDeletePiket = async (piketId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4001/piket/hapus/${piketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Berhasil",
        text: "Piketan berhasil dihapus",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Gagal menghapus piket: ", error);
      Swal.fire({
        title: "Gagal",
        text: "Gagal menghapus piket. Silakan coba lagi.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // window.location.reload();
  };

  const handleFilterPDF = () => {
    if (filteredDate) {
      navigate(`/pdf?date=${filteredDate}`);
    } else {
      navigate("/pdf");
    }
  };

  const handleFilterDate = (event) => {
    setFilteredDate(event.target.value);
  };

  const getStatusSummaryByDateAndClass = (tanggal, kelasId) => {
    const key = `${tanggal}_${kelasId}`;
    const piketData = piketByDateAndClass[key] || [];

    let statusCounts = {
      Masuk: 0,
      Izin: 0,
      Sakit: 0,
      Alpha: 0,
    };

    piketData.forEach((item) => {
      // Check if item.status is defined before calling toLowerCase
      if (item.status) {
        switch (item.status.toLowerCase()) {
          case "masuk":
            statusCounts.Masuk++;
            break;
          case "izin":
            statusCounts.Izin++;
            break;
          case "sakit":
            statusCounts.Sakit++;
            break;
          case "alpha":
            statusCounts.Alpha++;
            break;
          default:
            break;
        }
      }
    });

    return statusCounts;
  };

  const pageCount = Math.ceil(
    Object.keys(piketByDateAndClass).length / itemsPerPage
  );

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const dataToExport = data.map((item) => ({
    NamaSiswa: siswa.find((s) => s.id === item.siswaId)?.nama_siswa,
    Kelas: `${kelas.find((k) => k.id === item.kelasId)?.kelas} - ${kelas.find((k) => k.id === item.kelasId)?.nama_kelas
      }`,
    Tanggal: item.tanggal,
    Status: item.status,
  }));

  const exportToXlsx = () => {
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data piket guru yang diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mengexport data piket guru?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const worksheet = xlsx.utils.json_to_sheet(dataToExport);

        // Mengatur lebar kolom
        worksheet["!cols"] = [
          { wch: 20 }, // Lebar kolom "NamaSiswa"
          { wch: 15 }, // Lebar kolom "Kelas"
          { wch: 15 }, // Lebar kolom "Tanggal"
          { wch: 10 }, // Lebar kolom "Status"
        ];

        // Membuat header kolom menjadi bold
        const headerRange = "A1:D1";
        worksheet[headerRange]?.forEach((cell) => {
          if (cell) {
            cell.s = {
              font: {
                bold: true,
              },
            };
          }
        });

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Data Piket Guru");
        xlsx.writeFile(workbook, "data_piket_guru.xlsx");

        Swal.fire({
          title: "Berhasil",
          text: "Data piket guru berhasil diekspor",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  // Tambahkan state baru untuk menangani file Excel yang diunggah
  const [excelFile, setExcelFile] = useState(null);

  // Buat fungsi untuk menangani perubahan pada file Excel yang diunggah
  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const importExcell = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      Swal.fire("Error", "Anda belum memilih file untuk diimport!.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await axios.post(
        "http://localhost:4001/piket/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      Swal.fire("Sukses!", "Berhasil Ditambahkan.", "success");
    } catch (error) {
      console.error("Error importing file:", error);
      Swal.fire("Error", "Gagal mengimpor file.", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <SidebarGuru />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div
          style={{ backgroundColor: "white" }}
          className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-semibold text-gray-800">Piketan Guru</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari Piketan"
              className="w-full md:w-1/3 p-2 border border-gray-300 text-gray-700 rounded focus:outline-none focus:border-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap justify-center space-y-3">
              <Link to={`/tambahpiketan`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 mt-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah Piket
                </button>
              </Link>
              <button
                onClick={exportToXlsx}
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export Piket
              </button>
              <button
                onClick={handleModalOpen}
                className="bg-rose-500 hover:bg-rose-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faUpload} /> Export PDF
              </button>
              <button
                onClick={openImportModal}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faUpload} /> Import Data
              </button>

              {showImportModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                  <div className="bg-white p-6 w-11/12 sm:w-3/4 md:w-1/3 rounded-lg shadow-lg flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4">Import Data</h2>
                    <div className="flex justify-between mb-4">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelChange}
                        className="border border-gray-400 p-2 w-full mb-4"
                      />
                      <button
                        onClick={closeImportModal}
                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Batal
                      </button>
                    </div>
                    <div className="flex justify-end">
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
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-center">No</th>
                  <th className="py-2 px-4 text-center">Kelas</th>
                  <th className="py-2 px-4 text-center">Tanggal</th>
                  <th
                    className="py-2 px-4 text-center whitespace-nowrap"
                    style={{ maxWidth: "50px" }}
                  >
                    Masuk
                  </th>
                  <th
                    className="py-2 px-4 text-center whitespace-nowrap"
                    style={{ maxWidth: "50px" }}
                  >
                    Izin
                  </th>
                  <th
                    className="py-2 px-4 text-center whitespace-nowrap"
                    style={{ maxWidth: "50px" }}
                  >
                    Sakit
                  </th>
                  <th
                    className="py-2 px-4 text-center whitespace-nowrap"
                    style={{ maxWidth: "50px" }}
                  >
                    Alpha
                  </th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: "white" }}
                className="text-gray-600 text-base font-normal"
              >
                {Object.keys(piketByDateAndClass).length > 0 ? (
                  Object.keys(piketByDateAndClass)
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
                    .map((key, index) => {
                      const [tanggal, kelasId] = key.split("_");
                      const kelasData = kelas.find(
                        (k) => k.id === parseInt(kelasId)
                      );
                      const kelasName = kelasData
                        ? `${kelasData.kelas} ${kelasData.nama_kelas}`
                        : "";
                      const statusSummary = getStatusSummaryByDateAndClass(
                        tanggal,
                        parseInt(kelasId)
                      );

                      const filteredPiketData = piketByDateAndClass[key].filter(
                        (item) => {
                          const kelasNama = kelasData ? kelasData.kelas : "";
                          const namaKelas = kelasData
                            ? kelasData.nama_kelas
                            : "";
                          const tanggalItem = item.tanggal
                            ? item.tanggal.toLowerCase()
                            : "";
                          const searchTermLower = searchTerm.toLowerCase();

                          return (
                            (kelasNama
                              .toLowerCase()
                              .includes(searchTermLower) ||
                              namaKelas
                                .toLowerCase()
                                .includes(searchTermLower) ||
                              tanggalItem.includes(searchTermLower)) &&
                            (filteredDate === "" ||
                              (item.status &&
                                item.status
                                  .toLowerCase()
                                  .includes(filteredDate.toLowerCase())))
                          );
                        }
                      );

                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4 text-center">
                            {currentPage * itemsPerPage + index + 1}
                          </td>
                          <td className="py-2 px-4 text-center whitespace-nowrap">{kelasName}</td>
                          <td className="py-2 px-4 text-center whitespace-nowrap">{tanggal}</td>
                          <td className="py-2 px-4 text-center text-sm">
                            {statusSummary.Masuk}
                          </td>
                          <td className="py-2 px-4 text-center text-sm">
                            {statusSummary.Izin}
                          </td>
                          <td className="py-2 px-4 text-center text-sm">
                            {statusSummary.Sakit}
                          </td>
                          <td className="py-2 px-4 text-center text-sm">
                            {statusSummary.Alpha}
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdatePiket(filteredPiketData[0].id)
                                }
                                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeletePiket(filteredPiketData[0].id)
                                }
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
                    <td colSpan="8" className="text-sm py-4 text-center">
                      Data Piketan tidak tersedia untuk pengguna ini
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
              previousLinkClassName="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded focus:outline-none"
              nextLinkClassName="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded focus:outline-none"
              disabledClassName="paginationDisabled opacity-50 cursor-not-allowed"
              activeClassName="paginationActive py-2 px-4 bg-blue-600 text-white rounded"
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 w-11/12 sm:w-3/4 md:w-1/3 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Filter Tanggal</h2>
            <select
              className="border border-gray-400 p-2 w-full mb-4 text-gray-700"
              value={filteredDate}
              onChange={handleFilterDate}
            >
              <option value="">Pilih Tanggal</option>
              {dateOptions.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleFilterPDF}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PiketanGuru;
