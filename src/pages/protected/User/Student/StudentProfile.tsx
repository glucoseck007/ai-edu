import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Tabs,
  Tab,
  Nav,
} from "react-bootstrap";
import { BookOpen, CheckCircle, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import "./StudentProfile.scss";
import { useNavigate } from "react-router-dom";
import StudentImg from "../../../../assets/images/student.jpg";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useState, useEffect } from "react";

const StudentProfile = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const accountId = auth.user?.id || "";
  const [testHistory, setTestHistory] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [profile, setProfile] = useState<any | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/accounts/${accountId}`
      );
      console.log("Check profile",response.data.result??"No response"); // Logs the fetched data to the console
      const profile = response.data.result;
      setProfile(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classroom/profile/list-class`,
        {
          params: {
            accountId: accountId,
          },
        }
      );
      const classrooms = response.data;
      setClassrooms(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      return [];
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/quiz/attempts/${accountId}`
      );
      const testHistory = response.data;
      // return testHistory;
      setTestHistory(testHistory);
    } catch (error) {
      console.error("Error fetching test history:", error);
    }
  };

  useEffect(() => {
    if (!accountId) return;
    fetchProfile();
    // console.log("Profile:", profile);
    fetchTestHistory();
    fetchClassrooms();
  }, [accountId]);

  const student = {
    name: profile?profile.firstName + " " + profile.lastName:"Null Data",
    // grade: "Lớp 1",
    classes: classrooms,
    testHistory: testHistory,
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
                  src={StudentImg}
                  alt="Student avatar"
                  className="rounded-circle student-avatar"
                />
              </div>
            </Col>
            <Col>
              <h1 className="student-name">{student.name}</h1>
              <p className="student-grade mb-0">{student.grade}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs Section */}
      <Tab.Container defaultActiveKey="classes">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="classes">
              <BookOpen size={20} className="me-2" />
              Lớp
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="test-history">
              <ClipboardList size={20} className="me-2" />
              Lịch sử thi
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Classes Tab */}
          <Tab.Pane eventKey="classes">
            <div className="mb-4">
              {student.classes.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="mb-3 class-card"
                  onClick={() => {
                    navigate(
                      `/student/class-detail?classroomId=${classItem.classId}&&classCode=${classItem.classCode}`
                    );
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="class-title">{classItem.title}</h5>
                      <p className="class-teacher">
                        Giáo Viên: {classItem.teacher}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Tab.Pane>

          {/* Test History Tab */}
          <Tab.Pane eventKey="test-history">
            <div>
              <Row xs={1} md={2} className="g-4">
                {student.testHistory.map((test) => (
                  <Col key={test.id}>
                    <Card className="test-history-card text-center">
                      <Card.Body>
                        <h4 className="test-subject">Môn: {test.subject}</h4>
                        <p className="test-name">
                          Tên bài thi: {test.testName}
                        </p>
                        <h5 className="test-score">Điểm: {test.score}%</h5>
                        <p className="test-date">
                          Ngày: {format(new Date(test.date), "MMMM dd, yyyy")}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default StudentProfile;
