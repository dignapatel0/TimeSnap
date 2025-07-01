import { Router } from 'express';
import prisma from '../utils/prisma-client';

export const courseRouter = Router();

// GET /course - Get all courses
courseRouter.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: true,
        tasks: true,
      },
    });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /course/:id - Get a specific course by ID
courseRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { teacher: true, tasks: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /course - Create a new course
courseRouter.post('/', async (req, res) => {
  const { title, course_code, start_date, end_date, created_by } = req.body;

  if (!title || !course_code || !start_date || !end_date || !created_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        course_code,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        created_by,
      },
    });
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /course/:id - Update a course
courseRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, course_code, start_date, end_date, created_by } = req.body;

  try {
    const existing = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updated = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        course_code,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        created_by,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /course/:id - Delete a course
courseRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});
