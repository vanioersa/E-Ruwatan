import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../component/Sidebar";
import { createSiswa, getSiswaById, updateSiswa } from "./api_siswa";

const UpdateSiswa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState({
    nama_siswa: "",
    nisn: "",
    kelasId: "",
    tempat: "",
    alamat: "",
  });
  const [kelasJurusan, setKelasJurusan] = useState([]);
  const [selectedKelasJurusan, setSelectedKelasJurusan] = useState("");

  useEffect(() => {
    const fetchSiswaData = async () => {
      try {
        const siswaData = await getSiswaById(id);
        setSiswa(siswaData);
        setSelectedKelasJurusan(siswaData.kelasId);
      } catch (error) {
        console.error("Failed to fetch siswa data: ", error);
      }
    };
    fetchSiswaData();
  }, [id]);

  const fetchKelasJurusan = async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelasJurusan(response.data);
    } catch (error) {
      console.error("Failed to fetch Kelas and Jurusan: ", error);
    }
  };

  useEffect(() => {
    fetchKelasJurusan();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiswa((prevSiswa) => ({
      ...prevSiswa,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const initialMuridData = await getSiswaById(id);

    const isDataChanged =
    initialMuridData.nama_siswa !== siswa.nama_siswa ||
    initialMuridData.nisn !== siswa.nisn ||
    initialMuridData.kelasId !== selectedKelasJurusan ||
    initialMuridData.tempat !== siswa.tempat ||
    initialMuridData.alamat !== siswa.alamat;

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
      await updateSiswa(id, siswa);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data siswa berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Failed to update siswa data: ", error);
      Swal.fire("Gagal", "Gagal mengupdate data siswa", "error");
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
        <h1 className="judul text-3xl font-semibold">Update Siswa</h1>
        <div className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Update Siswa
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nama_siswa"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Nama Siswa
                </label>
                <input
                  type="text"
                  id="nama_siswa"
                  name="nama_siswa"
                  value={siswa.nama_siswa}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Nama Siswa"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="nisn"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  NISN
                </label>
                <input
                  type="number"
                  id="nisn"
                  name="nisn"
                  value={siswa.nisn}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NISN"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="nisn"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  NISN
                </label>
                <input
                  type="number"
                  id="nisn"
                  name="nisn"
                  value={siswa.nisn}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan NISN"
                  required
                  autoComplete="off"
                />
              </div>
            </div> */}
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
                  value={selectedKelasJurusan}
                  onChange={(e) => setSelectedKelasJurusan(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelasJurusan.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {`${kelas.kelas} - ${kelas.nama_kelas}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label
                  htmlFor="tempat"
                  className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                >
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  id="tempat"
                  name="tempat"
                  value={siswa.tempat}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tempat Lahir"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="alamat"
                className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
              >
                Alamat
              </label>
              <input
                type="text"
                id="alamat"
                name="alamat"
                value={siswa.alamat}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Masukkan Alamat"
                required
                autoComplete="off"
              />
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

export default UpdateSiswa;