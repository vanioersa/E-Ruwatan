import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import SidebarGuru from '../../../component/SidebarGuru';
import { updatePiket, getAllPiket } from './api_piket'; // Ensure you have these API functions

const UpdatePiketan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [piketan, setPiketan] = useState({
    kelasId: '',
    siswaId: '',
    tanggal: '',
    status: ''
  });
  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKelas = async () => {
    const response = await axios.get('http://localhost:4001/kelas/all');
    setKelas(response.data);
  };

  const fetchSiswa = async () => {
    const response = await axios.get('http://localhost:4001/siswa/all');
    setSiswa(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const piketData = await getAllPiket(id);
        setPiketan({
          kelasId: piketData.kelasId,
          siswaId: piketData.siswaId,
          tanggal: piketData.tanggal.slice(0, 10), // Assuming the date comes in full ISO format
          status: piketData.status,
        });
        fetchKelas();
        fetchSiswa();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching piket details:', error);
        Swal.fire('Error', 'Failed to fetch data', 'error');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPiketan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'The changes will be updated',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updatePiket(id, piketan);
          Swal.fire('Updated!', 'The piketan has been updated.', 'success');
          navigate(-1);
        } catch (error) {
          console.error('Update failed:', error);
          Swal.fire('Failed!', 'Failed to update piketan.', 'error');
        }
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64">
        <SidebarGuru />
      </div>
      <div className="content-page max-h-screen container p-8 min-h-screen">
        <h1 className="text-3xl font-semibold">Update Piketan</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Kelas</label>
            <select name="kelasId" value={piketan.kelasId} onChange={handleChange} required>
              {kelas.map(k => (
                <option key={k.id} value={k.id}>{k.nama_kelas}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Siswa</label>
            <select name="siswaId" value={piketan.siswaId} onChange={handleChange} required>
              {siswa.map(s => (
                <option key={s.id} value={s.id}>{s.nama_siswa}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Tanggal</label>
            <input type="date" name="tanggal" value={piketan.tanggal} onChange={handleChange} required />
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={piketan.status} onChange={handleChange} required>
              <option value="masuk">Masuk</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpha">Alpha</option>
            </select>
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePiketan;
