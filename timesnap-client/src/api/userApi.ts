import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/user/login`, { email, password });
  return res.data;
};

export const registerUser = async (user: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await axios.post(`${API_URL}/user`, user);
  return res.data;
};
