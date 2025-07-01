import { Router } from 'express';
import prisma from '../utils/prisma-client';
import ExcelJS from 'exceljs';

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

// Export completed tasks as Excel file
taskRouter.get('/export/:studentId/:courseId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const courseId = parseInt(req.params.courseId);

  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!student || !course) {
      return res.status(404).json({ error: 'Student or course not found' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        created_by: studentId,
        course_id: courseId,
      },
    });

    const formatTime = (totalMinutes: number) => {
      const totalSeconds = totalMinutes * 60;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${course.title}_${course.course_code}`);

    // Add headers
    worksheet.addRow([
      'Task Title',
      'Estimated Time (hh:mm:ss)',
      'Elapsed Time (hh:mm:ss)',
      'Status',
    ]);

    // Add rows
    tasks.forEach(task => {
      const status = task.elapsed_time > 0 ? 'Done' : 'In Progress';

      worksheet.addRow([
        task.title,
        formatTime(task.estimated_time),
        formatTime(task.elapsed_time),
        status,
      ]);
    });

    // Auto column width
    worksheet.columns.forEach(col => (col.width = 30));

    // File name: Digna_Patel_Timesheet.xlsx
    const filename = `${student.name.replace(/\s+/g, '_')}_Timesheet.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting timesheet:', err);
    res.status(500).json({ error: 'Failed to export timesheet' });
  }
});

