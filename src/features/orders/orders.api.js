import axiosInstance from "../../config/axios";

export const getOrderById = async(id) => {
  try {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

export const verifyDiscount = async(id, data) => {
  try {
    const res = await axiosInstance.patch(`/orders/${id}/apply-discount`, data);
    return res.data;
  } catch (error) {
    console.error('Error verifying discount:', error);
    return null;
  }
}

export const updateOrderStatus = async(id, data) => {
  try {
    const res = await axiosInstance.patch(`/orders/${id}/status`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
}