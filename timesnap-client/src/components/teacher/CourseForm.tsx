import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createCourse, updateCourse } from '../../api/courseApi';
import type { Course } from '../../types';

type Props = {
  onAdd: (course: Course) => void;
  course: Course | null;
};

export const CourseForm = ({ onAdd, course }: Props) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuth();

  // Fill form when editing
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setCode(course.course_code);
      setStartDate(course.start_date.slice(0, 10)); // YYYY-MM-DD
      setEndDate(course.end_date.slice(0, 10));
    } else {
      setTitle('');
      setCode('');
      setStartDate('');
      setEndDate('');
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || user.role !== 'Teacher') {
      alert('Teacher ID not found or invalid role');
      return;
    }

    const newCourse = {
      title,
      course_code: code,
      start_date: startDate,
      end_date: endDate,
      created_by: user.id,
    };

    try {
      let saved;
      if (course) {
        // update existing
        saved = await updateCourse(course.id, newCourse);
      } else {
        // create new
        saved = await createCourse(newCourse);
      }

      onAdd(saved); // update list
      setTitle('');
      setCode('');
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      console.error('Failed to save course:', err.response?.data || err);
      alert('Failed to save course. See console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">Title</label>
        <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">Course Code</label>
        <input className="form-control" value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">Start Date</label>
        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold text-secondary">End Date</label>
        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </div>
      <button type="submit" className="btn" style={{ backgroundColor: '#6a4c93', color: '#fff' }}>
        {course ? 'Update Course' : 'Create Course'}
      </button>
    </form>
  );
};
