import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarGuru from "./SidebarGuru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faUserGroup,
  faRightLong,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function DashboardGuru() {
  const [piket, setPiket] = useState([]);
  const [Penilaian, setPenilaian] = useState([]);
  const [kbm, setKbm] = useState([]);
  const [user, setUser] = useState([]);
  const [kelas, setKelas] = useState([]);
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
    const fetchPiket = async () => {
      try {
        const response = await axios.get("http://localhost:4001/piket/all");
        setPiket(response.data);
      } catch (error) {
        console.error("Failed to fetch Piket: ", error);
      }
    };
    fetchPiket();
  }, []);

  useEffect(() => {
    const fetchPenilaian = async () => {
      try {
        const response = await axios.get("http://localhost:4001/panilaian/all");
        setPenilaian(response.data);
      } catch (error) {
        console.error("Failed to fetch Penilaian: ", error);
      }
    };
    fetchPenilaian();
  }, []);

  useEffect(() => {
    const fetchKBM = async () => {
      try {
        const response = await axios.get("http://localhost:4001/kbm/all");
        setKbm(response.data);
      } catch (error) {
        console.error("Failed to fetch Kbm: ", error);
      }
    };
    fetchKBM();
  }, []);

  // Ambil data Guru dari API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4001/users");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch Guru: ", error);
      }
    };
    fetchUser();
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

  // Fungsi untuk mendapatkan nama kelas berdasarkan kelasId
  const getNamaKelas = (kelasId) => {
    const kelasInfo = kelas.find((k) => k.id === kelasId);
    if (kelasInfo) {
      return `${kelasInfo.kelas} - ${kelasInfo.nama_kelas}`;
    } else {
      return "Kelas tidak ditemukan"; // Jika kelas tidak ditemukan
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <SidebarGuru />
      <section className="text-gray-800 body-font flex-1 mt-20">
        {username && (
          <div className="bg-white py-4 px-6">
            <h1
              className="text-gray-800 text-center relative p-3 bg-gray-100"
              style={{
                boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                borderRadius: "10px",
              }}
            >
              Hai, <strong>{username}</strong>!{" "}
              <span style={{ boxShadow: "none" }}>
                Selamat datang di dashboard Guru.
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
                      {
                        kbm.filter(
                          (item) =>
                            user.find((u) => u.id === item.userId)?.username ===
                            username
                        ).length
                      }
                    </h2>
                    <p className="text-lg text-white">KBM Guru</p>
                  </div>
                </div>
                <hr className="border-white" />
                <div className="py-2 text-center font-medium">
                  <a
                    style={{ cursor: "default" }}
                    href="/kbm_guru"
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
                      {
                        piket.filter(
                          (item) =>
                            kelas.find((k) => k.id === item.kelasId)?.guruId ===
                            user.find((u) => u.username === username)?.id
                        ).length
                      }
                    </h2>
                    <p className="text-lg text-white">Piketan</p>
                  </div>
                </div>
                <hr className="border-white" />
                <div className="py-2 text-center font-medium">
                  <a
                    style={{ cursor: "default" }}
                    href="/piketan_guru"
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
                    icon={faUserGroup}
                    className="inline-block w-12 h-12 text-white mr-4"
                  />
                  <div>
                    <h2 className="text-4xl text-center font-medium text-white">
                      {Penilaian.length}
                    </h2>
                    <p className="text-lg text-white">Penilaian</p>
                  </div>
                </div>
                <hr className="border-white" />
                <div className="py-2 text-center font-medium">
                  <a
                    style={{ cursor: "default" }}
                    href="/penilaian"
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
                  Tabel KBM Guru
                </h1>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
                <table className="w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm">
                      <th className="py-2 px-4 text-left">No</th>
                      <th className="py-2 px-4 text-center">Nama Guru</th>
                      <th className="py-2 px-4 text-center">Jam Masuk</th>
                      <th className="py-2 px-4 text-center">Jam Keluar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kbm
                      .filter(
                        (item) =>
                          user.find((u) => u.id === item.userId)?.username ===
                          username
                      )
                      .slice(0, 5)
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 text-center">
                            {user.find((u) => u.id === item.userId)?.username}
                          </td>
                          <td className="py-2 px-4 text-center">{item.jam_masuk}</td>
                          <td className="py-2 px-4 text-center">{item.jam_pulang}</td>
                        </tr>
                      ))}
                    {kbm.filter(
                      (item) =>
                        user.find((u) => u.id === item.userId)?.username ===
                        username
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-gray-700 text-center py-4"
                        >
                          Maaf, data KBM Guru tidak ditemukan.
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
                  Tabel Piketan
                </h1>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md bg-white">
                <table className="w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm">
                      <th className="py-2 px-4 text-left">No</th>
                      <th className="py-2 px-4 text-center">Nama Guru</th>
                      <th className="py-2 px-4 text-center">Tanggal</th>
                      <th className="py-2 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {piket
                      .filter(
                        (item) =>
                          kelas.find((k) => k.id === item.kelasId)?.guruId ===
                          user.find((u) => u.username === username)?.id
                      )
                      .slice(0, 5)
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                        >
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 text-center">
                            {getNamaKelas(item.kelasId)}
                          </td>
                          <td className="py-2 px-4 text-center">{item.tanggal}</td>
                          <td className="py-2 px-4 text-center">{item.status}</td>
                        </tr>
                      ))}
                    {piket.filter(
                      (item) =>
                        kelas.find((k) => k.id === item.kelasId)?.guruId ===
                        user.find((u) => u.username === username)?.id
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-gray-700 text-center py-4"
                        >
                          Maaf, data Piketan tidak ditemukan.
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

export default DashboardGuru;
