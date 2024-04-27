import React, { useState } from "react";
import Sidebar from "../../../component/Sidebar";
import Swal from 'sweetalert2';

const TambahSiswa = () => {
  const [nama, setNama] = useState('');
  const [nisn, setNisn] = useState('');
  const [kelas, setKelas] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [alamat, setAlamat] = useState('');

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const batal = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Perubahan yang Anda buat tidak akan disimpan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, batal!'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/Siswa";
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama,
          nisn,
          kelas,
          tempatLahir,
          alamat
        }),
      });

      if (response.ok) {
        Swal.fire(
          'Berhasil!',
          'Data siswa berhasil disimpan.',
          'success'
        ).then(() => {
          window.location.href = "/Siswa";
        });
      } else {
        Swal.fire(
          'Gagal!',
          'Gagal menyimpan data.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire(
        'Error!',
        'Error saat mengirim data.',
        'error'
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <Sidebar />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Tambah Siswa</h1>
        <div className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">Tambah Siswa</p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">Nama</label>
                <input
                  type="text"
                  id="nama"
                  value={nama}
                  onChange={handleChange(setNama)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Siswa"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">NISN</label>
                <input
                  type="number"
                  id="nisn"
                  value={nisn}
                  onChange={handleChange(setNisn)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan NISN"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">Kelas</label>
                <input
                  type="text"
                  id="kelas"
                  value={kelas}
                  onChange={handleChange(setKelas)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Nama Kelas"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">Tempat Lahir</label>
                <input
                  type="text"
                  id="tempatLahir"
                  value={tempatLahir}
                  onChange={handleChange(setTempatLahir)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Tempat Lahir"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900">Alamat</label>
                <input
                  type="text"
                  id="alamat"
                  value={alamat}
                  onChange={handleChange(setAlamat)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan Alamat"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={batal}
                className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-sm font-medium"
              >
                Batal
              </button>
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

export default TambahSiswa;
