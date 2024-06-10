import axios from "axios";

const apiUrl = "http://localhost:4001";

export const getAdminById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${apiUrl}/users/by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user with id ${id}: `, error);
    throw error;
  }
};
