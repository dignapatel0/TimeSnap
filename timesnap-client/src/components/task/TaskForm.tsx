import { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';

type Props = {
  courseId: number;
};

export const TaskForm = ({ courseId }: Props) => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({ title, estimatedTime, courseId });
    setTitle('');
    setEstimatedTime(0);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Estimated Time (min)</label>
        <input
          type="number"
          className="form-control"
          value={estimatedTime}
          onChange={e => setEstimatedTime(parseInt(e.target.value))}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">Add Task</button>
    </form>
  );
};
