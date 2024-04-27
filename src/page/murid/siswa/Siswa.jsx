import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faFileExport, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllSiswa, deleteSiswa } from "./api_siswa";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { CSVLink } from "react-csv";

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
        setSiswa(data);
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
        setKelas(response.data);
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
          Swal.fire("Berhasil", `Data siswa ${namaSiswa} berhasil dihapus`, "success");
        } catch (error) {
          console.error("Gagal menghapus siswa: ", error);
          Swal.fire("Gagal", `Gagal menghapus siswa ${namaSiswa}`, "error");
        }
      }
    });
  };

  // Fungsi untuk mengganti halaman
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Filter data berdasarkan term pencarian
  const filteredSiswa = siswa.filter((s) => {
    const kelasNama = kelas.find((k) => k.id === s.kelasId)?.kelas;
    return (
      (s.nama_siswa && s.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.nisn && s.nisn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.tempat && s.tempat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelasNama && kelasNama.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Jumlah halaman yang dibutuhkan untuk paginasi
  const pageCount = Math.ceil(filteredSiswa.length / siswaPerPage);

  // Siapkan data untuk ekspor
  const dataToExport = filteredSiswa.map((s, index) => ({
    No: index + 1 + pagesVisited,
    "Nama Siswa": s.nama_siswa,
    NISN: s.nisn,
    "Tempat Lahir": s.tempat,
    Kelas: kelas.find((k) => k.id === s.kelasId)?.kelas || "",
    Alamat: s.alamat,
  }));

  // Siapkan header untuk file CSV
  const headers = [
    { label: "NO", key: "No" },
    { label: "NAMA SISWA", key: "Nama Siswa" },
    { label: "NISN", key: "NISN" },
    { label: "TEMPAT LAHIR", key: "Tempat Lahir" },
    { label: "KELAS", key: "Kelas" },
    { label: "ALAMAT", key: "Alamat" },
  ];

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
              placeholder="Cari siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex">
              <Link to="/TambahSiswa">
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah Siswa
                </button>
              </Link>
              <CSVLink
                data={dataToExport}
                headers={headers}
                filename="data_siswa.csv"
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export Siswa
              </CSVLink>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama Siswa</th>
                  <th className="py-2 px-4 text-left">NISN</th>
                  <th className="py-2 px-4 text-left">Tempat Lahir</th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left">Alamat</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredSiswa.length > 0 ? (
                  filteredSiswa
                    .slice(pagesVisited, pagesVisited + siswaPerPage)
                    .map((s, index) => (
                      <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out">
                        <td className="py-2 px-4">{index + 1 + pagesVisited}</td>
                        <td className="py-2 px-4">{s.nama_siswa}</td>
                        <td className="py-2 px-4">{s.nisn}</td>
                        <td className="py-2 px-4">{s.tempat}</td>
                        <td className="py-2 px-4">{kelas.find((k) => k.id === s.kelasId)?.kelas}</td>
                        <td className="py-2 px-4">{s.alamat}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
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
                      Data siswa tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <ReactPaginate
              previousLabel={<FontAwesomeIcon icon={faArrowLeft}/>}
              nextLabel={<FontAwesomeIcon icon={faArrowRight}/>}
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
