import { api } from './axios';

export const loginUser = (credentials: { email: string; password: string }) => {
  return api.post('/admin/login', credentials);
};

export const logoutUser = () => {
  return api.get('/admin/logout');
};
