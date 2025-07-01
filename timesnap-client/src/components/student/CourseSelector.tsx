import { useEffect, useState } from 'react';
import axios from 'axios';

export const CourseSelector = ({ selectedCourse, setSelectedCourse }: any) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/api/courses/student').then((res) => {
      setCourses(res.data);
    });
  }, []);

  return (
    <div className="mb-4">
      <label className="form-label">Select Course</label>
      <select
        className="form-select"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">-- Choose a course --</option>
        {courses.map((course: any) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
    </div>
  );
};
