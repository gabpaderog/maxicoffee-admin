import axiosInstance from "../../config/axios";

export const getProductById = async(id) => {
  try {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

export const deleteProduct = async(id) => {
  try {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    return null;
  }
}