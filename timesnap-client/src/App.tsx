import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { TaskProvider } from './context/TaskContext';

const App = () => {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
};

export default App;
