import type { Course } from '../../types';
import { Button } from 'react-bootstrap';

type Props = {
  courses: Course[];
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  onEdit: (course: Course) => void;
};

export const CourseList = ({ courses, onDelete, onSelect, onEdit }: Props) => {
  return (
    <ul className="list-group">
      {courses.map(course => (
        <li
          key={course.id}
          className="list-group-item text-center"
          style={{ padding: '1.5rem' }}
        >
          <div className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
            {course.title} — {course.course_code}
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onSelect(course.id)}
            >
              <i className="bi bi-clock-history me-1"></i> Timesheet
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onEdit(course)}
            >
              <i className="bi bi-pencil-square me-1"></i> Edit
            </Button>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(course.id)}
            >
              <i className="bi bi-trash me-1"></i> Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
