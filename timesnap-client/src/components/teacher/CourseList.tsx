type Props = {
  courses: { id: number; title: string; code: string }[];
  setSelectedCourseId: (id: number) => void;
};

export const CourseList = ({ courses, setSelectedCourseId }: Props) => {
  return (
    <div className="mb-4">
      <h5>Courses</h5>
      {courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul className="list-group">
          {courses.map(course => (
            <li
              key={course.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{course.title} ({course.code})</span>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => setSelectedCourseId(course.id)}
              >
                View Students
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
