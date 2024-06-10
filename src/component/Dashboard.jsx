import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Dashboard() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setkelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [username, setUsername] = useState("");
  const [hoverStates, setHoverStates] = useState([false, false, false]);

  const handleMouseEnter = (index) => {
    const updatedHoverStates = [...hoverStates];
    updatedHoverStates[index] = true;
    setHoverStates(updatedHoverStates);
  };

  const handleMouseLeave = (index) => {
    const updatedHoverStates = [...hoverStates];
    updatedHoverStates[index] = false;
    setHoverStates(updatedHoverStates);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await axios.get("http://localhost:4001/siswa/all");
        setSiswa(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch siswa: ", error);
      }
    };
    fetchSiswa();
  }, []);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kelas/all");
        setkelas(response.data);
      } catch (error) {
        console.error("Failed to fetch kelas: ", error);
      }
    };
    fetchKelas();
  }, []);

  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const response = await axios.get("http://localhost:4001/users");
        const filteredGuru = response.data.filter(
          (item) => item.role === "GURU"
        );
        setGuru(filteredGuru.reverse());
      } catch (error) {
        console.error("Failed to fetch guru: ", error);
      }
    };
    fetchGuru();
  }, []);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
      <section className="text-gray-800 body-font flex-1 mt-20">
        {username && (
          <div className="py-4 px-6">
            <h1
              className="text-gray-800 text-center relative text-lg p-3 bg-gray-100"
              style={{
                boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                borderRadius: "10px",
              }}
            >
              Hai, <strong>{username}</strong>!{" "}
              <span style={{ boxShadow: "none" }}>
                Selamat datang di dashboard Admin.
              </span>
            </h1>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center">
            {/* Kartu pertama */}
            <div className="mb-4 px-3 flex-shrink-0 w-full sm:w-1/2 md:w-1/3">
              <div className="shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-cyan-600 to-cyan-400 md:mt-16 md:my-12">
                <div className="px-6 py-6 flex items-center justify-between">
                  <svg
                    className="w-14 h-14 mr-4 text-white"
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                    ></path>
                  </svg>
                  <div>
                    <h2 className="text-4xl text-center font-medium text-white">
                      {guru.length}
                    </h2>
                    <p className="text-lg text-white">Guru</p>
                  </div>
                </div>
                <hr className="border-white" />
                <div className="py-2 text-center font-medium">
                  <a
                    style={{ cursor: "default" }}
                    href="/guru"
                    onMouseEnter={() => handleMouseEnter(0)}
                    onMouseLeave={() => handleMouseLeave(0)}
                    className={`text-white ${
                      hoverStates[0] ? "hover:text-cyan-800" : ""
                    }`}
                  >
                    Klik di sini{" "}
                    <FontAwesomeIcon
                      icon={hoverStates[0] ? faRightLong : faCircleArrowRight}
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Kartu kedua */}
            <div className="mb-4 px-3 flex-shrink-0 w-full sm:w-1/2 md:w-1/3">
              <div className="shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-400 md:mt-16 md:my-12">
                <div className="px-6 py-6 flex items-center justify-between">
                  <svg
                    className="w-12 h-12 mr-4 text-white"
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    ></path>
                  </svg>
                  <div>
                    <h2 className="text-4xl text-center font-medium text-white">
                      {siswa.length}
                    </h2>
                    <p className="text-lg text-white">Siswa</p>
                  </div>
                </div>
                <hr className="border-white" />
                <div className="py-2 text-center font-medium">
                  <a
                    style={{ cursor: "default" }}
                    href="/siswa"
                    onMouseEnter={() => handleMouseEnter(1)}
                    onMouseLeave={() => handleMouseLeave(1)}
                    className={`text-white ${
                      hoverStates[1] ? "hover:text-cyan-800" : ""
                    }`}
                  >
                    Klik di sini{" "}
                    <FontAwesomeIcon
                      icon={hoverStates[1] ? faRightLong : faCircleArrowRight}
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Kartu ketiga */}
            <div className="mb-4 px-3 flex-shrink-0 w-full sm:w-1/2 md:w-1/3">
              <div
                className={`shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-amber-600 to-amber-400 md:mt-16 md:my-12`}
              >
                <div className="px-6 py-6 flex items-center justify-between">
                  <svg
                    className="w-12 h-12 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M10.385 21.788a.997.997 0 0 0 .857.182l8-2A.999.999 0 0 0 20 19V5a1 1 0 0 0-.758-.97l-8-2A1.003 1.003 0 0 0 10 3v1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4v1c0 .308.142.599.385.788zM12 4.281l6 1.5v12.438l-6 1.5V4.281zM7 18V6h3v12H7z"></path>
                    <path d="M14.242 13.159c.446-.112.758-.512.758-.971v-.377a1 1 0 1 0-2 .001v.377a1 1 0 0 0 1.242.97z"></path>
                  </svg>
                  <div>
                    <h2 className="text-4xl text-center font-medium text-white">
                      {kelas.length}
                    </h2>
                    <p className="text-lg text-white">Kelas</p>
                  </div>
                </div>
                <hr className="border-white" />
                <div className="py-2 text-center font-medium">
                  <a
                    style={{ cursor: "default" }}
                    href="/kelas"
                    onMouseEnter={() => handleMouseEnter(2)}
                    onMouseLeave={() => handleMouseLeave(2)}
                    className={`text-white ${
                      hoverStates[2] ? "hover:text-cyan-800" : ""
                    }`}
                  >
                    Klik di sini{" "}
                    <FontAwesomeIcon
                      icon={hoverStates[2] ? faRightLong : faCircleArrowRight}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-8 justify-center">
            {/* Tabel Guru */}
            <div className="w-full md:w-1/2 mb-10 overflow-x-auto">
              <div className="py-2 mb-2">
                <h1
                  className="text-gray-800 relative py-2 px-5 bg-gray-100 text-lg font-bold"
                  style={{
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    borderRadius: "8px",
                  }}
                >
                  Tabel Guru
                </h1>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
                <table className="w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm">
                      <th className="py-2 px-4 text-left">No.</th>
                      <th className="py-2 px-4 text-center">Nama Guru</th>
                      <th className="py-2 px-4 text-center">Email</th>
                      <th className="py-2 px-4 text-center">Nomor Telepon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guru.length > 0 ? (
                      guru.slice(0, 5).map((item, index) => (
                        <tr
                          style={{ backgroundColor: "white" }}
                          key={item.id}
                          className="bg-white border-b hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 text-center">
                            {item.username}
                          </td>
                          <td className="py-2 px-4 text-center">
                            {item.email}
                          </td>
                          <td className="py-2 px-4 text-center">
                            {item.telepon.startsWith("08")
                              ? "+62" +
                                " " +
                                item.telepon.slice(1, item.telepon.length - 4) +
                                "****"
                              : item.telepon}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ backgroundColor: "white" }}>
                        <td
                          colSpan="4"
                          className="py-4 text-center text-gray-500"
                        >
                          Maaf, data guru tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel Siswa */}
            <div className="w-full md:w-1/2 mb-10 overflow-x-auto">
              <div className="py-2 mb-2">
                <h1
                  className="text-gray-800 relative py-2 px-5 bg-gray-100 text-lg font-bold"
                  style={{
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    borderRadius: "8px",
                  }}
                >
                  Tabel Siswa
                </h1>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
                <table className="w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm">
                      <th className="py-2 px-4 text-left">No.</th>
                      <th className="py-2 px-4 text-center">Nama Siswa</th>
                      <th className="py-2 px-4 text-center">NISN</th>
                      <th className="py-2 px-4 text-center">Tempat Lahir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siswa.length > 0 ? (
                      siswa.slice(0, 5).map((item, index) => (
                        <tr
                          key={item.id}
                          style={{ backgroundColor: "white" }}
                          className="bg-white border-b hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 text-center">
                            {item.nama_siswa}
                          </td>
                          <td className="py-2 px-4 text-center">{item.nisn}</td>
                          <td className="py-2 px-4 text-center">
                            {item.tempat}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ backgroundColor: "white" }}>
                        <td
                          colSpan="4"
                          className="py-4 text-center text-gray-500"
                        >
                          Maaf, data siswa tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-5" />
      </section>
      <style>{`
        @media (max-width: 768px) {
          .bg-gray-100 {
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
