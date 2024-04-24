import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { getAllKelas, deleteKelas } from "./api_kelas";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

const Kelas = () => {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const kelasPerPage = 10;
  const pagesVisited = pageNumber * kelasPerPage;

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        let data = await getAllKelas();
        data = data.sort((a, b) => b.id - a.id);
        setKelas(data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data kelas akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKelas(id);
          const updatedKelas = kelas.filter((kelas) => kelas.id !== id);
          setKelas(updatedKelas);
          Swal.fire({
            title: "Berhasil",
            text: "Kelas berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Kelas: ", error);
          let errorMessage = "Gagal menghapus kelas. Silakan coba lagi.";
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

  const filteredKelas = kelas.filter((kelas) => {
  return (
    String(kelas.kelas).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(kelas.nama_kelas).toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  const pageCount = Math.ceil(filteredKelas.length / kelasPerPage);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="tabel-siswa mt-12 bg-white p-5 rounded-xl shadow-lg">
          <div className="bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center">
            <h1 className="judul text-3xl text-white font-semibold ">
              Data Kelas
            </h1>
            <div className="flex items-center -space-x-4 hover:space-x-1">
              <input
                type="text"
                placeholder="Cari kelas..."
                className="rounded-lg shadow-xl px-3 py-3 bg-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Link to={``}>
                <button className="rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="h-5 w-5 text-blue-500"
                  />
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-s">
              <thead className="text-left">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    No
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Nama Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredKelas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Data kelas tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredKelas
                    .slice(pagesVisited, pagesVisited + kelasPerPage)
                    .map((kelas, index) => (
                      <tr key={kelas.id}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{kelas.kelas}</td>
                        <td className="px-4 py-2">{kelas.nama_kelas}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDelete(kelas.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <Link to={`/update-kelas/${kelas.id}`}>
                            <button className="text-blue-500 hover:text-blue-700 ml-2">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
      </div>
    </div>
  );
};

export default Kelas;
