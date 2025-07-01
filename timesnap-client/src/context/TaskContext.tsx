import { createContext, useContext, useState, useRef, useEffect, } from 'react';
import type { ReactNode } from 'react';

type Task = {
  id: number;
  courseId: number;
  title: string;
  estimatedTime: number;
  actualTime: number;
  isRunning: boolean;
};

type TaskInput = Omit<Task, 'id' | 'actualTime' | 'isRunning'>;

type TaskContextType = {
  tasks: Task[];
  addTask: (task: TaskInput) => void;
  startTimer: (id: number) => void;
  stopTimer: (id: number) => void;
  editTask: (id: number, updated: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: number) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const TaskProvider = ({ children }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addTask = (task: TaskInput) => {
    setTasks([
      ...tasks,
      {
        ...task,
        id: Date.now(),
        actualTime: 0,
        isRunning: false,
      },
    ]);
  };

  const startTimer = (id: number) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, isRunning: true } : { ...t, isRunning: false })
    );

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTasks(prev =>
        prev.map(t =>
          t.id === id && t.isRunning
            ? { ...t, actualTime: t.actualTime + 1 }
            : t
        )
      );
    }, 1000);
  };

  const stopTimer = (id: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, isRunning: false } : t)
    );
  };

  const editTask = (id: number, updated: Partial<Omit<Task, 'id'>>) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, ...updated } : t
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, startTimer, stopTimer, editTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
};
