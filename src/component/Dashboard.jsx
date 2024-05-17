import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faDoorOpen,
  faUserGroup,
  faCircleArrowRight,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Dashboard() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setkelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [username, setUsername] = useState("");
  const [hoverStates, setHoverStates] = useState([false, false, false]); // Array to track hover state for each card

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
    // Simulate fetching the username from localStorage
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
          <div className="bg-white py-4 px-6">
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
                  <FontAwesomeIcon
                    icon={faChalkboardTeacher}
                    className="w-12 h-12 text-white mr-4"
                  />
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
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    className="inline-block w-12 h-12 text-white mr-4"
                  />
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
                  <FontAwesomeIcon
                    icon={faDoorOpen}
                    className="inline-block w-12 h-12 text-white mr-4"
                  />
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
            <div className="w-full md:w-1/2 mb-5 overflow-x-auto">
              <div className="bg-white py-2 mb-2">
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
                    </tr>
                  </thead>
                  <tbody>
                    {guru.length > 0 ? (
                      guru.slice(0, 5).map((item, index) => (
                        <tr
                          key={item.id}
                          className="bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 text-center">
                            {item.username}
                          </td>
                          <td className="py-2 px-4 text-center">
                            {item.email}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
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
            <div className="w-full md:w-1/2 mb-5 overflow-x-auto">
              <div className="bg-white py-2 mb-2">
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
                          className="bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 text-center">{item.nama_siswa}</td>
                          <td className="py-2 px-4 text-center">{item.nisn}</td>
                          <td className="py-2 px-4 text-center">{item.tempat}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
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
