import React from "react";
import "./classroom.css";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Classroom = () => {
  return (
    <div className="classroom-container">
      <h1 className="header-classroom text-2xl font-bold">Lớp học của bạn</h1>

      <Container>
        <Row>
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <Col key={id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Lớp học {id}</Card.Title>
                  <Card.Text>
                    Thông tin lớp học {id}. Đây là mô tả nhanh về lớp học này.
                  </Card.Text>
                  <Button variant="primary">Xem chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {/* 
        // <Card key={id} style={{ width: "18rem" }}>
        //   <Card.Body>
        //     <Card.Title>Lớp học {id}</Card.Title>
        //     <Card.Text>
        //       Thông tin lớp học {id}. Đây là mô tả nhanh về lớp học này.
        //     </Card.Text>
        //     <Button variant="primary">Xem chi tiết</Button>
        //   </Card.Body>
        // </Card> */}
    </div>
  );
};

export default Classroom;
