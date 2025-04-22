import axiosInstance from '../../config/axios';

export const signIn = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};