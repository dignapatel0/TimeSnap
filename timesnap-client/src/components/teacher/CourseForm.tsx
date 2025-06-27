import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createCourse } from '../../api/courseApi';

type Props = {
  onAdd: (course: any) => void;
};

export const CourseForm = ({ onAdd }: Props) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuth();

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
      console.log('Creating course with:', newCourse);
      const saved = await createCourse(newCourse); // Save to DB
      onAdd(saved); // Update UI only if backend succeeded
      setTitle('');
      setCode('');
      setStartDate('');
      setEndDate('');
    } catch (err: any) {
      console.error('Failed to create course:', err.response?.data || err);
      alert('Failed to create course. Please check the console.');
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
        Create Course
      </button>
    </form>
  );
};
