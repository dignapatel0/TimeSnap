import { useState } from 'react';
import { CourseSelection } from '../components/course/CourseSelection';
import { TaskList } from '../components/task/TaskList';
import { TaskForm } from '../components/task/TaskForm';
import { ExportCSV } from '../components/task/ExportCSV';

export const Home = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState('');

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Student Dashboard</h3>

      <CourseSelection
        setSelectedCourseId={setSelectedCourseId}
        setSelectedCourseName={setSelectedCourseName}
      />

      {selectedCourseId && (
        <>
          <TaskForm courseId={selectedCourseId} />
          <ExportCSV courseId={selectedCourseId} courseName={selectedCourseName} />
          <TaskList courseId={selectedCourseId} />
        </>
      )}
    </div>
  );
};
