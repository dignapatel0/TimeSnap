import axios from 'axios';

export const TimesheetExport = ({ studentId }: any) => {
  const exportCSV = async () => {
    const res = await axios.get(`/api/tasks/export/${studentId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timesheet.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <button onClick={exportCSV} className="btn btn-outline-secondary mt-3">
      Export Timesheet
    </button>
  );
};
