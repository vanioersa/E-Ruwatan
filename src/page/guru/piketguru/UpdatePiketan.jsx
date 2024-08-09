import React, { useCallback, useEffect, useState } from "react";
import SidebarGuru from "../../../component/SidebarGuru";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function UpdatePiketan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [piketData, setPiketData] = useState({
    kelasId: "",
    tanggal: "",
    siswaStatusList: [],
  });
  const [originalPiketData, setOriginalPiketData] = useState(null);
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);

  const batal = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4001/piket/by-id/${id}`)
      .then((response) => {
        setPiketData(response.data);
        setOriginalPiketData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching piket data:", error);
      });
  }, [id]);

  const fetchKelas = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4001/kelas/all");
      setKelas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data Kelas: ", error);
    }
  }, []);

  const fetchSiswa = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4001/siswa/all");
      setSiswa(response.data);
    } catch (error) {
      console.error("Gagal mengambil data siswa: ", error);
    }
  }, []);

  useEffect(() => {
    fetchKelas();
    fetchSiswa();
  }, [fetchKelas, fetchSiswa]);

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleStatusChange = (siswaId, newStatus) => {
    setPiketData((prevData) => ({
      ...prevData,
      siswaStatusList: prevData.siswaStatusList.map((siswaStatus) =>
        siswaStatus.siswaId === siswaId
          ? { ...siswaStatus, statusList: [newStatus] }
          : siswaStatus
      ),
    }));
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = getAuthToken();

    const statusChanged = piketData.siswaStatusList.some((siswaStatus, index) => {
      return siswaStatus.statusList[0] !== originalPiketData.siswaStatusList[index].statusList[0];
    });

    if (!statusChanged) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan ubah setidaknya satu status sebelum menyimpan.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await axios.put(`http://localhost:4001/piket/edit/${id}`, piketData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data piket berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Error updating piket data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal memperbarui data piket. Silakan coba lagi!",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page flex-grow p-8 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Update Piket</h1>
        <div
          style={{ backgroundColor: "white" }}
          className="add-guru mt-12 md:mt-11 bg-white p-5 mr-0 md:ml-10 border border-gray-200 rounded-xl shadow-lg"
        >
          <p className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-7">
            Update Piket
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
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                  value={`${
                    kelas.find((item) => item.id === piketData.kelasId)?.kelas
                  } - ${
                    kelas.find((item) => item.id === piketData.kelasId)
                      ?.nama_kelas
                  }`}
                  required
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="tanggal"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tanggal
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                  value={formatTanggal(piketData.tanggal)}
                  required
                />
              </div>
            </div>

            <div className="my-7 px-0 sm:px-3">
              <h2 className="text-lg sm:text-xl text-black font-medium mb-4 sm:mb-3 sm:ml-3">
                Daftar Siswa
              </h2>
              <div className="mt-4 overflow-x-auto rounded-lg border-gray-200">
                <table className="min-w-full bg-white divide-y-2 divide-gray-200 border border-gray-200 table-fixed rounded-xl shadow-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-900 text-sm leading-normal">
                      <th className="py-2 px-4">No</th>
                      <th className="py-2 px-4 text-center whitespace-nowrap">
                        Nama Siswa
                      </th>
                      <th className="py-2 px-4 text-center whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    style={{ backgroundColor: "white" }}
                    className="divide-y-2 divide-gray-200"
                  >
                    {piketData.siswaStatusList.map((siswaStatus, index) => {
                      const siswaDetails = siswa.find(
                        (item) => item.id === siswaStatus.siswaId
                      );
                      const statusOptions = ["Masuk", "Izin", "Sakit", "Alpha"];
                      return (
                        <tr key={siswaStatus.siswaId}>
                          <td className="px-5 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center">
                            {siswaDetails ? siswaDetails.nama_siswa : "Unknown"}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-center">
                            <div className="flex justify-center space-x-3 md:space-x-20">
                              {statusOptions.map((statusOption) => (
                                <label key={statusOption}>
                                  <input
                                    type="radio"
                                    name={`status-${siswaStatus.siswaId}`}
                                    value={statusOption}
                                    checked={
                                      siswaStatus.statusList[0] === statusOption
                                    }
                                    onChange={(e) =>
                                      handleStatusChange(
                                        siswaStatus.siswaId,
                                        e.target.value
                                      )
                                    }
                                    className="mr-2"
                                  />
                                  {statusOption}
                                </label>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between">
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
}

export default UpdatePiketan;
