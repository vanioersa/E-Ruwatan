import axios from "axios";

const apiUrl = "http://localhost:4001/piket";

export const createPiket = async (piketData) => {
  try {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is not available. Please log in.");
    }

    // Make the POST request to add new piket data
    const response = await axios.post(`${apiUrl}/add`, piketData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Optionally check for expected status code (e.g., 201 Created)
    if (response.status === 201) {
      console.log("Piket created successfully:", response.data);
      return response.data;
    } else {
      throw new Error(`Unexpected server response: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to create piket: ", error);
    throw error; // Re-throw the error to be handled elsewhere if needed
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
