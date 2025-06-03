import { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';

type Props = {
  courseId: number;
};

export const TaskList = ({ courseId }: Props) => {
  const { tasks, startTimer, stopTimer, deleteTask, editTask } = useTaskContext();
  const courseTasks = tasks.filter(t => t.courseId === courseId);

  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEstimate, setEditEstimate] = useState(0);

  const handleEdit = (taskId: number, currentTitle: string, currentEstimate: number) => {
    setEditId(taskId);
    setEditTitle(currentTitle);
    setEditEstimate(currentEstimate);
  };

  const saveEdit = () => {
    if (editId !== null) {
      editTask(editId, { title: editTitle, estimatedTime: editEstimate });
      setEditId(null);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    };

  return (
    <div>
      <h5>Tasks</h5>
      {courseTasks.length === 0 ? (
        <p>No tasks for this course.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Estimated</th>
              <th>Actual</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseTasks.map(task => (
              <tr key={task.id}>
                <td>
                  {editId === task.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                  ) : (
                    task.title
                  )}
                </td>
                <td>
                  {editId === task.id ? (
                    <input
                      type="number"
                      className="form-control"
                      value={editEstimate}
                      onChange={e => setEditEstimate(Number(e.target.value))}
                    />
                  ) : (
                    `${task.estimatedTime} min`
                  )}
                </td>
                <td>{formatTime(task.actualTime)}</td>
                <td>
                  {task.isRunning ? (
                    <button className="btn btn-warning btn-sm me-1" onClick={() => stopTimer(task.id)}>Stop</button>
                  ) : (
                    <button className="btn btn-success btn-sm me-1" onClick={() => startTimer(task.id)}>Start</button>
                  )}
                  {editId === task.id ? (
                    <button className="btn btn-primary btn-sm me-1" onClick={saveEdit}>Save</button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm me-1"
                      onClick={() => handleEdit(task.id, task.title, task.estimatedTime)}
                    >
                      Edit
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
