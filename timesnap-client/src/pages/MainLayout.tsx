import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Header */}
      <header className="bg-dark text-white p-3 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <h4 className="mb-0">TimeSnap</h4>
          <nav>
            <span className="me-3">Hello {user?.name}</span>
            <button onClick={handleLogout} className="btn btn-light btn-sm">Logout</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-5">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-5 border-top">
        <small>© {new Date().getFullYear()} TimeSnap. All rights reserved.</small>
      </footer>
    </>
  );
};
