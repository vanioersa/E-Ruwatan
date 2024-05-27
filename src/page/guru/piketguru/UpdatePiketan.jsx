import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SidebarGuru from "../../../component/SidebarGuru";
import { updatePiket, getAllPiket, getPiketByClass } from "./api_piket"; // Ensure you have API functions to get all piket data and piket data by class

const UpdatePiketan = () => {
  const [kelasList, setKelasList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [piketan, setPiketan] = useState({ tanggal: "" });
  const [siswaByKelas, setSiswaByKelas] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    const fetchAllKelas = async () => {
      try {
        const response = await getAllPiket(); // Fetch all piket data
        setKelasList(response);
      } catch (error) {
        console.error("Error fetching all piket data: ", error);
        Swal.fire("Error", "Failed to fetch kelas data", "error");
      }
    };

    fetchAllKelas();
  }, []);

  useEffect(() => {
    const fetchPiketByClass = async () => {
      if (selectedKelas) {
        try {
          const response = await getPiketByClass(selectedKelas); // Fetch piket data by class
          const piketData = response;

          setPiketan({ tanggal: piketData.tanggal });
          setSiswaByKelas(piketData.siswa); // Assuming piketData includes student data
          const statusMap = piketData.siswa.reduce((acc, student) => {
            acc[student.id] = student.status;
            return acc;
          }, {});
          setSelectedStatus(statusMap);
        } catch (error) {
          console.error("Error fetching piket data: ", error);
          Swal.fire("Error", "Failed to fetch piket data", "error");
        }
      }
    };

    fetchPiketByClass();
  }, [selectedKelas]);

  const handleKelasChange = (event) => {
    setSelectedKelas(event.target.value);
  };

  const handleStudentCheckboxChange = (studentId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? undefined : status, // Toggle status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const siswaStatus = Object.keys(selectedStatus).map((studentId) => ({
      siswaId: studentId,
      status: selectedStatus[studentId],
    }));

    try {
      await updatePiket(selectedKelas, { siswaStatus });

      Swal.fire({
        title: "Berhasil",
        text: "Piketan berhasil diperbarui",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating piketan: ", error);
      Swal.fire({
        title: "Gagal",
        text: "Gagal memperbarui piketan. Silakan coba lagi.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const batal = () => {
    setSelectedKelas("");
    setPiketan({ tanggal: "" });
    setSiswaByKelas([]);
    setSelectedStatus({});
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page flex-grow p-8 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Update Piketan</h1>
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Update Piketan
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <div className="relative">
                <label
                  htmlFor="kelasId"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Kelas
                </label>
                <select
                  name="kelasId"
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelasList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kelas} - {item.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label
                  htmlFor="tanggal"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={piketan.tanggal}
                  onChange={handleKelasChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Masukkan Tanggal"
                  required
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={batal}
                className="w-24 rounded-lg text-black border border-red-500 py-2 text-sm font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-24 rounded-lg text-black border border-blue-700 py-2 text-sm font-medium"
              >
                Simpan
              </button>
            </div>
          </form>

          <div
            style={{ backgroundColor: "white" }}
            className="my-10 bg-white border border-gray-200 rounded-xl shadow-lg p-6 mt-8"
          >
            <h2 className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
              Daftar Siswa
            </h2>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nama Siswa
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Masuk
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Izin
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sakit
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Alpha
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-base font-normal">
                  {siswaByKelas.length > 0 ? (
                    siswaByKelas.map((siswa) => (
                      <tr
                        key={siswa.id}
                        className="px-5 py-5 border-b border-gray-200"
                      >
                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                          {siswa.nama_siswa}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "masuk")
                            }
                            checked={selectedStatus[siswa.id] === "masuk"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "izin")
                            }
                            checked={selectedStatus[siswa.id] === "izin"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "sakit")
                            }
                            checked={selectedStatus[siswa.id] === "sakit"}
                          />
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 text-left">
                          <input
                            type="radio"
                            name={`status-${siswa.id}`}
                            onChange={() =>
                              handleStudentCheckboxChange(siswa.id, "alpha")
                            }
                            checked={selectedStatus[siswa.id] === "alpha"}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-5 border-b border-gray-200 text-center"
                      >
                        Tidak ada data siswa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePiketan;
