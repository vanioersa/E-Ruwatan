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
import { deletePenilaian } from "./api_penilaian";

function Penilaian() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dataPerPage] = useState(10);

  const pageCount = Math.ceil(data.length / dataPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4001/penilaian");
      console.log("Fetched data: ", response.data); // Debugging step
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  const filteredData = data.filter((item) => {
    return (
      item.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nilai.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleUpdate = (id) => {
    // Navigate to the edit page
    window.location.href = `/EditPenilaian/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      // Call the delete function from your services/api
      await deletePenilaian(id);
      // Refresh the list or remove the item from the state
      setData(data.filter(item => item.id !== id));
      console.log("Penilaian berhasil dihapus!!");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

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
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Nama Siswa
                  </th>
                  <th className="py-2 px-4 text-left">Kelas</th>
                  <th className="py-2 px-4 text-left whitespace-nowrap">
                    Nilai Siswa
                  </th>
                  <th className="py-2 px-4 text-left">Deskripsi</th>
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
                        <td className="py-2 px-4">
                          {index + 1 + currentPage * dataPerPage}
                        </td>
                        <td className="py-2 px-4">{item.namaSiswa}</td>
                        <td className="py-2 px-4">{item.kelas}</td>
                        <td className="py-2 px-4">{item.nilai}</td>
                        <td className="py-2 px-4">
                          {item.deskripsi !== "" ? (
                            item.deskripsi
                          ) : (
                            <span className="italic">Deskripsi Kosong</span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded focus:outline-none focus:ring"
                            onClick={() => handleUpdate(item.id)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded focus:outline-none focus:ring"
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
                      No data found
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

export default Penilaian;