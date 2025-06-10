import { useState } from 'react';
import { CourseForm } from '../components/teacher/CourseForm';
import { CourseList } from '../components/teacher/CourseList';
import { StudentTimesheet } from '../components/teacher/StudentTimesheet';

type Course = {
  id: number;
  title: string;
  code: string;
};

export const TeacherDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const addCourse = (newCourse: Omit<Course, 'id'>) => {
    const id = Date.now(); // temporary ID until you use a real DB
    setCourses([...courses, { ...newCourse, id }]);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Teacher Dashboard</h3>

      <CourseForm addCourse={addCourse} />
      <CourseList courses={courses} setSelectedCourseId={setSelectedCourseId} />

      {selectedCourseId && <StudentTimesheet courseId={selectedCourseId} />}
    </div>
  );
};
