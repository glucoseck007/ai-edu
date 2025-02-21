import React, { useCallback, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ListGroup,
  Tab,
  Nav,
} from "react-bootstrap";
import { Users, BookOpen, Calendar, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TeacherProfile.scss";
import TeacherImg from "../../../../assets/images/teacher.jpg";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (id, classCode) =>
      navigate(
        `/teacher/class-detail?classroomId=${id}&&classCode=${classCode}`
      ),
    [navigate]
  );
  const auth = useSelector((state: RootState) => state.auth);
  const accountId = auth.user?.id || "";
  const [testHistory, setTestHistory] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [school, setSchool] = useState("");
  const [profile, setProfile] = useState<any | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/accounts/${accountId}`
      );
      console.log(response.data); // Logs the fetched data to the console
      const profile = response.data.result;
      setProfile(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classroom/profile/list-class-teacher`,
        {
          params: {
            accountId: accountId,
          },
        }
      );
      const classrooms = response.data;
      setSchool(classrooms[0].schoolName);
      setClassrooms(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      return [];
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/quiz/account/${accountId}`
      );
      const testHistory = response.data;
      // return testHistory;
      setTestHistory(testHistory);
    } catch (error) {
      console.error("Error fetching test history:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchClassrooms();
    fetchTestHistory();
  }, []);

  const instructor = {
    name: profile?.firstName + " " + profile?.lastName,
    school: school,
    yearsExperience: 8,
    totalStudents: 25,
    classes: classrooms,
    tests: testHistory,
    recent_class: classrooms.map((classroom, index) => ({
      id: classroom.id, // or use index if id is missing
      name: classroom.title, // assuming title is the class name
      time: classroom.updatedAt
        ? new Date(classroom.updatedAt).toLocaleDateString()
        : "N/A",
    }))
  };

  return (
    <Container className="py-4">
      <Card className="instructor-header mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs="auto">
              <img
                src={TeacherImg}
                alt="Instructor avatar"
                className="rounded-circle instructor-avatar"
              />
            </Col>
            <Col>
              <h1 className="instructor-name">{instructor.name}</h1>
              <p className="instructor-subject mb-2">{instructor.school}</p>
              <Badge bg="info" className="stats-badge">
                <BookOpen size={16} className="me-1" />
                {instructor.yearsExperience} năm kinh nghiệm
              </Badge>
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
                      <Calendar size={16} className="me-1" /> Lớp
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tests">
                      <BarChart2 size={16} className="me-1" /> Danh sách bài thi
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="classes">
                    <ListGroup variant="flush">
                      {instructor.classes.map((class_) => (
                        <ListGroup.Item
                          key={class_.id}
                          className="class-item"
                          onClick={() =>
                            handleNavigate(class_.id, class_.classCode)
                          }
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="mb-1">{class_.title}</h5>
                              <p className="mb-0 text-muted">
                                Lớp {class_.grade}
                              </p>
                            </div>
                            <Badge bg="secondary">
                              <Users size={14} className="me-1" />{" "}
                              {class_.studentsCount} Học sinh
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
                          <Card
                            className="test-card"
                            onClick={() =>
                              navigate(`/teacher/test-result/${test.id}`)
                            }
                          >
                            <Card.Body>
                              <h5 className="test-title">{test.subject}</h5>
                              <p className="test-description">
                                {test.description}
                              </p>
                              <p className="test-date text-muted">
                                Ngày: {test.date}
                              </p>
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
              <h5 className="mb-0">Các lớp học gần đây</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {instructor.recent_class.map((notif) => (
                <ListGroup.Item key={notif.id} className="class-item">
                  <p className="mb-1">{notif.name}</p>
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
