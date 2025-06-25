import { Router } from 'express';
import prisma from '../utils/prisma-client';

export const adminAuthRouter = Router();

// GET: Render login page
adminAuthRouter.get('/login', (req, res) => {
  if (req.session.admin) {
    return res.redirect('/admin/dashboard');
  }

  res.render('login', {
    title: 'Admin Login',
    layout: false 
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

    if (!admin || password !== 'admin123') {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/admin/login');
    }

    req.session.admin = admin;
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
