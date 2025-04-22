import axiosInstance from "../../config/axios";

export const getAddonById = async(id) => {
  try {
    const res = await axiosInstance.get(`/addons/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}