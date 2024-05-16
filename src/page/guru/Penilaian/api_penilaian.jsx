import axios from "axios";

const apiUrl = "http://localhost:4001/panilaian";

export const getAllPenilaian = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${apiUrl}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const getPenilaianById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${apiUrl}/by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const createPenilaian = async (penilaianData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${apiUrl}/add`, penilaianData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Data error!", error);
    throw error;
  }
};

export const updatePenilaian = async (id, penilaianData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${apiUrl}/ubah/${id}`, penilaianData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const deletePenilaian = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};