import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CustomButton from "../../../../components/common/button/custom-button/Custom-Button";

import "./testlist.css";

const TestList: React.FC = () => {
  const [tests] = useState([
    {
      id: 1,
      title: "Test 1",
      createdBy: "John Doe",
      totalTime: 60, // in minutes
      subject: "Mathematics",
      grade: "10",
    },
    {
      id: 2,
      title: "Test 2",
      createdBy: "Jane Smith",
      totalTime: 45,
      subject: "Physics",
      grade: "11",
    },
    {
      id: 3,
      title: "Test 3",
      createdBy: "Mike Johnson",
      totalTime: 90,
      subject: "Chemistry",
      grade: "12",
    },
  ]);
  const navigate = useNavigate();

  const handleCreateTest = () => {
    navigate("/upload-quiz");
  };

  return (
    <Container className="my-4">
      <div className="button-create-test">
        <CustomButton
          width="400px"
          height="31px"
          border="1px solid #1A61CF;"
          title="Tạo đề thi với AI"
          color="black"
          backgroundColor="transparent"
          icon="../src/assets/images/all-icon/lock.svg"
          onClick={handleCreateTest}
        />
      </div>

      <Row xs={1} md={3} className="g-4">
        {tests.map((test) => (
          <Col key={test.id}>
            <Card>
              <Card.Body>
                <Card.Title>{test.title}</Card.Title>
                <Card.Text>
                  <div className="mb-2">
                    <strong>Created by:</strong> {test.createdBy}
                  </div>
                  <div className="mb-2">
                    <strong>Total Time:</strong> {test.totalTime} minutes
                  </div>
                  <div className="mb-2">
                    <strong>Subject:</strong> {test.subject}
                  </div>
                  <div className="mb-2">
                    <strong>Grade:</strong> {test.grade}
                  </div>
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/test/${test.id}`)}
                >
                  Take Test
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TestList;
