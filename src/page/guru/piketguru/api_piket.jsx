import axios from 'axios';

const apiUrl = 'http://localhost:4001/piket';  // Update this as necessary

export const createPiket = async (piketData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is not available. Please log in.");
    }

    console.log("Sending data:", piketData); // Log the data being sent

    const response = await axios.post(`${apiUrl}/add`, piketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      console.log("Piket created successfully:", response.data);
      return response.data;
    } else {
      throw new Error(`Unexpected server response: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    console.error("Complete error config:", error.config);
    throw error;  // Optional: handle the error based on your error handling policy
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
