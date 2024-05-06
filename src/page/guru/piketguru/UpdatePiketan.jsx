import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import SidebarGuru from "../../../component/SidebarGuru";
import { updatePiket, getAllPiket } from "./api_piket";

const UpdatePiketan = () => {
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [piketan, setPiketan] = useState({ tanggal: '' });
  const [siswaByKelas, setSiswaByKelas] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState({});

  // Assuming you need useParams to get some parameter
  const { id } = useParams(); // id of the piket to update

  useEffect(() => {
    // Fetch all kelas information
    getAllPiket().then(response => {
      setKelas(response.data);
      // Assume response.data returns array of class objects
    });

    // Simulating fetch of student details if you have such an API or logic
    if (selectedKelas) {
      // Fetch students by kelas
      fetch(`/api/siswa/kelas/${selectedKelas}`).then(response => response.json()).then(data => {
        setSiswaByKelas(data);
      });
    }
  }, [selectedKelas]);

  const handleKelasChange = (event) => {
    setSelectedKelas(event.target.value);
  };

  const handleChange = (event) => {
    setPiketan({ ...piketan, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePiket(id, { ...piketan, kelas: selectedKelas, studentStatuses: selectedStudentIds })
      .then(() => {
        Swal.fire('Success', 'Piketan updated successfully', 'success');
      })
      .catch(error => {
        Swal.fire('Error', 'Failed to update piketan', 'error');
      });
  };

  const handleStudentCheckboxChange = (studentId, status) => {
    setSelectedStudentIds({
      ...selectedStudentIds,
      [studentId]: status
    });
  };

  const batal = () => {
    // Optionally, navigate back or clear form
    setSelectedKelas('');
    setPiketan({ tanggal: '' });
    setSelectedStudentIds({});
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="judul text-3xl font-semibold">Update Piketan</h1>
        <div className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
            Update Piketan
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label htmlFor="kelasId" className="block mb-2 text-sm font-medium text-gray-900">
                  Kelas
                </label>
                <select
                  name="kelasId"
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kelas} {item.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label htmlFor="tanggal" className="block mb-2 text-sm font-medium text-gray-900">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={piketan.tanggal}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={batal}
                className="text-gray-600 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Batal
              </button>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update Piketan
              </button>
            </div>
          </form>
          {/* Optionally list students to select for the duty */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Daftar Siswa</h2>
            <ul>
              {siswaByKelas.map((student) => (
                <li key={student.id} className="mb-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds[student.id] || false}
                      onChange={() => handleStudentCheckboxChange(student.id, !selectedStudentIds[student.id])}
                    /> {student.nama}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePiketan;
