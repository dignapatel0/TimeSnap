import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchTasks = async (userId: number) => {
  const res = await axios.get(`${API_URL}/task`);
  return res.data.filter((task: any) => task.created_by === userId);
};

export const createTask = async (task: any) => {
  const res = await axios.post(`${API_URL}/task`, task);
  return res.data;
};

export const updateTask = async (id: number, task: any) => {
  const res = await axios.put(`${API_URL}/task/${id}`, task);
  return res.data;
};

export const deleteTask = async (id: number) => {
  const res = await axios.delete(`${API_URL}/task/${id}`);
  return res.data;
};
