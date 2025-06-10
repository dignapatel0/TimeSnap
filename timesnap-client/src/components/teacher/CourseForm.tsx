import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

type Props = {
  addCourse: (course: { title: string; code: string }) => void;
};

export const CourseForm = ({ addCourse }: Props) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse({ title, code });
    setTitle('');
    setCode('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h5>Add New Course</h5>
      <Form.Group className="mb-2">
        <Form.Label>Course Title</Form.Label>
        <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Course Code</Form.Label>
        <Form.Control value={code} onChange={e => setCode(e.target.value)} />
      </Form.Group>
      <Button type="submit" variant="primary">Create</Button>
    </Form>
  );
};
