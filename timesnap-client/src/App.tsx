import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />          

          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />

        </Routes>
    </BrowserRouter>
  );
};

export default App;
