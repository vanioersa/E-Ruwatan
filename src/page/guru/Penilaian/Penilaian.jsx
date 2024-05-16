import React, { useState, useEffect } from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faArrowRight,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { deletePenilaian, getAllPenilaian } from "./api_penilaian";

function Penilaian() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dataPerPage] = useState(10);
  const [kelas, setKelas] = useState([]);
  const [Siswa, setSiswa] = useState([]);

  const pageCount = Math.ceil(data.length / dataPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllPenilaian();
      setData(response); // response is the data already
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

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

  useEffect(() => {
    const fetchsiswa = async () => {
      try {
        const response = await axios.get("http://localhost:4001/siswa/all");
        setSiswa(response.data);
      } catch (error) {
        console.error("Failed to fetch Siswa: ", error);
      }
    };
    fetchsiswa();
  }, []);

  const handleUpdate = (id) => {
    window.location.href = `/EditPenilaian/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      await deletePenilaian(id);
      setData(data.filter((item) => item.id !== id));
      console.log("Penilaian berhasil dihapus!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredData = data.filter((item) => {
    const namaSiswa = Siswa.find((s) => s.id === item.siswaId)?.nama_siswa;
    const kelass = kelas.find((k) => k.id === item.kelasId)?.kelas;
    const namaKelas = kelas.find((k) => k.id === item.kelasId)?.nama_kelas;
    return (
      (namaSiswa && namaSiswa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (kelass &&
        namaKelas &&
        `${kelass} - ${namaKelas}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (item.nilai &&
        item.nilai.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.deskripsi &&
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filter data based on search term
  // const filteredData = data.filter((item) => {
  //   const siswaNama =
  //     Siswa.find((s) => s.id === item.siswaId)?.nama_siswa?.toLowerCase() || "";
  //   const kelasNama =
  //     kelas.find((k) => k.id === item.kelasId)?.kelas?.toLowerCase() || "";
  //   const namaKelas =
  //     kelas.find((k) => k.id === item.kelasId)?.nama_kelas?.toLowerCase() || "";
  //   const nilai =
  //     typeof item.nilai === "number" ? item.nilai.toString().toLowerCase() : "";
  //   const deskripsi = item.deskripsi?.toLowerCase() || "";

  //   return (
  //     siswaNama.includes(searchTerm.toLowerCase()) ||
  //     kelasNama.includes(searchTerm.toLowerCase()) ||
  //     namaKelas.includes(searchTerm.toLowerCase()) ||
  //     nilai.includes(searchTerm.toLowerCase()) ||
  //     deskripsi.includes(searchTerm.toLowerCase())
  //   );
  // });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <SidebarGuru />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Penilaian Guru
          </h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari Penilaian"
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link to="/TambahPenilaian">
              <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 mt-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <FontAwesomeIcon icon={faPlus} /> Tambah Penilaian
              </button>
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-center">No</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Nama Siswa
                  </th>
                  <th className="py-2 px-4 text-center">Kelas</th>
                  <th className="py-2 px-4 text-center whitespace-nowrap">
                    Nilai Siswa
                  </th>
                  <th className="py-2 px-4 text-center">Deskripsi</th>
                  <th className="py-2 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(
                      currentPage * dataPerPage,
                      (currentPage + 1) * dataPerPage
                    )
                    .map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 text-center">
                          {index + 1 + currentPage * dataPerPage}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {Siswa.find((s) => s.id === item.siswaId)?.nama_siswa}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {kelas.find((k) => k.id === item.kelasId)?.kelas} -{" "}
                          {kelas.find((k) => k.id === item.kelasId)?.nama_kelas}
                        </td>
                        <td className="py-2 px-4 text-center">{item.nilai}</td>
                        <td className="py-2 px-4 text-center">
                          {item.deskripsi ? (
                            <span>{item.deskripsi}</span>
                          ) : (
                            <span className="text-gray-500 italic">
                              Deskripsi belum ditambahkan
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded inline-flex items-center focus:outline-none focus:ring"
                            onClick={() => handleUpdate(item.id)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded inline-flex items-center focus:outline-none focus:ring"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-2 px-4">
                      Tidak ada data ditemukan
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
