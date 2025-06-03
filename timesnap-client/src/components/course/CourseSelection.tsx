import React from 'react';
import { Form } from 'react-bootstrap';

type Props = {
  setSelectedCourseId: (id: number) => void;
  setSelectedCourseName: (name: string) => void;
};

export const CourseSelection: React.FC<Props> = ({ setSelectedCourseId, setSelectedCourseName }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedCourseId(value);
    setSelectedCourseName(name);
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>Select a Course</Form.Label>
      <Form.Select onChange={handleChange} defaultValue="">
        <option value="">Choose a course</option>
        <option value="1">Web Development</option>
        <option value="2">UX Design</option>
      </Form.Select>
    </Form.Group>
  );
};
