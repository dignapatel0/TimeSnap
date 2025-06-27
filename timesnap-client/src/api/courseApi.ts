import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchCourses = async () => {
  const res = await axios.get(`${API_URL}/course`);
  return res.data;
};

export const createCourse = async (course: {
  title: string;
  course_code: string;
  start_date: string;
  end_date: string;
  created_by: number;
}) => {
  const res = await axios.post(`${API_URL}/course`, course);
  return res.data;
};

export const deleteCourse = async (id: number) => {
  const res = await axios.delete(`${API_URL}/course/${id}`);
  return res.data;
};
