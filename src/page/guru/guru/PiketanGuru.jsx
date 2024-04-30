import React, { useState, useEffect } from "react";
import Axios from "axios";  // Import Axios if you choose to use it
import SidebarGuru from "../../../component/SidebarGuru";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function PiketanGuru() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get('http://localhost:4001/piketan/all'); // Change the URL to your actual API
        setData(response.data); // Assuming the response has a data property which holds the array
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error here, e.g., setting an error state
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Cari Piketan"
              className="w-full md:w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="flex">
              <Link to={`/tambahpiketan`}>
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
                {filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.kelas}</td>
                    <td>{item.tanggal}</td>
                    <td>{item.izin}</td>
                    <td>{item.sakit}</td>
                    <td>{item.alfa}</td>
                    <td>Actions here</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PiketanGuru;
