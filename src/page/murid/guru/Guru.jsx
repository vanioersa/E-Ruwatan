import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faFileExport, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllGurus, deleteGuru } from "./api_guru";
import ReactPaginate from "react-paginate";
import axios from "axios";
import * as XLSX from "xlsx";

function Guru() {
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const guruPerPage = 10;
  const pagesVisited = pageNumber * guruPerPage;

  // Ambil data guru dari API
  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const data = await getAllGurus();
        setGuru(data);
      } catch (error) {
        console.error("Failed to fetch Guru: ", error);
      }
    };
    fetchGuru();
  }, []);

  // Ambil data kelas dari API
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

  // Fungsi untuk menghapus guru
  const handleDelete = async (id, nama_guru) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data guru ${nama_guru}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGuru(id);
          setGuru((prevGuru) => prevGuru.filter((g) => g.id !== id));
          Swal.fire({
            title: "Berhasil",
            text: `Data guru ${nama_guru} berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          });
        } catch (error) {
          console.error("Gagal menghapus guru: ", error);
          Swal.fire("Gagal", `Gagal menghapus guru ${nama_guru}`, "error");
        }
      }
    });
  };


  // 2Fungsi untuk mengganti halaman
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Filter data berdasarkan term pencarian
  const filteredGuru = guru.filter((g) => {
    const kelasNama = kelas.find((k) => k.id === g.kelasId)?.kelas;
    return (
      (g.nama_guru && g.nama_guru.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (g.nip && g.nip.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (g.tempat_lahir && g.tempat_lahir.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (g.mapel && g.mapel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelasNama && kelasNama.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Jumlah halaman yang dibutuhkan untuk paginasi
  const pageCount = Math.ceil(filteredGuru.length / guruPerPage);

  // Siapkan data untuk ekspor
  const dataToExport = filteredGuru.map((g, index) => ({
    No: index + 1 + pagesVisited,
    "Nama Guru": g.nama_guru,
    NIP: g.nip,
    "Tempat Lahir": g.tempat_lahir,
    Mapel: g.mapel,
    Kelas: kelas.find((k) => k.id === g.kelasId)?.kelas,
  }));

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
        const columnWidths = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }];

        worksheet["!cols"] = columnWidths;

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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
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
          <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-base leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama Guru</th>
                  <th className="py-2 px-4 text-left">NIP</th>
                  <th className="py-2 px-4 text-left">Tempat Lahir</th>
                  <th className="py-2 px-4 text-left">Mapel</th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-base font-normal">
                {filteredGuru.length > 0 ? (
                  filteredGuru
                    .slice(pagesVisited, pagesVisited + guruPerPage)
                    .map((g, index) => (
                      <tr
                        key={g.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">{index + 1 + pagesVisited}</td>
                        <td className="py-2 px-4">{g.nama_guru}</td>
                        <td className="py-2 px-4">{g.nip}</td>
                        <td className="py-2 px-4">{g.tempat_lahir}</td>
                        <td className="py-2 px-4">{g.mapel}</td>
                        <td className="py-2 px-4">{kelas.find((k) => k.id === g.kelasId)?.kelas}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
                            <Link to={`/EditGuru/${g.id}`}>
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(g.id, g.nama_guru)}
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
                    <td colSpan="7" className="py-4 text-center text-gray-500">
                      Tidak ada data guru yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faArrowLeft}/>}
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
