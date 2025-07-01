import { useEffect, useState } from 'react';
import { MainLayout } from './MainLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

type Course = {
  id: number;
  title: string;
  course_code: string;
};

type Task = {
  id: number;
  title: string;
  estimated_time: number;
  elapsed_time: number;
  course_id: number;
  created_by: number;
};

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [timers, setTimers] = useState<{ [key: number]: boolean }>({});
  const [timerSeconds, setTimerSeconds] = useState<{ [key: number]: number }>({});
  const [intervals, setIntervals] = useState<{ [key: number]: NodeJS.Timeout }>({});
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadCourses = async () => {
      const res = await axios.get(`${API}/course`);
      setCourses(res.data);
      const savedId = localStorage.getItem('selectedCourseId');
      if (savedId) {
        setSelectedCourseId(Number(savedId));
      } else if (res.data.length > 0) {
        setSelectedCourseId(res.data[0].id);
        localStorage.setItem('selectedCourseId', res.data[0].id.toString());
      }
    };
    if (user?.id) loadCourses();
  }, [user?.id]);

  useEffect(() => {
    const loadTasks = async () => {
      if (selectedCourseId && user?.id) {
        const res = await axios.get(`${API}/task`, {
          params: { courseId: selectedCourseId, studentId: user.id },
        });
        setTasks(res.data);

        const seconds: { [key: number]: number } = {};
        
        const pausedTimers = JSON.parse(localStorage.getItem('pausedTimers') || '{}');

        res.data.forEach((t: Task) => {
          const secondsFromDB = t.elapsed_time * 60;
          const pausedSeconds = pausedTimers[t.id] || 0;
          seconds[t.id] = Math.max(secondsFromDB, pausedSeconds); // Keep whichever is higher
        });



        setTimerSeconds(seconds);

        const runningData = localStorage.getItem('runningTask');
        if (runningData) {
          const { taskId, startTime } = JSON.parse(runningData);
          const start = new Date(startTime).getTime();
          const now = Date.now();
          const diff = Math.floor((now - start) / 1000);
          setTimerSeconds((prev) => ({
            ...prev,
            [taskId]: (prev[taskId] || 0) + diff,
          }));
          const interval = setInterval(() => {
            setTimerSeconds((prev) => ({
              ...prev,
              [taskId]: (prev[taskId] || 0) + 1,
            }));
          }, 1000);
          setIntervals((prev) => ({ ...prev, [taskId]: interval }));
          setTimers((prev) => ({ ...prev, [taskId]: true }));
        }
      }
    };
    loadTasks();
  }, [selectedCourseId, user?.id]);

  useEffect(() => {
    const stopAllTimers = () => {
      Object.keys(timers).forEach(async (key) => {
        const taskId = parseInt(key);
        if (timers[taskId]) {
          clearInterval(intervals[taskId]);
          const elapsed = Math.floor((timerSeconds[taskId] || 0) / 60);
          await axios.put(`${API}/task/${taskId}`, { elapsed_time: elapsed });
        }
      });
      localStorage.removeItem('runningTask');
    };
    window.addEventListener('beforeunload', stopAllTimers);
    return () => window.removeEventListener('beforeunload', stopAllTimers);
  }, [timers, timerSeconds, intervals]);

  const handleAddTask = async () => {
    if (!newTaskTitle || !selectedCourseId || !user?.id) {
      alert('Please select a course and enter a task title.');
      return;
    }
    const totalMinutes = estimatedHours * 60 + estimatedMinutes;
    if (totalMinutes === 0) return;
    const res = await axios.post(`${API}/task`, {
      title: newTaskTitle,
      estimated_time: totalMinutes,
      course_id: selectedCourseId,
      created_by: user.id,
    });
    setTasks([...tasks, res.data]);
    setNewTaskTitle('');
    setEstimatedHours(0);
    setEstimatedMinutes(0);
  };

  const handleToggleTimer = async (id: number) => {
    if (timers[id]) {
      clearInterval(intervals[id]);
      const current = timerSeconds[id] || 0;
      const elapsed = Math.floor(current / 60);
      await axios.put(`${API}/task/${id}`, { elapsed_time: elapsed });

      // Store paused state in localStorage
      const pausedTimers = JSON.parse(localStorage.getItem('pausedTimers') || '{}');
      pausedTimers[id] = current;
      localStorage.setItem('pausedTimers', JSON.stringify(pausedTimers));

      setTimers((prev) => ({ ...prev, [id]: false }));
      localStorage.removeItem('runningTask');
    } else {
      const startTime = new Date().toISOString();
      localStorage.setItem('runningTask', JSON.stringify({ taskId: id, startTime }));

      // Remove paused time if resuming
      const pausedTimers = JSON.parse(localStorage.getItem('pausedTimers') || '{}');
      delete pausedTimers[id];
      localStorage.setItem('pausedTimers', JSON.stringify(pausedTimers));

      const interval = setInterval(() => {
        setTimerSeconds((prev) => ({
          ...prev,
          [id]: (prev[id] || 0) + 1,
        }));
      }, 1000);
      setIntervals((prev) => ({ ...prev, [id]: interval }));
      setTimers((prev) => ({ ...prev, [id]: true }));
    }
  };


    const handleMarkDone = async (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      clearInterval(intervals[id]);

      const totalElapsedSeconds = timerSeconds[id] || 0;
      const totalElapsedMinutes = Math.max(1, Math.ceil(totalElapsedSeconds / 60)); // ensure at least 1 min

      try {
        const updated = await axios.put(`${API}/task/${id}`, {
          ...task,
          elapsed_time: totalElapsedMinutes,
        });

        setTasks((prev) =>
          prev.map((t) => (t.id === id ? updated.data : t))
        );

        setTimers((prev) => ({ ...prev, [id]: false }));
        localStorage.removeItem('runningTask');
      } catch (err) {
        console.error('Failed to mark task as done:', err);
      }
    };

  const handleDelete = async (id: number) => {
    await axios.delete(`${API}/task/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleUpdateTaskTitle = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await axios.put(`${API}/task/${id}`, {
      ...task,
      title: editedTitle,
    });
    setTasks(tasks.map((t) => (t.id === id ? updated.data : t)));
    setEditingTaskId(null);
    setEditedTitle('');
  };

  const handleExportCSV = async () => {
    if (!user?.id || !selectedCourseId) return;
    const res = await axios.get(`${API}/task/export/${user.id}/${selectedCourseId}`, {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${user.name.replace(/\s+/g, '_')}_Timesheet.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatMinutes = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  const formatTimeHMS = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <MainLayout>
      <div className="text-center mb-4">
        <h3 className="fw-bold text-primary">
          <i className="bi bi-mortarboard-fill me-2"></i> Welcome, {user?.name}
        </h3>
        <p className="text-secondary">Track time, pause/resume tasks, and export your timesheet.</p>
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-journal-bookmark-fill me-2"></i> Select Course
        </label>
        <select
          className="form-select"
          value={selectedCourseId || ''}
          onChange={(e) => {
            const selected = Number(e.target.value);
            setSelectedCourseId(selected);
            localStorage.setItem('selectedCourseId', selected.toString());
          }}
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <>
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white">
            <i className="bi bi-plus-circle me-2"></i> Add Task
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-semibold">Task Title</label>
              <input
                className="form-control"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Estimated Time</label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Hours"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Minutes"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    min={0}
                    max={59}
                  />
                </div>
              </div>
              <small className="text-muted">Enter estimated duration in hours and minutes.</small>
            </div>

            <button className="btn btn-success mt-2" onClick={handleAddTask}>
              <i className="bi bi-check-circle me-2"></i> Add Task
            </button>
          </div>
        </div>

          <h5>
            <i className="bi bi-list-task me-2"></i> Tasks for this course
          </h5>
          {tasks.length === 0 ? (
            <p className="text-muted">No tasks yet.</p>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => {
                const isDone = task.elapsed_time > 0;
                const running = timers[task.id];
                const live = timerSeconds[task.id] || 0;
                const saved = task.elapsed_time * 60;
                const total = saved + live;

                return (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div style={{ flex: 1 }}>
                      {editingTaskId === task.id ? (
                        <input
                          className="form-control mb-2"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                        />
                      ) : (
                        <strong>{task.title}</strong>
                      )}
                      <div className="small text-muted">
                        <i className="bi bi-clock me-1"></i> Estimated: {formatMinutes(task.estimated_time)} |{' '}
                        <i className="bi bi-hourglass-split me-1"></i> Elapsed: {formatTimeHMS(total)}
                      </div>
                      {isDone && (
                        <div className="text-success mt-1">
                          <i className="bi bi-check-circle-fill me-1"></i> Completed
                        </div>
                      )}
                    </div>
                    
                    <div className="btn-group mt-2">
                      {editingTaskId === task.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-dark me-2"
                            onClick={() => handleUpdateTaskTitle(task.id)}
                          >
                            <i className="bi bi-check2 me-1"></i> Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setEditingTaskId(null);
                              setEditedTitle('');
                            }}
                          >
                            <i className="bi bi-x me-1"></i> Cancel
                          </button>
                        </>
                      ) : !isDone ? (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleToggleTimer(task.id)}
                          >
                            <i className={`bi ${running ? 'bi-pause' : 'bi-play'} me-1`}></i>
                            {running ? 'Pause' : 'Start'}
                          </button>

                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleMarkDone(task.id)}
                          >
                            <i className="bi bi-check-circle me-1"></i> Done
                          </button>

                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => {
                              setEditingTaskId(task.id);
                              setEditedTitle(task.title);
                            }}
                          >
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(task.id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </>
                      ) : (
                        <span className="badge bg-success">✔ Done</span>
                      )}
                    </div>

                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4">
            <button className="btn btn-outline-secondary" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-arrow-down me-2"></i> Export Timesheet
            </button>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default StudentDashboard;