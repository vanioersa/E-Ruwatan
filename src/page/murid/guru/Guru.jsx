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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUsers } from "./api_guru";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

function Guru() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const guruPerPage = 10;
  const pagesVisited = pageNumber * guruPerPage;
  const [guru, setGuru] = useState([]);
  const [isHiddenTelepon, setIsHiddenTelepon] = useState(true);
  const [selectedGuruId, setSelectedGuruId] = useState(null);

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

  const excelOptions = {
    bookType: "xlsx",
    type: "array",
  };

  const handleExportExcel = () => {
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data guru yang diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mengexport data guru?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        const columnWidths = {};

        const columnKeys =
          dataToExport.length > 0 ? Object.keys(dataToExport[0]) : [];

        columnKeys.forEach((key) => {
          columnWidths[key] = key.length;
        });

        dataToExport.forEach((data) => {
          columnKeys.forEach((key) => {
            const value = data[key] ? String(data[key]) : "";
            columnWidths[key] = Math.max(columnWidths[key], value.length);
          });
        });

        const excelColumns = columnKeys.map((key) => ({
          wch: columnWidths[key],
        }));

        worksheet["!cols"] = excelColumns;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, excelOptions);

        const excelData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const excelUrl = URL.createObjectURL(excelData);

        const link = document.createElement("a");
        link.href = excelUrl;
        link.download = "data_guru.xlsx";
        link.click();

        Swal.fire({
          title: "Berhasil",
          text: "Data guru berhasil diekspor",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleDoubleClick = (id) => {
    setSelectedGuruId(id);
    setIsHiddenTelepon((prevState) => !prevState);
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
            <div className="flex">
              <Link to="/TambahGuru">
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah Guru
                </button>
              </Link>
              <button
                onClick={handleExportExcel}
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export Guru
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
    </div>
  );
}

export default Guru;
