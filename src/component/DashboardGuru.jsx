import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarGuru from "./SidebarGuru";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher, faUser } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [piket, setPiket] = useState([]);
  const [kbm, setKbm] = useState([]);
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);

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
      <section className="text-gray-800 body-font flex-1">
        <div className="container mx-auto py-24 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center">
            {/* Kartu pertama (KBM Guru) */}
            <div className="mb-4 p-4 md:w-1/2 sm:w-1/2 w-full">
              <div className="ring-1 shadow-lg bg-sky-600 px-6 py-6 rounded-lg flex items-center justify-between  md:mt-16 md:my-12">
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  className="inline-block w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">
                    {kbm.length}
                  </h2>
                  <p className="leading-relaxed font-medium text-white">
                    KBM Guru
                  </p>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto rounded-lg shadow-lg border-gray-200">
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
            <div className="mb-4 p-4 md:w-1/2 sm:w-1/2 w-full">
              <div className="ring-1 shadow-lg bg-blue-600 px-6 py-6 rounded-lg flex items-center justify-between md:mt-16 md:my-12">
                <FontAwesomeIcon
                  icon={faUser}
                  className="inline-block w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">
                    {piket.length}
                  </h2>
                  <p className="leading-relaxed font-medium text-white">
                    Piketan
                  </p>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto rounded-lg shadow-lg border-gray-200">
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
