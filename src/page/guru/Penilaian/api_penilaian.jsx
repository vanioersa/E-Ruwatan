import axios from "axios";

const apiUrl = "http://localhost:4001/penilaian";

export const getAllPenilaian = async () => {
  try {
    const response = await axios.get(`${apiUrl}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const getPenilaianById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const createPenilaian = async (penilaianData) => {
  try {
    const response = await axios.post(`${apiUrl}`, penilaianData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const updatePenilaian = async (id, penilaianData) => {
  try {
    const response = await axios.put(`${apiUrl}/${id}`, penilaianData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

export const deletePenilaian = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};