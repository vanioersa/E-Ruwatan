import axios from 'axios';

const apiUrl = 'http://localhost:4001/piket';

export const getPiketByClass = async (classId) => {
  try {
    const response = await axios.get(`${apiUrl}/pikets/class/${classId}`);
    return response.data;
  } catch (error) {
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

export const updatePiket = async (id, piketDTO) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/ubah/${id}`, piketDTO, {
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
