import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faFileExport, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllKelas, deleteKelas } from "./api_kelas";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";

function Kelas() {
  const [kelas, setKelas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const kelasPerPage = 10;
  const pagesVisited = pageNumber * kelasPerPage;

  // Fetch data for Kelas from the API
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const data = await getAllKelas();
        setKelas(data);
      } catch (error) {
        console.error("Failed to fetch Kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  // Function to delete a Kelas
  const handleDelete = async (id, kelasName) => {
    Swal.fire({
      title: "Konfirmasi",
      text: `Anda yakin ingin menghapus data kelas ${kelasName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteKelas(id);
          setKelas((prevKelas) => prevKelas.filter((k) => k.id !== id));
          Swal.fire("Berhasil", `Data kelas ${kelasName} berhasil dihapus`, "success");
        } catch (error) {
          console.error("Failed to delete Kelas: ", error);
          Swal.fire("Gagal", `Gagal menghapus kelas ${kelasName}`, "error");
        }
      }
    });
  };

  // Function to handle page change
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // Filter data based on the search term
  const filteredKelas = kelas.filter((k) => {
    return (
      k.nama_kelas && k.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate the number of pages needed for pagination
  const pageCount = Math.ceil(filteredKelas.length / kelasPerPage);

  // Prepare data for export
  const dataToExport = filteredKelas.map((k, index) => ({
    No: index + 1 + pagesVisited,
    "Nama Kelas": k.nama_kelas,
    Kelas: k.kelas,
  }));

  // Prepare headers for the CSV file
  const headers = [
    { label: "NO", key: "No" },
    { label: "NAMA KELAS", key: "Nama Kelas" },
    { label: "KELAS", key: "Kelas" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800">Data Kelas</h1>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Cari kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <div className="flex">
              <Link to="/TambahKelas">
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FontAwesomeIcon icon={faPlus} /> Tambah Kelas
                </button>
              </Link>
              <CSVLink
                data={dataToExport}
                headers={headers}
                filename="data_kelas.csv"
                className="bg-green-500 hover:bg-green-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <FontAwesomeIcon icon={faFileExport} /> Export Kelas
              </CSVLink>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Nama Kelas</th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredKelas.length > 0 ? (
                  filteredKelas
                    .slice(pagesVisited, pagesVisited + kelasPerPage)
                    .map((k, index) => (
                      <tr
                        key={k.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">{index + 1 + pagesVisited}</td>
                        <td className="py-2 px-4">{k.nama_kelas}</td>
                        <td className="py-2 px-4">{k.kelas}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
                            <Link to={`/EditKelas/${k.id}`}>
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(k.id, k.nama_kelas)}
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
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      Tidak ada data kelas yang ditemukan.
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

export default Kelas;
