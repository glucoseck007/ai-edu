import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge, Button, ListGroup, Tab, Nav } from "react-bootstrap";
import { Users, BookOpen, Calendar, Award, Bell, BarChart2, Clock } from "lucide-react";
import "./TeacherProfile.scss";
import { useNavigate } from "react-router-dom";

const TeacherProfile = () => {
    const navigate = useNavigate();
    const instructor = {
        name: "Mrs. Emily Johnson",
        subject: "Primary Education",
        yearsExperience: 8,
        totalStudents: 25,
        classes: [
            { id: 1, title: "Mathematics", time: "09:00 AM", grade: "Grade 3", studentsCount: 22 },
            { id: 2, title: "Reading", time: "10:30 AM", grade: "Grade 3", studentsCount: 23 },
            { id: 3, title: "Science", time: "01:00 PM", grade: "Grade 3", studentsCount: 21 }
        ],
        tests: [
            { id: 1, subject: "Mathematics", description: "Algebra and Geometry test", date: "Feb 15, 2025" },
            { id: 2, subject: "Reading", description: "Comprehension and Analysis test", date: "Feb 20, 2025" },
            { id: 3, subject: "Science", description: "Physics and Chemistry test", date: "Feb 25, 2025" }
        ],
        notifications: [
            { id: 1, type: "assignment", message: "New homework submissions to review", time: "1 hour ago" },
            { id: 2, type: "message", message: "Parent meeting scheduled for tomorrow", time: "2 hours ago" },
            { id: 3, type: "alert", message: "Weekly progress reports due", time: "3 hours ago" }
        ]
    };

    return (
        <Container className="py-4">
            <Card className="instructor-header mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <img
                                src="/api/placeholder/120/120"
                                alt="Instructor avatar"
                                className="rounded-circle instructor-avatar"
                            />
                        </Col>
                        <Col>
                            <h1 className="instructor-name">{instructor.name}</h1>
                            <p className="instructor-subject mb-2">{instructor.subject}</p>
                            <div className="d-flex gap-3">
                                <Badge bg="primary" className="stats-badge">
                                    <Users size={16} className="me-1" />
                                    {instructor.totalStudents} Students
                                </Badge>
                                <Badge bg="info" className="stats-badge">
                                    <BookOpen size={16} className="me-1" />
                                    {instructor.yearsExperience} Years Experience
                                </Badge>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                <Col lg={8}>
                    <Tab.Container defaultActiveKey="classes">
                        <Card className="mb-4">
                            <Card.Header>
                                <Nav variant="tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="classes">
                                            <Calendar size={16} className="me-1" />
                                            Classes
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="tests">
                                            <BarChart2 size={16} className="me-1" />
                                            Test List
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="classes">
                                        <ListGroup variant="flush">
                                            {instructor.classes.map((class_) => (
                                                <ListGroup.Item key={class_.id} className="class-item" onClick={() => { navigate(`/classroom/classroom-detail?classroomId=${class_.id}`); }}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h5 className="mb-1">{class_.title}</h5>
                                                            <p className="mb-0 text-muted">
                                                                {class_.grade}
                                                            </p>
                                                        </div>
                                                        <Badge bg="secondary">
                                                            <Users size={14} className="me-1" />
                                                            {class_.studentsCount} Students
                                                        </Badge>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="tests">
                                        <Row>
                                            {instructor.tests.map((test) => (
                                                <Col md={6} key={test.id} className="mb-3">
                                                    <Card className="test-card">
                                                        <Card.Body>
                                                            <h5 className="test-title">{test.subject}</h5>
                                                            <p className="test-description">{test.description}</p>
                                                            <p className="test-date text-muted">Date: {test.date}</p>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>

                <Col lg={4}>
                    <Card className="notifications-card">
                        <Card.Header>
                            <h5 className="mb-0">
                                <Bell size={16} className="me-2" />
                                Recent Notifications
                            </h5>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {instructor.notifications.map((notification) => (
                                <ListGroup.Item key={notification.id} className="notification-item">
                                    <p className="mb-1">{notification.message}</p>
                                    <small className="text-muted">{notification.time}</small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TeacherProfile;
