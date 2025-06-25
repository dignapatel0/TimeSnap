import { Router } from 'express';
import prisma from '../utils/prisma-client';

export const taskRouter = Router();

// GET /task - Get all tasks
taskRouter.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        course: true,
        student: true,
      },
    });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /task/:id - Get a specific task by ID
taskRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { course: true, student: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /task - Create a new task
taskRouter.post('/', async (req, res) => {
  const { title, estimated_time, course_id, created_by } = req.body;

  if (!title || !estimated_time || !course_id || !created_by) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        estimated_time,
        course_id,
        created_by,
      },
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /task/:id - Update a task
taskRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, estimated_time, elapsed_time, course_id, created_by } = req.body;

  try {
    const existing = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        estimated_time,
        elapsed_time,
        course_id,
        created_by,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /task/:id - Delete a task
taskRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
