import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Tabs, Tab, Nav } from "react-bootstrap";
import LoadingLink from "../../../../components/common/links/LoadingLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faArrowLeft, faUsers } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./classroom-detail.css";

function TeacherClassroomDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [classroomData, setClassroomData] = useState(location.state?.classroomData);
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    console.log("Classroom Data:", classroomData);
    const fetchClassroomDetails = async () => {
      if (!classroomData) {
        const urlParams = new URLSearchParams(window.location.search);
        const classroomId = urlParams.get("classroomId");
        console.log("Classroom ID:", classroomId);

        if (classroomId) {
          setId(classroomId);
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API}/classroom-content/classroom`,
              {
                params: { classroomId: classroomId },
              }
            );
            setClassroomData(response.data);
          } catch (error) {
            console.error("Error fetching classroom details:", error);
          }
        }
      }
    };

    fetchClassroomDetails();
  }, [classroomData]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API}/classroom-content/students`,
            { params: { classroomId: id } }
          );
          setStudents(response.data);
        } catch (error) {
          console.error("Error fetching student list:", error);
        }
      }
    };

    fetchStudents();
  }, [id]);

  if (!classroomData) {
    return <p>Loading classroom details...</p>;
  }

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

  return (
    <>
      {/* Header */}
      <div className="classroom-detail-header">
        <div className="cluster-header">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ marginBottom: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <h1 style={{ marginBottom: "20px", marginLeft: "20px" }}>
             {classroomData.name}
          </h1>
        </div>
        <div>
          <LoadingLink className="upload-button" to={`/upload?classroomId=${id}`}>
            <FontAwesomeIcon icon={faUpload} />
            <span className="description">Tải tài liệu lên</span>
          </LoadingLink>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultActiveKey="classroom-data" id="classroom-tabs" className="mb-3">
        <Tab eventKey="classroom-data" title="Classroom Data">
          <Tab.Pane eventKey="classroom-data">
            <div className="classroom-detail-container">
              {classroomData.map((classroom, index) => (
                <div className="card-holder" key={index}>
                  <Card className="mb-3">
                    <Card.Header>{classroom.title}</Card.Header>
                    <Card.Body>
                      <blockquote className="blockquote mb-0">
                        <p>
                          <strong>Mô tả:</strong>{" "}
                          {classroom.content || "Không có mô tả."}
                        </p>
                        <p>
                          <strong>Tài liệu đính kèm:</strong>{" "}
                          {classroom.fileName ? (
                            <a
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleDownload(classroom.id, classroom.fileName);
                              }}
                            >
                              {classroom.fileName}
                            </a>
                          ) : (
                            "Không có tài liệu đính kèm."
                          )}
                        </p>
                        <footer className="blockquote-footer">
                          Cập nhật lần cuối:{" "}
                          <cite title="Last Modified">
                            {classroom.modifiedAt || "Không xác định"}
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Tab.Pane>
        </Tab>

        <Tab eventKey="students" title="Students">
          <Tab.Pane eventKey="students">
            <div className="students-list-container">
              <h2><FontAwesomeIcon icon={faUsers} className="me-2" />Danh sách học sinh</h2>
              {students.length > 0 ? (
                <ul className="students-list">
                  {students.map((student, index) => (
                    <li key={index} className="student-item">
                      {student.name} - {student.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có học sinh trong lớp này.</p>
              )}
            </div>
          </Tab.Pane>
        </Tab>
      </Tabs>
    </>
  );
}

export default TeacherClassroomDetail;
