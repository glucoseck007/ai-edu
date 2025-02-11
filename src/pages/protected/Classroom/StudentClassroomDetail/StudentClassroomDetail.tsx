import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import LoadingLink from "../../../../components/common/links/LoadingLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./classroom-detail.css";

function StudentClassroomDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [classroomData, setClassroomData] = useState(
    location.state?.classroomData
  );
  const [id, setId] = useState<string>("");

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

  if (!classroomData) {
    return <p>Loading classroom details...</p>;
  }

  const handleDownload = async (contentId: string, fileName: string) => {
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
      <div className="classroom-detail-header">
        <div className="cluster-header">
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ marginBottom: "20px" }}
            onClick={() => navigate(-1)}
          />
          <h1 style={{ marginBottom: "20px", marginLeft: "20px" }}>
            Hoạt động lớp học {classroomData.name}
          </h1>
        </div>
        <div>
          <LoadingLink
            className="upload-button"
            to={`/upload?classroomId=${id}`}
          >
            <FontAwesomeIcon icon={faUpload} />
            <span className="description">Tải tài liệu lên</span>
          </LoadingLink>
        </div>
      </div>

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
                        style={{ color: "blue" }}
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
    </>
  );
}

export default StudentClassroomDetail;
