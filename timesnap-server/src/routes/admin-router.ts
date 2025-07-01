import { Router } from 'express';
import prisma from '../utils/prisma-client';
import { isAdmin } from '../middleware/auth';

export const adminRouter = Router();

// ========== DASHBOARD ROUTE ==========

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

// ========== USER ROUTES ==========

// GET: All users
adminRouter.get('/users', isAdmin, async (req, res) => {
  const users = await prisma.user.findMany();
  res.render('users', { title: 'All Users', users });
});

// GET: Edit user form
adminRouter.get('/users/:id/edit', isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(404).send('User not found');

  res.render('edit-user', { title: 'Edit User', user });
});

// POST: Handle edit user
adminRouter.post('/users/:id/edit', isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, role } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
    });
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update user');
  }
});

// POST: Delete user
adminRouter.post('/users/:id/delete', isAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete user');
  }
});

// ========== COURSE ROUTES ==========

// GET: All courses
adminRouter.get('/courses', isAdmin, async (req, res) => {
  const courses = await prisma.course.findMany({ include: { teacher: true } });
  res.render('courses', { title: 'All Courses', courses });
});

// GET: Edit course form
adminRouter.get('/courses/:id/edit', isAdmin, async (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  const teachers = await prisma.user.findMany({ where: { role: 'Teacher' } });

  if (!course) return res.status(404).send('Course not found');

  res.render('edit-course', { title: 'Edit Course', course, teachers });
});

// POST: Handle edit course
adminRouter.post('/courses/:id/edit', isAdmin, async (req, res) => {
  const courseId = parseInt(req.params.id);
  const { title, course_code, start_date, end_date, created_by } = req.body;

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        course_code,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        created_by: parseInt(created_by),
      },
    });
    res.redirect('/admin/courses');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update course');
  }
});

// POST: Delete course
adminRouter.post('/courses/:id/delete', isAdmin, async (req, res) => {
  const courseId = parseInt(req.params.id);
  try {
    await prisma.course.delete({ where: { id: courseId } });
    res.redirect('/admin/courses');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete course');
  }
});

// ========== TASK ROUTES ==========

// GET: All tasks
adminRouter.get('/tasks', isAdmin, async (req, res) => {
  const tasks = await prisma.task.findMany({ include: { course: true, student: true } });
  res.render('tasks', { title: 'All Tasks', tasks });
});

// GET: Edit task form
adminRouter.get('/tasks/:id/edit', isAdmin, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  const courses = await prisma.course.findMany();
  const students = await prisma.user.findMany({ where: { role: 'Student' } });

  if (!task) return res.status(404).send('Task not found');

  res.render('edit-task', { title: 'Edit Task', task, courses, students });
});

// POST: Handle edit task
adminRouter.post('/tasks/:id/edit', isAdmin, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, estimated_time, elapsed_time, course_id, created_by } = req.body;

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        estimated_time: parseInt(estimated_time),
        elapsed_time: parseInt(elapsed_time),
        course_id: parseInt(course_id),
        created_by: parseInt(created_by),
      },
    });
    res.redirect('/admin/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update task');
  }
});

// POST: Delete task
adminRouter.post('/tasks/:id/delete', isAdmin, async (req, res) => {
  const taskId = parseInt(req.params.id);
  try {
    await prisma.task.delete({ where: { id: taskId } });
    res.redirect('/admin/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete task');
  }
});
