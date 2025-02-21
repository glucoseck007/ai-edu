import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Alert } from "react-bootstrap";

interface Subject {
  id: string;
  schoolCode: string;
  subjectCode: string;
}

const AddSubject: React.FC = () => {
  const [schoolCode, setSchoolCode] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [schools, setSchools] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch schools from API
  const fetchSchools = async () => {
    try {
      const response = await axios.get<{ content: Subject[] }>(
        `${import.meta.env.VITE_API}/subject/list`
      );
      if (Array.isArray(response.data.content)) {
        console.log(response.data.content);
        setSchools(response.data.content);
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      setError("Failed to fetch schools.");
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!schoolCode || !subjectCode) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API}/subject/add_subject`, {
        school_code: schoolCode,
        subject_code: subjectCode,
      });

      setSuccessMessage("Subject added successfully!");
      setSchoolCode("");
      setSubjectCode("");
      fetchSchools(); // Refresh school list
    } catch (err) {
      setError("Failed to add subject.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Subject</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>School Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subject code"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subject name"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Subject
        </Button>
      </Form>

      <div className="mt-4">
        <h3>Subjects List</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>School Code</th>
              <th>Subject Name</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id}>
                <td>{school.school_code}</td>
                <td>{school.subject_code}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AddSubject;
