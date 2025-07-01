import { useEffect, useState } from 'react';
import { MainLayout } from '../pages/MainLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

type Course = {
  id: number;
  title: string;
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
      if (savedId) setSelectedCourseId(Number(savedId));
    };
    if (user?.id) loadCourses();
  }, [user]);

  useEffect(() => {
    const loadTasks = async () => {
      if (selectedCourseId && user?.id) {
        const res = await axios.get(`${API}/task`);
        const courseTasks = (res.data as Task[]).filter(
          (t) => t.course_id === selectedCourseId && t.created_by === user.id
        );
        setTasks(courseTasks);
        const seconds: { [key: number]: number } = {};
        courseTasks.forEach((t) => {
          if (t.elapsed_time > 0) seconds[t.id] = t.elapsed_time * 60;
        });
        setTimerSeconds(seconds);
      }
    };
    loadTasks();
  }, [selectedCourseId, user]);

  // Stop all timers on refresh
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
    };
    window.addEventListener('beforeunload', stopAllTimers);
    return () => window.removeEventListener('beforeunload', stopAllTimers);
  }, [timers, timerSeconds, intervals]);

  const handleAddTask = async () => {
    if (!newTaskTitle || !selectedCourseId || !user?.id) return;
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

  const handleDelete = async (id: number) => {
    await axios.delete(`${API}/task/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleMarkDone = async (id: number) => {
    clearInterval(intervals[id]);
    const elapsed = Math.floor((timerSeconds[id] || 0) / 60);
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await axios.put(`${API}/task/${id}`, {
      ...task,
      elapsed_time: elapsed || task.estimated_time,
    });
    setTasks(tasks.map((t) => (t.id === id ? updated.data : t)));
    setTimers((prev) => ({ ...prev, [id]: false }));
  };

  const handleToggleTimer = async (id: number) => {
    if (timers[id]) {
      clearInterval(intervals[id]);
      const elapsed = Math.floor((timerSeconds[id] || 0) / 60);
      await axios.put(`${API}/task/${id}`, { elapsed_time: elapsed });
      setTimers((prev) => ({ ...prev, [id]: false }));
    } else {
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


  const formatTimeHMS = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatMinutes = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  return (
    <MainLayout>
      <div className="text-center mb-4">
        <h3 className="fw-bold text-primary">
          <i className="bi bi-mortarboard-fill me-2"></i> Welcome, {user?.name}
        </h3>
        <p className="text-secondary">
          Add task, track time, pause/resume tasks, and export your timesheet.
        </p>
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
        <div className="mb-5">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <i className="bi bi-plus-circle me-2"></i> Add Task
            </div>
            <div className="card-body">
              <input
                className="form-control mb-2"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <div className="row mb-2">
                <label className="form-label fw-semibold">Estimated Time</label>
                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Hours"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Minutes"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  />
                </div>
              </div>
              <button className="btn btn-success" onClick={handleAddTask}>
                <i className="bi bi-check-circle me-2"></i> Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCourseId && (
        <>
          <h5 className="mb-3">
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
                  <li
                    key={task.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {editingTaskId === task.id ? (
                        <input
                          className="form-control form-control-sm"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          style={{ maxWidth: '300px' }}
                        />
                      ) : (
                        <strong>{task.title}</strong>
                      )}
                      <div className="small text-muted mt-1">
                        <span className="me-3">
                          <i className="bi bi-clock-history me-1"></i>
                          <strong>Estimated:</strong> {formatMinutes(task.estimated_time)}
                        </span>
                        <span>
                          <i className="bi bi-hourglass-split me-1"></i>
                          <strong>Elapsed:</strong> {formatTimeHMS(total)}
                        </span>
                      </div>
                      {isDone && (
                        <div className="text-success mt-1">
                          <i className="bi bi-check-circle-fill me-1"></i> Completed
                        </div>
                      )}
                    </div>
                    <div className="btn-group">
                      {!isDone && editingTaskId !== task.id && (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => handleToggleTimer(task.id)}
                          >
                            <i className={`bi ${running ? 'bi-pause' : 'bi-play'} me-1`}></i>
                            {running ? 'Pause' : 'Start'}
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm me-1"
                            onClick={() => handleMarkDone(task.id)}
                          >
                            <i className="bi bi-check2-circle me-1"></i> Done
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(task.id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => {
                              setEditingTaskId(task.id);
                              setEditedTitle(task.title);
                            }}
                          >
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>
                        </>
                      )}
                      {editingTaskId === task.id && (
                        <>
                          <button
                            className="btn btn-outline-success btn-sm me-1"
                            onClick={async () => {
                              const res = await axios.put(`${API}/task/${task.id}`, {
                                ...task,
                                title: editedTitle,
                              });
                              setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
                              setEditingTaskId(null);
                              setEditedTitle('');
                            }}
                          >
                            <i className="bi bi-save me-1"></i> Save
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setEditingTaskId(null);
                              setEditedTitle('');
                            }}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {selectedCourseId && (
        <div className="mt-4">
          <button className="btn btn-outline-secondary" onClick={handleExportCSV}>
            <i className="bi bi-file-earmark-arrow-down me-2"></i> Export Timesheet
          </button>
        </div>
      )}
    </MainLayout>
  );
};

export default StudentDashboard;