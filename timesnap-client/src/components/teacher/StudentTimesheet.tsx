type Props = {
  courseId: number;
};

export const StudentTimesheet = ({ courseId }: Props) => {
  const students = [
    {
      id: 1,
      name: 'John Doe',
      tasks: [
        { title: 'Navbar UI', actualTime: 45 },
        { title: 'Fix bugs', actualTime: 30 },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      tasks: [
        { title: 'Wireframe Design', actualTime: 60 },
      ],
    },
  ]; // TODO: Replace with API

  return (
    <div>
      <h5>Students in Course #{courseId}</h5>
      {students.map(student => (
        <div key={student.id} className="mb-3">
          <strong>{student.name}</strong>
          <ul>
            {student.tasks.map((task, idx) => (
              <li key={idx}>
                {task.title} – {task.actualTime} min
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
