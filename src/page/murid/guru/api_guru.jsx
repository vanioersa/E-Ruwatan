import axios from "axios";

const apiUrl = "http://localhost:4001";

export const importGuru = (FormData) => {
  return axios
    .post(`${apiUrl}/import`, FormData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const getUsersById = async (id) => {
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

export const updateUsers = async (id, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/users/update/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update user with id ${id}: `, error);
    throw error;
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
