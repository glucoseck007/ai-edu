import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import LoadingLink from "../../../../components/common/links/LoadingLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faArrowLeft,
  faUser,
  faClock,
  faCalendarAlt,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./classroom-detail.css";
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";

interface Material {
  id: string;
  name: string;
  type: string;
}

interface Teacher {
  name: string;
  avatar: string;
}

interface ClassroomContent {
  id: string;
  title: string;
  content: string;
  fileName: string;
  teacher: Teacher;
  createdAt: string;
  deadline: string;
  materials: Material[];
  maxPoints: number;
  topics: string[];
  instructions: string;
}

function StudentClassroomDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [classroomData, setClassroomData] = useState([]);
  const [id, setId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
  }, []);

  const handleDownload = async (contentId: string, fileName: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classroom/download/${contentId}`,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="classroom-detail-header">
        <div className="cluster-header">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ marginBottom: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1 style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Hoạt động lớp học
          </h1>
        </div>
      </div>

      <Container className="px-0">
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
          </>
        )}
      </Modal>
    </>
  );
}

export default StudentClassroomDetail;
