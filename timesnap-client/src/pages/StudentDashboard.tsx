import { useState } from 'react';
import { CourseSelection } from '../components/course/CourseSelection';
import { TaskList } from '../components/task/TaskList';
import { TaskForm } from '../components/task/TaskForm';
import { ExportCSV } from '../components/task/ExportCSV';

const StudentDashboard = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState('');

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: '#2f4858' }}>🎓 Student Dashboard</h2>
        <p style={{ color: '#6c757d' }}>Track tasks, record time, and export your progress!</p>
      </div>

      <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#e3f2fd' }}>
        <div className="card-header fw-semibold" style={{ backgroundColor: '#64b5f6', color: 'white' }}>
          📘 Select a Course
        </div>
        <div className="card-body">
          <CourseSelection
            setSelectedCourseId={setSelectedCourseId}
            setSelectedCourseName={setSelectedCourseName}
          />
        </div>
      </div>

      {selectedCourseId && (
        <>
          <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#fff3e0' }}>
            <div className="card-header fw-semibold" style={{ backgroundColor: '#ffb74d', color: '#333' }}>
              📝 Add Task
            </div>
            <div className="card-body">
              <TaskForm courseId={selectedCourseId} />
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#e8f5e9' }}>
            <div className="card-header fw-semibold" style={{ backgroundColor: '#81c784', color: '#333' }}>
              📤 Export Timesheet
            </div>
            <div className="card-body">
              <ExportCSV courseId={selectedCourseId} courseName={selectedCourseName} />
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#f3e5f5' }}>
            <div className="card-header fw-semibold" style={{ backgroundColor: '#ba68c8', color: 'white' }}>
              📋 Task List
            </div>
            <div className="card-body">
              <TaskList courseId={selectedCourseId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
