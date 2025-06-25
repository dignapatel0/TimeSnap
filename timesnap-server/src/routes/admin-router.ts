import { Router } from 'express';
import prisma from '../utils/prisma-client';
import { isAdmin } from '../middleware/auth';

export const adminRouter = Router();

adminRouter.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTeachers = await prisma.user.count({ where: { role: 'Teacher' } });
    const totalStudents = await prisma.user.count({ where: { role: 'Student' } });
    const totalCourses = await prisma.course.count();
    const totalTasks = await prisma.task.count();

    const tasksPerCourse = await prisma.course.findMany({
      select: { title: true, tasks: true },
    });

    const tasksPerStudent = await prisma.user.findMany({
      where: { role: 'Student' },
      select: { name: true, tasksCreated: true },
    });

    res.render('dashboard', {
      title: 'Admin Dashboard',
      totalUsers,
      totalTeachers,
      totalStudents,
      totalCourses,
      totalTasks,
      tasksPerCourse,
      tasksPerStudent,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Error loading dashboard');
  }
});

adminRouter.get('/users', isAdmin, async (req, res) => {
  const users = await prisma.user.findMany();
  res.render('users', { title: 'All Users', users });
});

adminRouter.get('/teachers', isAdmin, async (req, res) => {
  const teachers = await prisma.user.findMany({ where: { role: 'Teacher' } });
  res.render('teachers', { title: 'All Teachers', teachers });
});

adminRouter.get('/students', isAdmin, async (req, res) => {
  const students = await prisma.user.findMany({ where: { role: 'Student' } });
  res.render('students', { title: 'All Students', students });
});

adminRouter.get('/courses', isAdmin, async (req, res) => {
  const courses = await prisma.course.findMany({ include: { teacher: true } });
  res.render('courses', { title: 'All Courses', courses });
});

adminRouter.get('/tasks', isAdmin, async (req, res) => {
  const tasks = await prisma.task.findMany({ include: { course: true, student: true } });
  res.render('tasks', { title: 'All Tasks', tasks });
});
