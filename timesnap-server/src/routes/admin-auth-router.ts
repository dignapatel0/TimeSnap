// src/routes/admin-auth-router.ts

import { Router } from 'express';
import prisma from '../utils/prisma-client';
import bcrypt from 'bcryptjs';

export const adminAuthRouter = Router();

// GET: Render login page
adminAuthRouter.get('/login', (req, res) => {
  if (req.session.admin) {
    return res.redirect('/admin/dashboard');
  }

  res.render('login', {
    title: 'Admin Login',
    layout: false,
  });
});

// POST: Handle login
adminAuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.user.findFirst({
      where: {
        email,
        role: 'Admin',
      },
    });

    if (!admin || !admin.password) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }

    req.session.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Something went wrong');
    res.redirect('/admin/login');
  }
});

// GET: Logout
adminAuthRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});
