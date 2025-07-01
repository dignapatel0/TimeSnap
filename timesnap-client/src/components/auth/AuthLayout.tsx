import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-light-subtle min-vh-100 d-flex flex-column justify-content-between align-items-center p-4">
      <div className="w-100 d-flex flex-column align-items-center">
        <header className="w-100 text-center mb-4">
          <h2 className="fw-bold">TimeSnap</h2>
        </header>

        <div className="border border-2 border-dark-subtle p-4 text-center w-100" style={{ maxWidth: 800 }}>
          <h4 className="fw-semibold mb-3">Welcome to TimeSnap.</h4>
          <p className="text-muted">
            This is an all-in-one solution for your timesheet assignments. Students can manage their tasks and
            courses with easy-to-use time tracking features. Teachers can view their students' progress — no more
            Excel sheets!
          </p>
        </div>

        <div className="mt-4" style={{ minWidth: 520, maxWidth: 600, width: '100%' }}>
          {children}
        </div>
      </div>

      <footer className="mt-5 text-muted small text-center">
        Created by Digna Patel © 2025 – <strong>TimeSnap</strong>
      </footer>
    </div>
  );
};
