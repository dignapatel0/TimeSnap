import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000', // Backend base URL
  withCredentials: true,            // Allow cookies/session if needed
});
