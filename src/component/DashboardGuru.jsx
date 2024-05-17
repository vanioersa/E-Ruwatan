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

function Dashboard() {
  const [piket, setPiket] = useState([]);
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
    // Simulate fetching the username from localStorage
    const storedUsername = localStorage.getItem("username"); // Assume 'username' is saved in localStorage on login
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:my-0">
          <div className="flex flex-wrap justify-center">
            {/* Kartu pertama (KBM Guru) */}
            <div className="mb-4 px-3 flex-shrink-0 w-full sm:w-1/2 md:w-1/2">
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

              {/* Tabel */}
              <div className="bg-white py-2 mb-2">
                <h1
                  className="text-gray-800 relative py-2 px-5 bg-gray-100 text-lg font-bold"
                  style={{
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                    borderRadius: "8px",
                  }}
                >
                  Tabel KBM
                </h1>
              </div>
              <div className="mt-4 overflow-x-auto rounded-lg border-gray-200 shadow-lg">
                <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                      <th className="py-2 px-4 text-left">No</th>
                      <th className="py-2 px-4 text-left">Nama Guru</th>
                      <th className="py-2 px-4 text-left">Jam Masuk</th>
                      <th className="py-2 px-4 text-left">Jam Keluar</th>
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
                          <td className="py-2 px-4">
                            {user.find((u) => u.id === item.userId)?.username}
                          </td>
                          <td className="py-2 px-4">{item.jam_masuk}</td>
                          <td className="py-2 px-4">{item.jam_pulang}</td>
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

            {/* Kartu kedua (Piketan) */}
            <div className="mb-4 px-3 flex-shrink-0 w-full sm:w-1/2 md:w-1/2">
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

              {/* Tabel */}
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

              <div className="mt-4 overflow-x-auto rounded-lg border-gray-200 shadow-lg">
                <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                      <th className="py-2 px-4 text-left">No</th>
                      <th className="py-2 px-4 text-left">Nama Guru</th>
                      <th className="py-2 px-4 text-left">Tanggal</th>
                      <th className="py-2 px-4 text-left">Status</th>
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
                          <td className="py-2 px-4">
                            {getNamaKelas(item.kelasId)}
                          </td>
                          <td className="py-2 px-4">{item.tanggal}</td>
                          <td className="py-2 px-4">{item.status}</td>
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
      </section>
    </div>
  );
}

export default Dashboard;
