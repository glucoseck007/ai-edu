import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge, Button, ListGroup, Tab, Nav } from "react-bootstrap";
import { Users, BookOpen, Calendar, Award, Bell, BarChart2, Clock } from "lucide-react";
import "./TeacherProfile.scss";

const TeacherProfile = () => {
    const instructor = {
        name: "Mrs. Emily Johnson",
        subject: "Primary Education",
        yearsExperience: 8,
        totalStudents: 25,
        upcomingClasses: [
            { id: 1, title: "Mathematics", time: "09:00 AM", grade: "Grade 3", studentsCount: 22 },
            { id: 2, title: "Reading", time: "10:30 AM", grade: "Grade 3", studentsCount: 23 },
            { id: 3, title: "Science", time: "01:00 PM", grade: "Grade 3", studentsCount: 21 }
        ],
        classPerformance: [
            { subject: "Mathematics", averageScore: 85, improvement: "+5%" },
            { subject: "Reading", averageScore: 78, improvement: "+3%" },
            { subject: "Science", averageScore: 82, improvement: "+4%" }
        ],
        notifications: [
            { id: 1, type: "assignment", message: "New homework submissions to review", time: "1 hour ago" },
            { id: 2, type: "message", message: "Parent meeting scheduled for tomorrow", time: "2 hours ago" },
            { id: 3, type: "alert", message: "Weekly progress reports due", time: "3 hours ago" }
        ]
    };

    return (
        <Container className="py-4">
            {/* Instructor Header */}
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
                    <Tab.Container defaultActiveKey="schedule">
                        <Card className="mb-4">
                            <Card.Header>
                                <Nav variant="tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="schedule">
                                            <Calendar size={16} className="me-1" />
                                            Today's Schedule
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="performance">
                                            <BarChart2 size={16} className="me-1" />
                                            Class Performance
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Content>
                                    <Tab.Pane eventKey="schedule">
                                        <ListGroup variant="flush">
                                            {instructor.upcomingClasses.map((class_) => (
                                                <ListGroup.Item key={class_.id} className="class-item">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h5 className="mb-1">{class_.title}</h5>
                                                            <p className="mb-0 text-muted">
                                                                <Clock size={14} className="me-1" />
                                                                {class_.time} - {class_.grade}
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
                                    <Tab.Pane eventKey="performance">
                                        {instructor.classPerformance.map((performance) => (
                                            <div key={performance.subject} className="mb-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>{performance.subject}</span>
                                                    <span className="text-success">{performance.improvement}</span>
                                                </div>
                                                <ProgressBar
                                                    now={performance.averageScore}
                                                    label={`${performance.averageScore}%`}
                                                    variant="success"
                                                    className="custom-progress"
                                                />
                                            </div>
                                        ))}
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