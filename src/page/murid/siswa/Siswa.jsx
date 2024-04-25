import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../component/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getAllSiswa, deleteSiswa } from "./api_siswa";
import axios from "axios";

function Siswa() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const data = await getAllSiswa();
        setSiswa(data);
      } catch (error) {
        console.error("Failed to fetch Siswa: ", error);
      }
    };
    fetchSiswa();
  }, []);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/kelas/all"
        );
        setKelas(response.data);
      } catch (error) {
        console.error("Failed to fetch Kelas and Jurusan: ", error);
      }
    };
    fetchKelas();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data siswa akan dihapus",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSiswa(id);
          const updatedSiswa = siswa.filter((siswa) => siswa.id !== id);
          setSiswa(updatedSiswa);
          Swal.fire({
            title: "Berhasil",
            text: "Siswa berhasil dihapus",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Failed to delete Siswa: ", error);
          let errorMessage = "Gagal menghapus siswa. Silakan coba lagi.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errorMessage = error.response.data.message;
          }
          Swal.fire("Gagal", errorMessage, "error");
        }
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page flex-1 container p-8 overflow-y-auto">
        <div className="tabel-siswa my-20 border border-gray-200 bg-white p-5 rounded-xl shadow-lg">
          <div className="bg-gray-700 shadow-md rounded-lg p-4 flex justify-between items-center">
            <h1 className="judul text-3xl text-white font-semibold ">
              Data Siswa
            </h1>
            <div className="flex items-center -space-x-4 hover:space-x-1">
              <Link to={``}>
                <button className="rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="h-5 w-5 text-blue-500"
                  />
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-s">
              <thead className="text-left">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    No
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Nama Siswa
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    NISN
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Kelas
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Tempat Lahir
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Alamat
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {siswa.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Data siswa kosong
                    </td>
                  </tr>
                ) : (
                  siswa.map((siswa, index) => (
                    <tr key={siswa.id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{siswa.nama_siswa}</td>
                      <td className="px-4 py-2">{siswa.nisn}</td>
                      <td className="px-4 py-2">
                        {siswa.kelasId &&
                          `${
                            kelas.find((kelas) => kelas.id === siswa.kelasId)
                              ?.kelas
                          }`}
                      </td>
                      <td className="px-4 py-2">{siswa.tempat}</td>
                      <td className="px-4 py-2">{siswa.alamat}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDelete(siswa.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <Link to={`/update-siswa/${siswa.id}`}>
                          <button className="text-blue-500 hover:text-blue-700 ml-2">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Siswa;
