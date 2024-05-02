import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faDoorOpen,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Dashboard() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setkelas] = useState([]);
  const [guru, setGuru] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Simulate fetching the username from localStorage
    const storedUsername = localStorage.getItem("username"); // Assume 'username' is saved in localStorage on login
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const response = await axios.get("http://localhost:4001/siswa/all");
        setSiswa(response.data);
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
        setGuru(response.data);
      } catch (error) {
        console.error("Failed to fetch guru: ", error);
      }
    };
    fetchGuru();
  }, []);

  function getRandomColor() {
    const colors = [
      "bg-red-600",
      "bg-blue-600",
      "bg-yellow-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
      "bg-orange-600",
      "bg-teal-600",
      "bg-gray-600",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
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
              Hai, <strong>{username}</strong>!
              <span style={{ boxShadow: "none" }}>
                Selamat datang di dashboard Admin.
              </span>
            </h1>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center">
            {/* Kartu pertama */}
            <div className="mb-4 p-1 md:w-1/3 sm:w-1/2 w-full">
              <div
                className={`ring-1 shadow-lg ${getRandomColor()} px-6 py-6 mx-5 rounded-lg flex items-center justify-between md:mt-16 md:my-12`}
              >
                <FontAwesomeIcon
                  icon={faUserGroup}
                  className="inline-block w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">
                    {siswa.length}
                  </h2>
                  <p className="leading-relaxed font-medium text-white">
                    Siswa
                  </p>
                </div>
              </div>
            </div>
            {/* Kartu kedua */}
            <div className="mb-4 p-1 md:w-1/3 sm:w-1/2 w-full">
              <div
                className={`ring-1 shadow-lg ${getRandomColor()} px-6 py-6 mx-5 rounded-lg flex items-center justify-between md:mt-16 md:my-12`}
              >
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  className="inline-block w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">
                    {kelas.length}
                  </h2>
                  <p className="leading-relaxed font-medium text-white">
                    Kelas
                  </p>
                </div>
              </div>
            </div>
            {/* Kartu ketiga */}
            <div className="mb-4 p-1 md:w-1/3 sm:w-1/2 w-full">
              <div
                className={`ring-1 shadow-lg ${getRandomColor()} px-6 py-6 mx-5 rounded-lg flex items-center justify-between md:mt-16 md:my-12`}
              >
                <FontAwesomeIcon
                  icon={faChalkboardTeacher}
                  className="inline-block w-12 h-12 text-white mr-4"
                />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">
                    {guru.length}
                  </h2>
                  <p className="leading-relaxed font-medium text-white">Guru</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-8 justify-center">
            <div className="w-full md:w-1/2 overflow-x-auto rounded-lg border-gray-200">
              <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                    <th className="py-2 px-4 text-left">No</th>
                    <th className="py-2 px-4 text-left">Nama Siswa</th>
                    <th className="py-2 px-4 text-left">NISN</th>
                    <th className="py-2 px-4 text-left">Tempat Lahir</th>
                  </tr>
                </thead>
                <tbody>
                  {siswa.length > 0 ? (
                    siswa.slice(0, 5).map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{item.nama_siswa}</td>
                        <td className="py-2 px-4">{item.nisn}</td>
                        <td className="py-2 px-4">{item.tempat}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 px-6 text-center text-gray-500 border-b border-gray-200"
                      >
                        Maaf, data siswa tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="w-full md:w-1/2 mt-4 md:mt-0 overflow-x-auto rounded-lg border-gray-200">
              <table className="min-w-full bg-white divide-y-2 divide-gray-200 table-fixed rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                    <th className="py-2 px-4 text-left">No</th>
                    <th className="py-2 px-4 text-left">Nama Guru</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {guru.length > 0 ? (
                    guru.slice(0, 5).map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition duration-200 ease-in-out"
                      >
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{item.username}</td>
                        <td className="py-2 px-4">{item.email}</td>
                        <td className="py-2 px-4">{item.role}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 px-6 text-center text-gray-500 border-b border-gray-200"
                      >
                        Maaf, data guru tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <div className="mb-10" />
      <style jsx>{`
        @media (max-width: 768px) {
          .bg-gray-100 {
            margin-bottom: 50px; /* Sesuaikan jarak sesuai kebutuhan */
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
