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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllSiswa, deleteSiswa } from "./api_siswa";
import ReactPaginate from "react-paginate";
import axios from "axios";
import * as xlsx from "xlsx";

function Siswa() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const siswaPerPage = 10;
  const pagesVisited = pageNumber * siswaPerPage;

  // Ambil data siswa dari API
  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const data = await getAllSiswa();
        setSiswa(data.reverse());
      } catch (error) {
        console.error("Failed to fetch Siswa: ", error);
      }
    };
    fetchSiswa();
  }, []);

  // Ambil data kelas dari API
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kelas/all");
        setKelas(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  // Fungsi untuk menghapus siswa
  const handleDelete = async (id, namaSiswa) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data siswa ${namaSiswa}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSiswa(id);
          setSiswa((prevSiswa) => prevSiswa.filter((s) => s.id !== id));
          Swal.fire({
            title: "Berhasil",
            text: `Data siswa ${namaSiswa} berhasil dihapus`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Gagal menghapus siswa: ", error);
          Swal.fire("Gagal", `Gagal menghapus siswa ${namaSiswa}`, "error");
        }
      }
    });
  };

  // Filter data berdasarkan term pencarian
  const filteredSiswa = siswa.filter((s) => {
    const kelass = kelas.find((k) => k.id === s.kelasId)?.kelas;
    const namaKelas = kelas.find((k) => k.id === s.kelasId)?.nama_kelas;
    return (
      (s.nama_siswa &&
        s.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.nisn && s.nisn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.tempat && s.tempat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.alamat && s.alamat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelass &&
        namaKelas &&
        `${kelass} - ${namaKelas}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
    );
  });

  // Siapkan data untuk ekspor
  const dataToExport = filteredSiswa.map((s) => ({
    "Nama Siswa": s.nama_siswa,
    NISN: s.nisn,
    "Tempat Lahir": s.tempat,
    Kelas: kelas.find((k) => k.id === s.kelasId)?.kelas || "",
    Alamat: s.alamat,
  }));

  const exportToXlsx = () => {
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "Gagal",
        text: "Tidak ada data siswa yang diekspor",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi",
      text: "Anda yakin ingin mengexport data siswa?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(dataToExport);

        const colWidths = [
          { wch: 15 },
          { wch: 10 },
          { wch: 15 },
          { wch: 10 },
          { wch: 20 },
        ];

        worksheet["!cols"] = colWidths;

        xlsx.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
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
        link.download = "data_siswa.xlsx";
        link.click();
        URL.revokeObjectURL(url);

        Swal.fire({
          title: "Berhasil",
          text: "Data siswa berhasil diekspor",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  // Fungsi untuk mengganti halaman
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Jumlah halaman yang dibutuhkan untuk paginasi
  const pageCount = Math.ceil(filteredSiswa.length / siswaPerPage);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800">Data Siswa</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari Siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex">
              <Link to="/TambahSiswa">
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-1 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah Siswa
                </button>
              </Link>
              <button
                onClick={exportToXlsx}
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export Siswa
              </button>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-base leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Nama Siswa
                  </th>
                  <th className="py-2 px-4 text-left">NISN</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Tempat Lahir
                  </th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left">Alamat</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-base font-normal">
                {filteredSiswa.length > 0 ? (
                  filteredSiswa
                    .slice(pagesVisited, pagesVisited + siswaPerPage)
                    .map((s, index) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">
                          {index + 1 + pagesVisited}
                        </td>
                        <td className="py-2 px-4">{s.nama_siswa}</td>
                        <td className="py-2 px-4">{s.nisn}</td>
                        <td className="py-2 px-4">{s.tempat}</td>
                        <td className="py-2 px-4">
                          {kelas.find((k) => k.id === s.kelasId)?.kelas} -{" "}
                          {kelas.find((k) => k.id === s.kelasId)?.nama_kelas}
                        </td>
                        <td className="py-2 px-4">{s.alamat}</td>
                        <td className="py-2 px-4">
                          <div className="flex justify-center gap-2">
                            <Link to={`/EditSiswa/${s.id}`}>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(s.id, s.nama_siswa)}
                              className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Tidak ada data siswa yang ditemukan
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

export default Siswa;
