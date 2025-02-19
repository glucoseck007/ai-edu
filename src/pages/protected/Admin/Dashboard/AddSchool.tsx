import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

const AddSchool: React.FC = () => {
    const [schoolCode, setSchoolCode] = useState('');
    const [schoolName, setSchoolName] = useState('');

    return (
        <div className="container mt-4">
            <h2>Add School</h2>
            <Form>
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
                <Table
                 striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>School Code</th>
                            <th>School Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>SCH001</td>
                            <td>Sample School</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default AddSchool;