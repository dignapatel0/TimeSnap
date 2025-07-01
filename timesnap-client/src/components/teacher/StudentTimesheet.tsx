import { useEffect, useState } from 'react';
import axios from 'axios';

type Task = {
  id: number;
  title: string;
  elapsed_time: number;
  estimated_time: number;
  student: {
    name: string;
    email: string;
  };
};

export const StudentTimesheet = ({ courseId }: { courseId: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/teacher/course/${courseId}/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error loading tasks:', err));
  }, [courseId]);

  const formatHMS = (minutes: number) => {
    const sec = minutes * 60;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <h5 className="mb-3">📝 Timesheet for Course #{courseId}</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Student</th>
            <th>Estimated</th>
            <th>Elapsed</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan={4} className="text-center text-muted">No tasks found for this course.</td></tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.student?.name || 'N/A'} ({task.student?.email || '-'})</td>
                <td>{formatHMS(task.estimated_time)}</td>
                <td>{formatHMS(task.elapsed_time)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
