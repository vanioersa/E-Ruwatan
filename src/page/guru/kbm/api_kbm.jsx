import axios from "axios";

const apiUrl = "http://localhost:4001/kbm";

export const getAllKbms = async () => {
  try {
    const response = await axios.get(`${apiUrl}/all`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch KBMs: ", error);
    throw error;
  }
};

export const getKbmById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch kbm with id ${id}: `, error);
      throw error;
    }
  };

export const createKbm = async (kbmData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/add`, kbmData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create KBM: ", error);
    throw error;
  }
};

export const updateKbm = async (id, kbmData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/ubah/${id}`, kbmData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update KBM with id ${id}: `, error);
    throw error;
  }
};

export const deleteKbm = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete KBM with id ${id}: `, error);
    throw error;
  }
};
