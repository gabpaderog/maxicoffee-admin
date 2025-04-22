import axiosInstance from "../../config/axios";


export const getDiscountById = async(id) => {
  try {
    const res = await axiosInstance.get(`/discounts/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}