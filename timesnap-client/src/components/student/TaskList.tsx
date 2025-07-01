import { useEffect, useState } from 'react';
import axios from 'axios';

export const TaskList = ({ courseId }: any) => {
  const [tasks, setTasks] = useState([]);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});

  const fetchTasks = () => {
    axios.get(`/api/tasks/course/${courseId}`).then((res) => {
      setTasks(res.data);
    });
  };

  useEffect(() => {
    if (courseId) fetchTasks();
  }, [courseId]);

  const toggleTimer = (taskId: string) => {
    setTimers((prev) => ({
      ...prev,
      [taskId]: prev[taskId] ? 0 : Date.now(),
    }));
  };

  const markDone = async (taskId: string) => {
    await axios.patch(`/api/tasks/${taskId}`, { completed: true });
    fetchTasks();
  };

  return (
    <div>
      <h5>Your Tasks</h5>
      {tasks.map((task: any) => (
        <div key={task.id} className="card mb-2 p-3">
          <div className="d-flex justify-content-between">
            <div>
              <h6>{task.title}</h6>
              <p className="mb-1">{task.description}</p>
              <small>Status: {task.completed ? '✅ Done' : '⏳ In Progress'}</small>
            </div>
            <div className="text-end">
              {!task.completed && (
                <>
                  <button
                    onClick={() => toggleTimer(task.id)}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    {timers[task.id] ? 'Stop Timer' : 'Start Timer'}
                  </button>
                  <button
                    onClick={() => markDone(task.id)}
                    className="btn btn-sm btn-success"
                  >
                    Mark Done
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
