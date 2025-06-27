import type { Course } from '../../types';
import { Button } from 'react-bootstrap';

type Props = {
  courses: Course[];
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
};

export const CourseList = ({ courses, onDelete, onSelect }: Props) => {
  return (
    <ul className="list-group">
      {courses.map(course => (
        <li
          key={course.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{course.title}</strong> — {course.course_code}
          </div>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              className="me-2"
              onClick={() => onSelect(course.id)}
            >
              View Timesheet
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(course.id)}
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
