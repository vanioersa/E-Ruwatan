import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { updateKelas, getKelasById } from "./api_kelas";

const UpdataKelas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState({
    nama_kelas: "",
    kelas: "",
  });

  useEffect(() => {
    const fetchKelasData = async () => {
      try {
        const KelasData = await getKelasById(id);
        setKelas(KelasData);
      } catch (error) {
        console.error("Failed to fetch kelas data: ", error);
      }
    };
    fetchKelasData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKelas((prevKelas) => ({
      ...prevKelas,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const initialKelasData = await getKelasById(id);

    const isDataChanged =
      initialKelasData.nama_kelas !== kelas.nama_kelas ||
      initialKelasData.kelas !== kelas.kelas;

    if (!isDataChanged) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Minimal satu data harus diubah",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      await updateKelas(id, kelas);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data kelas berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Failed to update kelas data: ", error);
      Swal.fire("Gagal", "Gagal mengupdate data kelas", "error");
    }
  };

  const batal = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div class="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Update Kelas</h1>
        <div className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Update Kelas
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nama_kelas"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 "
                >
                  Nama Kelas
                </label>
                <input
                  type="text"
                  id="nama_kelas"
                  name="nama_kelas"
                  value={kelas.nama_kelas}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Kelas"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="kelas"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Kelas
                </label>
                <select
                  id="kelas"
                  name="kelas"
                  value={kelas.kelas}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={batal}
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-[#0b409c] py-3 text-sm sm:text-xs font-medium"
              >
                Perbarui
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdataKelas;