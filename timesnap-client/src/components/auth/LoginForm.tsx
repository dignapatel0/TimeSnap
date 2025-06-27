import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const API = import.meta.env.VITE_API_URL;

      const response = await axios.post(`${API}/user/login`, {
        email,
        password,
      }, { withCredentials: true });

      const user = response.data.user;

      // Save user info to localStorage if needed
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);

      // Navigate to respective dashboard
      if (user.role === 'Teacher') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'Student') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleLogin}
        className="border rounded shadow-sm p-4 bg-white"
        style={{ width: '100%', maxWidth: 520 }}
      >
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <span className="nav-link active">Login</span>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">Sign Up</Link>
          </li>
        </ul>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group mb-3 text-start">
          <label className="fw-semibold">Email</label>
          <input
            type="email"
            className="form-control border border-dark-subtle"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-4 text-start">
          <label className="fw-semibold">Password</label>
          <input
            type="password"
            className="form-control border border-dark-subtle"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Login
        </button>
      </form>
    </AuthLayout>
  );
};
