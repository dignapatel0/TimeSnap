import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student'); // default role
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL;

      await axios.post(`${API}/user`, {
        name,
        email,
        password,
        role
      }, { withCredentials: true });

      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleRegister} className="border rounded shadow-sm p-4 bg-white" style={{ width: '100%', maxWidth: 520 }}>
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
          <li className="nav-item">
            <span className="nav-link active">Sign Up</span>
          </li>
        </ul>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group mb-3 text-start">
          <label className="fw-semibold">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3 text-start">
          <label className="fw-semibold">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3 text-start">
          <label className="fw-semibold">Role:</label>
          <select
            className="form-control"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
        </div>

        <div className="form-group mb-3 text-start">
          <label className="fw-semibold">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3 text-start">
          <label className="fw-semibold">Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Sign Up
        </button>
      </form>
    </AuthLayout>
  );
};
