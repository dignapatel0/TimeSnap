import { useTaskContext } from '../../context/TaskContext';
import Papa from 'papaparse';

type Props = {
  courseId: number;
  courseName: string;
};

export const ExportCSV = ({ courseId, courseName }: Props) => {
  const { tasks } = useTaskContext();

  const handleExport = () => {
    const courseTasks = tasks.filter(task => task.courseId === courseId);

    const csv = Papa.unparse(
      courseTasks.map(task => ({
        Title: task.title,
        'Estimated Time': `${task.estimatedTime} min`,
        'Actual Time': `${task.actualTime} sec`,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${courseName.replace(/\s+/g, '_')}_timesheet.csv`;
    link.click();
  };

  return (
    <div className="mb-3">
      <button className="btn btn-outline-primary" onClick={handleExport}>
        Export Timesheet as CSV
      </button>
    </div>
  );
};