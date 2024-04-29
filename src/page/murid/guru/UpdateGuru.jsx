import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { updateGuru, getGuruById } from "./api_guru";

const UpdateGuru = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guru, setGuru] = useState({
    nama_guru: "",
    nip: "",
    tempat_lahir: "",
    mapel: "",
    kelasId: "",
  });
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");

  useEffect(() => {
    const fetchGuruData = async () => {
      try {
        const guruData = await getGuruById(id);
        setGuru(guruData);
        setSelectedKelas(guruData.kelasId);
      } catch (error) {
        console.error("Failed to fetch guru data: ", error);
      }
    };
    fetchGuruData();
  }, [id]);

  const fetchKelas = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Failed to fetch kelas data: ", error);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuru((prevGuru) => ({
      ...prevGuru,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const initialGuruData = await getGuruById(id);

    const isDataChanged =
      initialGuruData.nama_guru !== guru.nama_guru ||
      initialGuruData.nip !== guru.nip ||
      initialGuruData.tempat_lahir !== guru.tempat_lahir ||
      initialGuruData.mapel !== guru.mapel ||
      initialGuruData.kelasId !== selectedKelas;

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
      await updateGuru(id, guru);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data guru berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Failed to update guru data: ", error);
      Swal.fire("Gagal", "Gagal mengupdate data guru", "error");
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
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Update Guru</h1>
        <div className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Update Guru
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nama_guru"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nama Guru
                </label>
                <input
                  type="text"
                  id="nama_guru"
                  name="nama_guru"
                  value={guru.nama_guru}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nama Guru"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="nip"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  NIP
                </label>
                <input
                  type="number"
                  id="nip"
                  name="nip"
                  value={guru.nip}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NIP"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="tempat_lahir"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  id="tempat_lahir"
                  name="tempat_lahir"
                  value={guru.tempat_lahir}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tempat Lahir"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="mapel"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Mapel
                </label>
                <input
                  type="text"
                  id="mapel"
                  name="mapel"
                  value={guru.mapel}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nama Mapel Yang Diampu"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Kelas
                </label>
                <select
                  id="kelasId"
                  name="kelasId"
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.kelas}
                    </option>
                  ))}
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

export default UpdateGuru;