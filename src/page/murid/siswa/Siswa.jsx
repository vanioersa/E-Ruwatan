import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllSiswa, deleteSiswa } from "./api_siswa";
import axios from "axios";
import ReactPaginate from "react-paginate";

function Siswa() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const siswaPerPage = 10;
  const pagesVisited = pageNumber * siswaPerPage;

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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data siswa akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSiswa(id);
          const updatedSiswa = siswa.filter((siswa) => siswa.id !== id);
          setSiswa(updatedSiswa);
          Swal.fire({
            title: "Berhasil",
            text: "Siswa berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Siswa: ", error);
          let errorMessage = "Gagal menghapus siswa. Silakan coba lagi.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errorMessage = error.response.data.message;
          }
          Swal.fire("Gagal", errorMessage, "error");
        }
      }
    });
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredSiswa = siswa.filter((siswa) => {
    const kelasNama =
    siswa.kelasId && kelas.find((k) => k.id === siswa.kelasId)?.nama;
    return (
      siswa.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (siswa.nisn &&
        siswa.nisn
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (kelasNama &&
        kelasNama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (siswa.tempat &&
        siswa.tempat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (siswa.alamat &&
        siswa.alamat.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const pageCount = Math.ceil(filteredSiswa.length / siswaPerPage);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="tabel-siswa my-20 border border-gray-200 bg-white p-5 rounded-xl shadow-lg">
          <div className="bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center">
            <h1 className="judul text-3xl text-white font-semibold ">
              Data Siswa
            </h1>
            <div className="flex items-center ml-auto">
              <input
                type="text"
                placeholder="Cari siswa..."
                className="rounded-lg shadow-xl px-3 py-3 bg-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to={`/Tambahsiswa`}>
              <button className="ml-2 rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="h-4 w-5 mt-1 text-blue-500"
                />
              </button>
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-s">
              <thead className="text-left">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    No
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Nama Siswa
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    NISN
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Tempat Lahir
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Alamat
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Data siswa tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredSiswa
                    .slice(pagesVisited, pagesVisited + siswaPerPage)
                    .map((siswa, index) => (
                      <tr key={siswa.id}>
                        <td className="px-4 py-2">{`${
                          index + 1 + pageNumber * siswaPerPage
                        }.`}</td>
                        <td className="px-4 py-2 text-center">{siswa.nama_siswa}</td>
                        <td className="px-4 py-2 text-center">{siswa.nisn}</td>
                        <td className="px-4 py-2 text-center">
                          {siswa.kelasId &&
                            `${
                              kelas.find((kelas) => kelas.id === siswa.kelasId)
                                ?.kelas
                            }`}
                        </td>
                        <td className="px-4 py-2 text-center">{siswa.tempat}</td>
                        <td className="px-4 py-2 text-center">{siswa.alamat}</td>
                        <td className="px-4 py-2 text-center flex justify-center gap-2">
                          <Link to={`/update-siswa/${siswa.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white border border-blue-500 hover:border-blue-700 rounded-md px-3 py-1 mx-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(siswa.id)}
                            className="bg-rose-500 hover:bg-rose-700 text-white border border-red-500 hover:border-red-700 rounded-md px-3 py-1"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination flex justify-center mt-4"}
            pageClassName={"page-item mx-1 flex"}
            pageLinkClassName={
              "page-link py-2 px-3 border border rounded-md hover:bg-blue-500 hover:text-white"
            }
            previousClassName={"prev-item"}
            previousLinkClassName={
              "prev-link py-2 px-3 flex border border-gray-200 rounded-md mr-2 bg-blue-600 hover:bg-blue-800 hover:text-white"
            }
            nextClassName={"next-item"}
            nextLinkClassName={
              "next-link py-2 px-3 flex border border-gray-200 rounded-md ml-2 bg-blue-600 hover:bg-blue-800 hover:text-white"
            }
            activeClassName={"active-page bg-blue-500 text-white rounded-lg"}
          />
        </div>
      </div>
    </div>
  );
}

export default Siswa;
