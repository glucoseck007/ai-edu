import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";
import { BookOpen, Star, Award, Trophy } from "lucide-react";
import "./StudentProfile.scss";

const StudentProfile = () => {
    const student = {
        name: "Sarah Smith",
        grade: "Grade 3",
        stars: 45,
        subjects: [
            { id: 1, title: "Math Adventures", progress: 75, totalLessons: 20, completedLessons: 15 },
            { id: 2, title: "Reading Fun", progress: 40, totalLessons: 15, completedLessons: 6 },
            { id: 3, title: "Science Discovery", progress: 90, totalLessons: 12, completedLessons: 11 }
        ],
        achievements: [
            { id: 1, title: "Math Master", icon: <Trophy size={24} className="achievement-icon gold" /> },
            { id: 2, title: "Reading Star", icon: <Star size={24} className="achievement-icon purple" /> },
            { id: 3, title: "Science Whiz", icon: <Award size={24} className="achievement-icon blue" /> }
        ]
    };

    return (
        <Container className="py-4">
            {/* Header Card */}
            <Card className="profile-header mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <div className="position-relative">
                                <img
                                    src="/api/placeholder/120/120"
                                    alt="Student avatar"
                                    className="rounded-circle student-avatar"
                                />
                                <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 star-badge">
                                    <Star size={16} className="me-1" />
                                    {student.stars}
                                </Badge>
                            </div>
                        </Col>
                        <Col>
                            <h1 className="student-name">{student.name}</h1>
                            <p className="student-grade mb-0">{student.grade}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Subjects Progress */}
            <div className="mb-4">
                <h2 className="section-title">
                    <BookOpen size={24} className="me-2" />
                    My Learning Journey
                </h2>
                {student.subjects.map((subject) => (
                    <Card key={subject.id} className="mb-3 subject-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h3 className="subject-title">{subject.title}</h3>
                                <span className="lesson-count">
                                    {subject.completedLessons} of {subject.totalLessons} lessons
                                </span>
                            </div>
                            <ProgressBar
                                now={subject.progress}
                                variant="primary"
                                className="custom-progress"
                            />
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Achievements */}
            <div>
                <h2 className="section-title">
                    <Trophy size={24} className="me-2" />
                    My Achievements
                </h2>
                <Row xs={1} md={3} className="g-4">
                    {student.achievements.map((achievement) => (
                        <Col key={achievement.id}>
                            <Card className="achievement-card text-center">
                                <Card.Body>
                                    <div className="achievement-icon-wrapper mb-2">
                                        {achievement.icon}
                                    </div>
                                    <Card.Title className="achievement-title">
                                        {achievement.title}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default StudentProfile;