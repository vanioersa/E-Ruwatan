import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import SidebarGuru from '../../../component/SidebarGuru';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faArrowRight, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';

function PiketanGuru() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get('http://localhost:4001/kelaspiketan');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter data based on search term
    const filteredData = data.filter(item =>
        item.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.izin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.alfa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total pages
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    // Change page
    const changePage = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Get current items for the current page
    const currentItems = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="sidebar w-full md:w-64 bg-gray-100 shadow-lg">
                <SidebarGuru />
            </div>
            <div className="content-page flex-1 container p-8 overflow-y-auto">
                <div className="my-10 bg-white border border-gray-200 md:mt-20 mt-20 rounded-xl shadow-lg p-6">
                    <h1 className="text-3xl font-semibold text-gray-800">Piketan Guru</h1>
                    <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Cari Piketan..."
                            className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className="flex">
                            <Link to="/tambahpiketan">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-2 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <FontAwesomeIcon icon={faPlus} /> Tambah Piket
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
                        <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
                            <thead>
                                <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                                    <th className="py-2 px-4 text-left">No</th>
                                    <th className="py-2 px-4 text-left">Kelas</th>
                                    <th className="py-2 px-4 text-left">Tanggal</th>
                                    <th className="py-2 px-4 text-left">Izin</th>
                                    <th className="py-2 px-4 text-left">Sakit</th>
                                    <th className="py-2 px-4 text-left">Alfa</th>
                                    <th className="py-2 px-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out">
                                            <td className="py-2 px-4">{currentPage * itemsPerPage + index + 1}</td>
                                            <td className="py-2 px-4">{item.kelas}</td>
                                            <td className="py-2 px-4">{item.tanggal}</td>
                                            <td className="py-2 px-4">{item.izin}</td>
                                            <td className="py-2 px-4">{item.sakit}</td>
                                            <td className="py-2 px-4">{item.alfa}</td>
                                            <td className="py-2 px-4">
                                                {/* Placeholder for action buttons */}
                                                <div className="flex gap-2">
                                                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-2 px-4">
                                            Tidak ada data piketan yang ditemukan
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

export default PiketanGuru;
