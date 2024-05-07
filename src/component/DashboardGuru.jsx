import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarGuru from "./SidebarGuru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faChalkboardTeacher, faUserGroup } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [piket, setPiket] = useState([]);
  const [kbm, setKbm] = useState([]);
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [username, setUsername] = useState("");

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
    const fetchGuru = async () => {
      try {
        const response = await axios.get("http://localhost:4001/guru/all");
        setGuru(response.data);
      } catch (error) {
        console.error("Failed to fetch Guru: ", error);
      }
    };
    fetchGuru();
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
            <div className="mb-4 p-4 md:w-1/2 sm:w-1/2 w-full py-2">
              <div className="shadow-lg rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-400 md:mt-16 md:my-12">
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  className="w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="font-medium text-3xl text-white">
                    {kbm.length}
                  </h2>
                  <p className="text-lg font-medium text-white">
                    KBM Guru
                  </p>
                  <hr className="border-white" />
                  <div className="py-2 text-center font-medium">
                    <a href="http://">
                      Klik di sini{""}
                      <FontAwesomeIcon className="pl-1" icon={faArrowCircleRight} />
                    </a>
                  </div>
                </div>
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
                    {kbm.slice(0, 5).map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">
                          {guru.find((g) => g.id === item.namaId)?.nama_guru}
                        </td>
                        <td className="py-2 px-4">{item.jam_masuk}</td>
                        <td className="py-2 px-4">{item.jam_pulang}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Kartu kedua (Piketan) */}
            <div className="mb-4 p-4 md:w-1/2 sm:w-1/2 w-full py-2">
            <div className="shadow-lg rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-400 md:mt-16 md:my-12">
                <FontAwesomeIcon
                  icon={faUserGroup}
                  className="w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="font-medium text-3xl text-white">
                    {piket.length}
                  </h2>
                  <p className="leading-relaxed font-medium text-white">
                    Piketan
                  </p>
                  <hr className="border-white" />
                  <div className="py-2 text-center font-medium">
                    <a href="http://">
                      Klik di sini{""}
                      <FontAwesomeIcon className="pl-1" icon={faArrowCircleRight} />
                    </a>
                  </div>
                </div>
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
                    {piket.slice(0, 5).map((item, index) => (
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
