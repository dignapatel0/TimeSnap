import { useEffect, useState } from 'react';
import { CourseForm } from '../components/teacher/CourseForm';
import { CourseList } from '../components/teacher/CourseList';
import { StudentTimesheet } from '../components/teacher/StudentTimesheet';
import { fetchCourses, deleteCourse } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import type { Course } from '../types';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        const teacherCourses = data.filter((c: Course) => c.created_by === user?.id);
        setCourses(teacherCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadCourses();
    }
  }, [user]);

  const handleAdd = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      if (selectedCourseId === id) setSelectedCourseId(null);
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: '#6a4c93' }}>👩‍🏫 Welcome Teacher</h2>
        <p className="text-dark">You can manage your courses and view student timesheets below.</p>
      </div>

      <div className="row g-4">
        {/* Add Course */}
        <div className="col-md-6">
          <div className="card shadow-sm" style={{ backgroundColor: '#f3e6ff', border: 'none' }}>
            <div className="card-header fw-bold" style={{ backgroundColor: '#a55eea', color: 'white' }}>
              ➕ Add Course
            </div>
            <div className="card-body">
              <CourseForm onAdd={handleAdd} />
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="col-md-6">
          <div className="card shadow-sm" style={{ backgroundColor: '#e0f7f4', border: 'none' }}>
            <div className="card-header fw-bold" style={{ backgroundColor: '#00b894', color: 'white' }}>
              📚 Your Courses
            </div>
            <div className="card-body">
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : courses.length > 0 ? (
                <CourseList
                  courses={courses}
                  onDelete={handleDelete}
                  onSelect={setSelectedCourseId}
                />
              ) : (
                <p className="text-muted">No courses added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timesheet */}
      {selectedCourseId && (
        <div className="mt-5">
          <div className="card shadow-sm" style={{ backgroundColor: '#fff8dc', border: 'none' }}>
            <div className="card-header fw-bold" style={{ backgroundColor: '#fdcb6e', color: '#333' }}>
              ⏱️ Student Timesheet
            </div>
            <div className="card-body">
              <StudentTimesheet courseId={selectedCourseId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
