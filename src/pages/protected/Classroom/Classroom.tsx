import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import "./classroom.css";

type Classroom = {
  id: string;
  name: string;
  section: string;
};

const Classroom = () => {
  const [classes, setClasses] = useState<Classroom[]>([]);

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/classroom/list_classes`
        );
        setClasses(response.data);
      } catch (error) {
        console.error("There was an error fetching the classes!", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="classroom-container">
      <h1 className="header-classroom text-2xl font-bold">Lớp học của bạn</h1>

      <Container>
        <Row>
          {classes.map((classroom) => (
            <Col key={classroom.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{classroom.name}</Card.Title>
                  <Card.Text>
                    {classroom.section || "Thông tin lớp học."}
                  </Card.Text>
                  <Button variant="primary">Xem chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Classroom;
