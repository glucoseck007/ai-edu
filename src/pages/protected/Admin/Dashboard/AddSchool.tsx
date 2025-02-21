import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table, Alert } from "react-bootstrap";

interface School {
  id: string;
  schoolCode: string;
  schoolName: string;
}

const AddSchool: React.FC = () => {
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch schools from API
  const fetchSchools = async () => {
    try {
      const response = await axios.get<{ content: School[] }>(
        `${import.meta.env.VITE_API}/school/list`
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

    if (!schoolCode || !schoolName) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API}/school/add_school`, {
        school_code: schoolCode,
        school_name: schoolName,
      });

      setSuccessMessage("School added successfully!");
      setSchoolCode("");
      setSchoolName("");
      fetchSchools(); // Refresh school list
    } catch (err) {
      setError("Failed to add school.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add School</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>School Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter school code"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>School Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter school name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add School
        </Button>
      </Form>

      <div className="mt-4">
        <h3>Schools List</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>School Code</th>
              <th>School Name</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.id}>
                <td>{school.school_code}</td>
                <td>{school.school_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AddSchool;
