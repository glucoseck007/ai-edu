import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  Tabs,
  Tab,
  Table,
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import LoadingLink from "../../../../components/common/links/LoadingLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faArrowLeft,
  faUsers,
  faClock,
  faCalendarAlt,
  faFileAlt,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./classroom-detail.css";

function TeacherClassroomDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [classroomData, setClassroomData] = useState([]);
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const classroomId = urlParams.get("classroomId");
  const classroomCode = urlParams.get("classroomCode");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    classroomId: classroomId,
    title: "",
    content: "",
  });

  // Fetch Classroom Details
  useEffect(() => {
    const fetchClassroomDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const classroomId = urlParams.get("classroomId");
      if (classroomId) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API}/classroom-content/classroom`,
            { params: { classroomId: classroomId } }
          );
          setClassroomData(response.data);
        } catch (error) {
          console.error("Error fetching classroom details:", error);
        }
      }
    };

    fetchClassroomDetails();
  }, [classroomId]);

  // Fetch Students List
  useEffect(() => {
    const fetchStudents = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const classroomId = urlParams.get("classroomId");
      setId(classroomId || "mock-id");

      if (classroomId) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API}/classroom/members/${classroomCode}`
          );
          setStudents(response.data); // Directly store fetched data
        } catch (error) {
          console.error("Error fetching student list:", error);
        }
      }
    };

    fetchStudents();
  }, []);

  // File Download Handler
  const handleDownload = async (contentId, fileName) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classroom-content/download/${contentId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "downloaded_file");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download the file.");
    }
  };

  // Format Date to Vietnamese
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle Add Assignment
  const handleAddAssignment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/classroom-content/assign-assignment`,
        newAssignment
      );

      // Update classroomData locally to reflect the new assignment
      setClassroomData((prevData) => [...prevData, response.data]);

      // Reset form and close modal
      setNewAssignment((prev) => ({
        ...prev,
        title: "",
        content: "",
      }));
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="classroom-detail-header">
        <div className="cluster-header">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ marginBottom: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1 style={{ marginBottom: "20px", marginLeft: "20px" }}>Lớp học</h1>
        </div>
        <div></div>
      </div>

      <Container>
        {/* Tab Navigation */}
        <Tabs
          defaultActiveKey="classroom-data"
          id="classroom-tabs"
          className="mb-4"
        >
          {/* Classroom Tab */}
          <Tab eventKey="classroom-data" title="Lớp học">
            <Container className="px-0">
              <Row className="mb-4 align-items-center">
                <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
                  <Button
                    variant="primary"
                    style={{
                      backgroundColor: "#07294d",
                      border: "none",
                      padding: "0.5rem 1rem",
                      fontWeight: "500",
                    }}
                    onClick={() => setShowAddModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Thêm thông báo
                  </Button>
                </Col>
                <Col xs={12} sm="auto">
                  <LoadingLink
                    className="btn btn-secondary"
                    to={`/upload?classroomId=${id}&&classroomCode=${classroomCode}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Tải tài liệu cho AI</span>
                  </LoadingLink>
                </Col>
              </Row>

              <Row>
                <Col>
                  {classroomData.map((assignment) => (
                    <Card
                      key={assignment.id}
                      className="mb-3 shadow-sm"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowModal(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Header className="bg-light">
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="me-2 text-primary"
                          />
                          <span className="fw-medium">
                            Giáo viên đã thêm một thông báo mới
                          </span>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Card.Title className="mb-3">
                          Tiêu đề: {assignment.title}
                        </Card.Title>
                        <Card.Text className="mb-3">
                          <strong>Nội dung:</strong> {assignment.content}
                        </Card.Text>
                        <div className="text-muted small">
                          <div className="mb-2">
                            <FontAwesomeIcon icon={faClock} className="me-2" />
                            Thời gian đăng: {formatDate(assignment.createdDate)}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
              </Row>
            </Container>
          </Tab>

          {/* Students Tab */}
          <Tab eventKey="students" title="Danh sách học sinh">
            <Container className="px-0">
              <div className="students-list-container">
                {students.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>#</th>
                        <th style={{ width: "10%" }}>Tên học sinh</th>
                        <th style={{ width: "10%" }}>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={student.accountId}>
                          <td>{index + 1}</td>
                          <td>{`${student.firstName} ${student.lastName}`}</td>
                          <td>{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>Không có học sinh trong lớp này.</p>
                )}
              </div>
            </Container>
          </Tab>
        </Tabs>
      </Container>

      {/* Assignment Detail Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        aria-labelledby="assignment-modal"
      >
        {selectedAssignment && (
          <>
            <Modal.Header closeButton>
              <Modal.Title id="assignment-modal">
                {selectedAssignment.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <strong>Nội dung: </strong>
                <span>{selectedAssignment.content}</span>
              </div>
              <div className="mb-3">
                <strong>Thời gian đăng:</strong>{" "}
                {formatDate(selectedAssignment?.createdDate)}
              </div>
              
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Add Assignment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm bài tập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    content: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddAssignment}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TeacherClassroomDetail;
