import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import SidebarGuru from "../../../component/SidebarGuru";

const UpdateKBM = () => {
    // Ambil ID KBM dari URL menggunakan useParams
    const { id } = useParams();

    // Definisikan state untuk data KBM, Guru, dan Kelas
    const [kbm, setKbm] = useState({
        namaId: "",
        kelasId: "",
        jam_masuk: "",
        jam_pulang: "",
        keterangan: "",
        materi: "",
    });

    const [guru, setGuru] = useState([]);
    const [kelas, setKelas] = useState([]);

    // Definisikan useNavigate untuk navigasi
    const navigate = useNavigate();

    // Fungsi untuk mengambil data guru
    const fetchGuru = async () => {
        try {
            const response = await axios.get("http://localhost:4001/guru/all");
            setGuru(response.data);
        } catch (error) {
            console.error("Gagal mengambil data Guru: ", error);
        }
    };

    // Fungsi untuk mengambil data kelas
    const fetchKelas = async () => {
        try {
            const response = await axios.get("http://localhost:4001/kelas/all");
            setKelas(response.data);
        } catch (error) {
            console.error("Gagal mengambil data Kelas: ", error);
        }
    };

    // Fungsi untuk mengambil data KBM berdasarkan ID
    const fetchKbmById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:4001/kbm/${id}`);
            setKbm(response.data);
        } catch (error) {
            console.error("Gagal mengambil data KBM: ", error);
        }
    };

    // Gunakan useEffect untuk mengambil data guru, kelas, dan KBM saat pertama kali dimuat
    useEffect(() => {
        fetchGuru();
        fetchKelas();
        fetchKbmById(id);
    }, [id]);

    // Fungsi untuk mengubah data KBM
    const handleChange = (e) => {
        const { name, value } = e.target;
        setKbm((prevKbm) => ({
            ...prevKbm,
            [name]: value,
        }));
    };

    // Fungsi untuk memperbarui data KBM
    const handleUpdate = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data KBM Guru akan diperbarui",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Buat permintaan HTTP PUT untuk memperbarui data KBM berdasarkan ID
                    await axios.put(`http://localhost:4001/kbm/${id}`, kbm);
                    Swal.fire({
                        title: "Berhasil",
                        text: "Data KBM Guru berhasil diperbarui",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        navigate(-1);
                    });
                } catch (error) {
                    console.error("Gagal memperbarui KBM Guru: ", error);
                    Swal.fire({
                        title: "Gagal",
                        text: "Gagal memperbarui KBM Guru. Silakan coba lagi.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            }
        });
    };

    // Fungsi untuk membatalkan dan kembali
    const batal = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="sidebar w-full md:w-64">
                <SidebarGuru />
            </div>
            <div className="content-page max-h-screen container p-8 min-h-screen">
                <h1 className="judul text-3xl font-semibold">Update KBM Guru</h1>
                <div className="update-kbm mt-12 bg-white p-5 ml-8 border border-gray-200 rounded-xl shadow-lg">
                    <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
                        Update KBM Guru
                    </p>
                    <form onSubmit={handleUpdate}>
                        {/* Formulir untuk memperbarui data KBM */}
                        {/* Gunakan value={kbm.kelasId}, value={kbm.namaId}, dan lainnya untuk diisi dengan data saat ini */}
                        {/* Konten formulir tetap sama dengan fungsi sebelumnya */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                            {/* Form input */}
                            {/* Kolom Kelas */}
                            <div className="relative">
                                <label htmlFor="kelasId" className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">
                                    Kelas
                                </label>
                                <select
                                    id="kelasId"
                                    name="kelasId"
                                    value={kbm.kelasId}
                                    onChange={handleChange}
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

                            {/* Kolom Guru */}
                            <div className="relative">
                                <label htmlFor="namaId" className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">
                                    Guru
                                </label>
                                <select
                                    id="namaId"
                                    name="namaId"
                                    value={kbm.namaId}
                                    onChange={handleChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                >
                                    <option value="">Pilih Guru</option>
                                    {guru.map((guru) => (
                                        <option key={guru.id} value={guru.id}>
                                            {guru.nama_guru}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                            {/* Kolom Jam Masuk */}
                            <div className="relative">
                                <label
                                    htmlFor="jam_masuk"
                                    className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                                >
                                    Jam Masuk
                                </label>
                                <input
                                    type="time"
                                    id="jam_masuk"
                                    name="jam_masuk"
                                    value={kbm.jam_masuk}
                                    onChange={handleChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Masukkan Jam Masuk"
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            {/* Kolom Jam Pulang */}
                            <div className="relative">
                                <label
                                    htmlFor="jam_pulang"
                                    className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                                >
                                    Jam Pulang
                                </label>
                                <input
                                    type="time"
                                    id="jam_pulang"
                                    name="jam_pulang"
                                    value={kbm.jam_pulang}
                                    onChange={handleChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Masukkan Jam Pulang"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                            {/* Kolom Materi */}
                            <div className="relative">
                                <label
                                    htmlFor="materi"
                                    className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                                >
                                    Materi
                                </label>
                                <input
                                    type="text"
                                    name="materi"
                                    id="materi"
                                    value={kbm.materi}
                                    onChange={handleChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Masukkan Materi"
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            {/* Kolom Keterangan */}
                            <div className="relative">
                                <label
                                    htmlFor="keterangan"
                                    className="block mb-2 text-sm sm:text-xs font-medium text-gray-900"
                                >
                                    Keterangan
                                </label>
                                <input
                                    type="text"
                                    name="keterangan"
                                    id="keterangan"
                                    value={kbm.keterangan}
                                    onChange={handleChange}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Masukkan Keterangan"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            {/* Tombol Batal */}
                            <button
                                type="button"
                                onClick={batal}
                                className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-sm font-medium"
                            >
                                Batal
                            </button>

                            {/* Tombol Simpan */}
                            <button
                                type="submit"
                                className="block w-20 sm:w-24 rounded-lg text-black outline outline-blue-700 py-3 text-sm sm:text-sm font-medium"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateKBM;
