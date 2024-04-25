import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllGurus, deleteGuru } from "./api_guru";
import ReactPaginate from "react-paginate";
import axios from "axios";

function Guru() {
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const guruPerPage = 10;
  const pagesVisited = pageNumber * guruPerPage;

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
      text: "Data guru akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGuru(id);
          const updatedGuru = guru.filter((guru) => guru.id !== id);
          setGuru(updatedGuru);
          Swal.fire({
            title: "Berhasil",
            text: "Guru berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Guru: ", error);
          let errorMessage = "Gagal menghapus guru. Silakan coba lagi.";
          Swal.fire("Gagal", errorMessage, "error");
        }
      }
    });
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredGuru = guru.filter((guru) => {
    const kelasNama =
      guru.kelasId && kelas.find((k) => k.id === guru.kelasId)?.kelas;
    return (
      guru.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guru.nip &&
        guru.nip.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      guru.tempat_lahir.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (kelasNama && kelasNama.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  const pageCount = Math.ceil(filteredGuru.length / guruPerPage);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="tabel-guru my-20 border border-gray-200 bg-white p-5 rounded-xl shadow-lg">
          <div className="bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center">
            <h1 className="judul text-3xl text-white font-semibold">
              Data Guru
            </h1>
            <div className="flex items-center ml-auto">
              <input
                type="text"
                placeholder="Cari guru..."
                className="rounded-lg shadow-xl px-3 py-3 bg-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to={`/TambahGuru`}>
              <button className="ml-2 rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="h-5 w-5 text-blue-500"
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
                    Nama Guru
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    NIP
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Tempat Lahir
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Mapel
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGuru.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Data guru tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredGuru
                    .slice(pagesVisited, pagesVisited + guruPerPage)
                    .map((guru, index) => (
                      <tr
                        key={guru.id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="px-4 py-2">{`${
                          index + 1 + pageNumber * guruPerPage
                        }.`}</td>
                        <td className="px-4 py-2 text-center">
                          {guru.nama_guru}
                        </td>
                        <td className="px-4 py-2 text-center">{guru.nip}</td>
                        <td className="px-4 py-2 text-center">
                          {guru.tempat_lahir}
                        </td>
                        <td className="px-4 py-2 text-center">{guru.mapel}</td>
                        <td className="px-4 py-2 text-center">
                          {guru.kelasId &&
                            `${
                              kelas.find((kelas) => kelas.id === guru.kelasId)
                                ?.kelas
                            }`}
                        </td>
                        <td className="px-4 py-2 text-center flex justify-center gap-2">
                          <Link to={`/update-guru/${guru.id}`}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white border border-blue-500 hover:border-blue-700 rounded-md px-3 py-1 mx-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(guru.id)}
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

export default Guru;
