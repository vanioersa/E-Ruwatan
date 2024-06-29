import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faFileExport,
  faArrowLeft,
  faArrowRight,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUsers } from "./api_guru";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import axios from "axios";

function Guru() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const guruPerPage = 10;
  const pagesVisited = pageNumber * guruPerPage;
  const [guru, setGuru] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHiddenTelepon, setIsHiddenTelepon] = useState(true);
  const [selectedGuruId, setSelectedGuruId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // State untuk menyimpan file yang dipilih

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]); // Update state dengan file yang dipilih
  };

  const handleImportData = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
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
            `http://localhost:4001/guru/upload/import`,
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
          setIsModalOpen(false); // Tutup modal setelah impor
          // fetchGuru(); // Memanggil kembali fetchGuru untuk memuat data baru
        } catch (error) {
          console.error("Error importing file:", error);
          Swal.fire("Error", "Gagal mengimpor file. " + error.message, "error");
        }
      }
    });
  };

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const response = await getAllUsers();
        const filteredGuru = response.filter((g) => g.role === "GURU");
        setGuru(filteredGuru.reverse());
      } catch (error) {
        console.error("Gagal mengambil data Guru: ", error);
      }
    };
    fetchGuru();
  }, []);

  const handleDelete = async (id, username) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data ${username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUsers(id);
          setGuru((prevGuru) => prevGuru.filter((g) => g.id !== id));
          Swal.fire({
            title: "Berhasil",
            text: `Data guru ${username} berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Gagal menghapus guru: ", error);
          Swal.fire("Gagal", `Gagal menghapus guru ${username}`, "error");
        }
      }
    });
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredGuru = guru.filter((g) => {
    const usernameMatch =
      g.username && g.username.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch =
      typeof g.email === "string" &&
      g.email.toLowerCase().includes(searchTerm.toLowerCase());
    const genderMatch =
      typeof g.gender === "string" &&
      g.gender.toLowerCase().includes(searchTerm.toLowerCase());
    const alamatMatch =
      typeof g.alamat === "string" &&
      g.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    const teleponMatch =
      typeof g.telepon === "string" &&
      g.telepon.toLowerCase().includes(searchTerm.toLowerCase());
    const statusNikahMatch =
      typeof g.status_nikah === "string" &&
      g.status_nikah.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      usernameMatch ||
      emailMatch ||
      genderMatch ||
      alamatMatch ||
      teleponMatch ||
      statusNikahMatch
    );
  });

  const pageCount = Math.ceil(filteredGuru.length / guruPerPage);

  // const modifiedGuru = filteredGuru.map((g, index) => {
  //   const modifiedTelepon =
  //     g.telepon && g.telepon.replace(/^08/, "+62 ").replace(/.{4}$/, "****");

  //   return {
  //     ...g,
  //     modifiedTelepon,
  //   };
  // });

  const modifiedGuru = filteredGuru.map((g, index) => {
    const modifiedTelepon = g.telepon && g.telepon.replace(/^08/, "+62 ");

    return {
      ...g,
      modifiedTelepon,
    };
  });

  const dataToExport = modifiedGuru.map((g, index) => ({
    No: index + 1 + pagesVisited,
    "Nama Guru": g.username,
    Email: g.email,
    "Jenis Kelamin": g.gender,
    Alamat: g.alamat,
    "Nomor Telepon": g.modifiedTelepon,
    "Status Pernikahan": g.status_nikah,
  }));

  const exportExcelGuru = async () => {
    if (dataToExport.length > 0) {
      Swal.fire({
        title: "Konfirmasi",
        text: "Anda yakin ingin mengexport data guru?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              "http://localhost:4001/guru/upload/export-guru",
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
            link.setAttribute("download", "ExportGuru.xlsx");
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
              text: "Ekspor Guru Gagal!",
              showConfirmButton: false,
              timer: 1500,
            });
            console.error("Ekspor Guru Error:", error);
          }
        }
      });
    } else {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data Guru untuk diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleDoubleClick = (id) => {
    setSelectedGuruId(id);
    setIsHiddenTelepon((prevState) => !prevState);
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
        "http://localhost:4001/guru/download/template-guru",
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
      link.setAttribute("download", "Template_Guru.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error saat mengunduh file:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div
          style={{ backgroundColor: "white" }}
          className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-semibold text-gray-800">Data Guru</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari Guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex flex-col md:flex-row justify-center md:justify-start gap-2 md:gap-4">
              <div className="flex flex-row gap-2 md:gap-4">
                <Link to="/TambahGuru">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white px-1 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FontAwesomeIcon icon={faPlus} /> Tambah Guru
                  </button>
                </Link>
                <button
                  onClick={exportExcelGuru}
                  className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FontAwesomeIcon icon={faFileExport} /> Export Guru
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
          <div className="mt-4 overflow-x-auto border  border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-base leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Nama Guru
                  </th>
                  <th className="py-2 px-4 text-center">Email</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Jenis Kelamin
                  </th>
                  <th className="py-2 px-4 text-center">Alamat</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Nomor Telepon
                  </th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Status Pernikahan
                  </th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody
                style={{ backgroundColor: "white" }}
                className="text-gray-600 text-base font-normal"
              >
                {modifiedGuru.length > 0 ? (
                  modifiedGuru
                    .slice(pagesVisited, pagesVisited + guruPerPage)
                    .map((g, index) => (
                      <tr
                        key={g.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">
                          {index + 1 + pagesVisited}
                        </td>
                        <td className="py-2 px-4">{g.username}</td>
                        <td className="py-2 px-4">{g.email}</td>
                        <td className="py-2 px-4 text-center">
                          {g.gender ? (
                            <span>{g.gender}</span>
                          ) : (
                            <span
                              className="text-gray-400 italic text-sm whitespace-nowrap"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              Data kosong
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {g.alamat ? (
                            <span>{g.alamat}</span>
                          ) : (
                            <span
                              className="text-gray-400 italic text-sm whitespace-nowrap"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              Data kosong
                            </span>
                          )}
                        </td>
                        <td
                          className="py-2 px-4 text-center"
                          onDoubleClick={() => handleDoubleClick(g.id)}
                        >
                          {g.telepon ? (
                            g.id === selectedGuruId ? (
                              isHiddenTelepon ? (
                                <span>
                                  {g.modifiedTelepon
                                    ? g.modifiedTelepon.replace(/.{4}$/, "****")
                                    : ""}
                                </span>
                              ) : (
                                <span>{g.modifiedTelepon}</span>
                              )
                            ) : (
                              <span>
                                {g.modifiedTelepon
                                  ? g.modifiedTelepon.replace(/.{4}$/, "****")
                                  : ""}
                              </span>
                            )
                          ) : (
                            <span
                              className="text-gray-400 italic text-sm whitespace-nowrap"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              Data kosong
                            </span>
                          )}
                        </td>

                        <td className="py-2 px-4 text-center">
                          {g.status_nikah ? (
                            <span>{g.status_nikah}</span>
                          ) : (
                            <span
                              className="text-gray-400 italic text-sm whitespace-nowrap"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              Data kosong
                            </span>
                          )}
                        </td>

                        <td className="py-2 px-4">
                          <div className="flex justify-center gap-2">
                            <Link to={`/EditGuru/${g.id}`}>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(g.id, g.username)}
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
                    <td colSpan="8" className="py-4 text-center text-gray-500">
                      Tidak ada data guru yang ditemukan.
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
            <h2 className="text-xl font-semibold mb-4">Import Data Kelas</h2>
            <input
              className="border border-gray-400 p-2 w-full mb-4"
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileSelect}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Tutup
              </button>
              <div>
                <button
                  onClick={handleImportData}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 mr-3 md:mr-2 rounded"
                >
                  Import
                </button>
                <button
                  onClick={downloadFormat}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                >
                  Unduh Templat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Guru;
