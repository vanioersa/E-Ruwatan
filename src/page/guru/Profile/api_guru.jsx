import axios from "axios";

const apiUrl = "http://localhost:4001";

export const getAllGuru = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data guru");
  }
};

export const getGuruById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/users/by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal mengambil data guru dengan id ${id}: `, error);
    throw error;
  }
};
  
export const updateGuru = async (id, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/users/update/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal memperbarui data guru dengan id ${id}: `, error);
    throw error;
  }
};
