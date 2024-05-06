import axios from "axios";

const apiUrl = "http://localhost:4001";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const deleteUsers = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiUrl}/users/hapus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete Kelas with id ${id}: `, error);
    throw error;
  }
};