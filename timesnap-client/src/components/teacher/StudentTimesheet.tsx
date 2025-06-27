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
    axios.get(`http://localhost:5000/task/course/${courseId}`)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error loading tasks:', err));
  }, [courseId]);

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
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.student.name} ({task.student.email})</td>
              <td>{task.estimated_time} min</td>
              <td>{task.elapsed_time} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
