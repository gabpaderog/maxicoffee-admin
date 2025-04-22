import axiosInstance from "../../config/axios";


export const getCategoryById = async(id) => {
  try {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}