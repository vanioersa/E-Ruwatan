import axios from 'axios';

const apiUrl = 'http://localhost:4001/piket';  // Update this as necessary

export const createPiket = async (piketData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${apiUrl}/add`, piketData, {
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

export const getAllPiket = async () => {
  try {
    const response = await axios.get(`${apiUrl}/all`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch piket: ", error);
    throw error;
  }
};

export const deletePiket = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiUrl}/hapus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete piket with id ${id}: `, error);
    throw error;
  }
};

export const updatePiket = async (id, piketData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/update/${id}`, piketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update piket with id ${id}: `, error);
    throw error;
  }
};
