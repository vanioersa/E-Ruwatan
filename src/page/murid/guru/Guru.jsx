import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Guru = () => {
  const [guru, setGuru] = useState([]); // Initialize with data from an API or other source
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const guruPerPage = 10;
  const pagesVisited = pageNumber * guruPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredGuru = guru.filter((guru) => {
    // Filter by search term in all specified properties
    const search = searchTerm.toLowerCase();
    return (
      guru.nama_guru.toLowerCase().includes(search) ||
      guru.nip.toLowerCase().includes(search) ||
      guru.tempat_lahir.toLowerCase().includes(search) ||
      guru.mapel.toLowerCase().includes(search) ||
      guru.kelas.toLowerCase().includes(search)
    );
  });

  // Calculate the total number of pages
  const pageCount = Math.ceil(filteredGuru.length / guruPerPage);

  // Slice the filtered list to only include items for the current page
  const displayGuru = filteredGuru.slice(
    pagesVisited,
    pagesVisited + guruPerPage
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="table-guru my-20 border border-gray-200 bg-white p-5 rounded-xl shadow-lg">
          <div className="bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center">
            <h1 className="judul text-3xl text-white font-semibold ">
              Data Guru
            </h1>
            <div className="flex items-center -space-x-4 hover:space-x-1">
              <Link to={``}>
                <button className="rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="h-4 w-5 text-blue-500"
                  />
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    No
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Nama Guru
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    NIP
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Tempat Lahir
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Mapel
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayGuru.map((guru, index) => (
                  <tr
                    key={guru.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">{pagesVisited + index + 1}</td>
                    <td className="px-4 py-2">{guru.nama_guru}</td>
                    <td className="px-4 py-2">{guru.nip}</td>
                    <td className="px-4 py-2">{guru.tempat_lahir}</td>
                    <td className="px-4 py-2">{guru.mapel}</td>
                    <td className="px-4 py-2">{guru.kelas}</td>
                    <td className="px-4 py-2">
                      {/* Add actions like edit, delete, etc. */}
                      <button className="text-blue-500">Edit</button>
                      <button className="ml-2 text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
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
};

export default Guru;
