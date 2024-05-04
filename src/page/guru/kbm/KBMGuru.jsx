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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllKbms, deleteKbm } from "./api_kbm";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { utils } from "xlsx";
// import { write } from "xlsx";
import * as xlsx from "xlsx";

function KBMGuru() {
  const [kbmGuru, setKbmGuru] = useState([]);
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

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
  }, []);

  // Ambil data Guru dari API
  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const response = await axios.get("http://localhost:4001/guru/all");
        setGuru(response.data);
      } catch (error) {
        console.error("Failed to fetch Guru: ", error);
      }
    };
    fetchGuru();
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
    const namaGuru = guru.find((g) => g.id === kbm.namaId)?.nama_guru;
    const kelasNama = kelas.find((k) => k.id === kbm.kelasId)?.kelas;
    return (
      (namaGuru && namaGuru.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelasNama &&
        kelasNama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kbm.materi &&
        kbm.materi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kbm.keterangan &&
        kbm.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const pageCount = Math.ceil(filteredKBMGuru.length / itemsPerPage);
  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const dataToExport = filteredKBMGuru.map((kbm) => ({
    "nama guru": guru.find((g) => g.id === kbm.namaId)?.nama_guru,
    Kelas: kelas.find((k) => k.id === kbm.kelasId)?.kelas || "",
    "jam masuk": kbm.jam_masuk,
    "jam pulang": kbm.jam_pulang,
    materi: kbm.materi,
    keterangan: kbm.keterangan,
  }));

  // const headers = [
  //   { label: "NAMA GURU", key: "Nama Guru" },
  //   { label: "KELAS", key: "Kelas" },
  //   { label: "JAM MASUK", key: "jam masuk" },
  //   { label: "JAM PULANG", key: "jam pulang" },
  //   { label: "MATERI", key: "Materi" },
  //   { label: "KETERANGAN", key: "Keterangan" },
  // ];

  const exportToXlsx = () => {
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data kbm guru yang diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mengexport data kbm guru?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(dataToExport);

        const colWidths = [
          { wch: 20 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 15 },
          { wch: 30 },
        ];

        worksheet["!cols"] = colWidths;

        xlsx.utils.book_append_sheet(workbook, worksheet, "Data KBM Guru");
        const xlsxBuffer = xlsx.write(workbook, {
          bookType: "xlsx",
          type: "buffer",
        });
        const blob = new Blob([xlsxBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data_kbm_guru.xlsx";
        link.click();
        URL.revokeObjectURL(url);

        Swal.fire({
          title: "Berhasil",
          text: "Data kbm guru berhasil diekspor",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <SidebarGuru />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800">KBM Guru</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari KBM"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex">
              <Link to={`/tambahkbm`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah KBM
                </button>
              </Link>
              <button
                onClick={exportToXlsx}
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export KBM
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama Guru</th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left">Jam Masuk</th>
                  <th className="py-2 px-4 text-left">Jam Selesai</th>
                  <th className="py-2 px-4 text-left">Materi</th>
                  <th className="py-2 px-4 text-left">Keterangan</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKBMGuru.length > 0 ? (
                  filteredKBMGuru
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
                    .map((kbm, index) => (
                      <tr
                        key={kbm.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">
                          {currentPage * itemsPerPage + index + 1}
                        </td>
                        <td className="py-2 px-4">
                          {guru.find((g) => g.id === kbm.namaId)?.nama_guru}
                        </td>
                        <td className="py-2 px-4">
                          {kelas.find((k) => k.id === kbm.kelasId)?.kelas}
                        </td>
                        <td className="py-2 px-4">{kbm.jam_masuk}</td>
                        <td className="py-2 px-4">{kbm.jam_pulang}</td>
                        <td className="py-2 px-4">{kbm.materi}</td>
                        <td className="py-2 px-4" style={{ maxWidth: "200px" }}>
                          {kbm.keterangan ? (
                            <span>{kbm.keterangan}</span>
                          ) : (
                            <span className="text-gray-400 italic">
                              Keterangan belum ditambahkan
                            </span>
                          )}{" "}
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
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
                    ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-2 px-4">
                      Tidak ada data kbm yang ditemukan
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
