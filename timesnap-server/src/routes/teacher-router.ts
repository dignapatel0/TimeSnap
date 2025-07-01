import { Router } from 'express';
import prisma from '../utils/prisma-client';

export const teacherRouter = Router();

// Route to return all student tasks under a course in JSON
teacherRouter.get('/course/:courseId/tasks', async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  try {
    const tasks = await prisma.task.findMany({
      where: { course_id: courseId },
      include: { student: true }
    });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to load tasks' });
  }
});
