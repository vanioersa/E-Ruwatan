import React, { useState, useEffect } from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft, faArrowRight, faTrash, faEdit, faFileExport, faUpload } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { deletePenilaian, getAllPenilaian } from "./api_penilaian";
import Swal from "sweetalert2";

function Penilaian() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [kelas, setKelas] = useState([]);
  // const [siswa, setSiswa] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  const pageCount = Math.ceil(data.length / dataPerPage);

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const openImportModal = () => {
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
  };

  const importExcell = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Anda belum memilih file untuk diimport!.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:4001/penilaian/upload/importPenilaian",
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
        text: "Berhasil Ditambahkan.",
        showConfirmButton: false,
        timer: 2000,
      });
      fetchData();
    } catch (error) {
      console.error("Error importing file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengimpor file. " + error.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchKelas();
    // fetchSiswa();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllPenilaian();
      setData(response.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
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

  // const fetchSiswa = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:4001/siswa/all");
  //     setSiswa(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch Siswa: ", error);
  //   }
  // };

  const handleUpdate = (id) => {
    window.location.href = `/EditPenilaian/${id}`;
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data penilaian?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePenilaian(id);
          setData((prevData) => prevData.filter((p) => p.id !== id));
          Swal.fire({
            title: "Berhasil",
            text: `Data penilaian berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete penilaian: ", error);
          Swal.fire({
            title: "Gagal",
            text: `Gagal menghapus penilaian`,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
    });
  };

  const filteredData = data.filter((item) => {
    const kelass = kelas.find((k) => k.id === item.kelasId)?.kelas;
    const namaKelas = kelas.find((k) => k.id === item.kelasId)?.nama_kelas;

    return (
      (item.nilai && item.nilai.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelass && namaKelas && `${kelass} - ${namaKelas}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const exportExcell = async () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mengexport data Penilaian?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:4001/penilaian/upload/export-penilaian`,
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
          link.setAttribute("download", "ExportPenilaian.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
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
            text: "Ekspor Penilaian Gagal!",
            showConfirmButton: false,
            timer: 1500,
          });
          console.error("Error exporting file:", error);
        }
      }
    });
  };

  const exportExcellPenilaian = () => {
    if (filteredData.length > 0) {
      const kelasIds = filteredData.map((item) => item.kelas_id);
      const siswaIds = filteredData.map((item) => item.siswa_id);
      exportExcell(kelasIds, siswaIds);
    } else {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data Penilaian untuk diekspor",
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
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4001/penilaian/download/template-penilaian",
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
      link.setAttribute("download", "Templat-Penilaian.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
      Swal.fire({
        title: "Berhasil!",
        text: "Template berhasil diunduh.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saat mengunduh file:", error);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat mengunduh template.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
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
          <h1 className="text-3xl font-semibold text-gray-800">
            Penilaian Guru
          </h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex md:flex-row md:justify-start md:items-center">
              <select
                className="py-2 pl-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-500"
                value={dataPerPage}
                onChange={(e) => setDataPerPage(Number(e.target.value))}
                style={{ height: "45px" }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <input
                type="search"
                placeholder="Cari Guru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 border border-gray-300 rounded-r-lg focus:outline-none focus:border-gray-500"
                style={{ height: "45px" }}
              />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
              <div className="flex space-x-2 w-full md:w-auto">
                <Link to={`/Tambahpenilaian`} className="w-full md:w-auto">
                  <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FontAwesomeIcon icon={faPlus} /> Tambah Nilai
                  </button>
                </Link>
                <button
                  onClick={exportExcellPenilaian}
                  className="w-full md:w-auto bg-green-500 hover:bg-green-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faFileExport} /> Export Nilai
                </button>
              </div>
              <button
                onClick={openImportModal}
                className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <button
                      onClick={closeImportModal}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
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

          <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-center">No</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Nama Siswa
                  </th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Kelas
                  </th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Nilai Siswa
                  </th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Deskripsi
                  </th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: "white" }}
                className="text-gray-600 text-base font-normal"
              >
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(
                      currentPage * dataPerPage,
                      (currentPage + 1) * dataPerPage
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                        key={item.id}
                      >
                        <td className="py-2 px-4 text-center">
                          {index + 1 + currentPage * dataPerPage}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-nowrap capitalize">
                          {item.siswa.nama_siswa}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-nowrap">
                          {`${item.kelas.kelas} - ${item.kelas.nama_kelas}`}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-nowrap">
                          {item.nilai}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-nowrap capitalize">
                          {item.deskripsi ? (
                            <span>{item.deskripsi}</span>
                          ) : (
                            <span className="text-gray-400 italic whitespace-nowrap">
                              Deskripsi belum ditambahkan
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              onClick={() => handleUpdate(item.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                    {searchTerm ? "Data Penilaian Tidak Ditemukan" : "Data Penilaian Tidak Tersedia"}
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
    </div>
  );
}

export default Penilaian;
