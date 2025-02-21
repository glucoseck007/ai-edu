import {
  faFolderClosed,
  faPaperclip,
  faGear,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Dropdown, Modal, Row } from "react-bootstrap";
import axios from "axios";
import {
  Book,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Library,
} from "lucide-react";
import Compressor from "compressorjs";
import { PDFDocument } from "pdf-lib";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const UploadQuiz: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAction, setNotificationAction] = useState<(() => void) | null>(null);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const classroomId = query.get("classroomId");
  const navigate = useNavigate();

  const subjects = [
    { id: "math", name: "Toán học", icon: <Calculator /> },
    { id: "history", name: "Lịch sử", icon: <Landmark /> },
    { id: "english", name: "Tiếng Anh", icon: <Book /> },
    { id: "geography", name: "Địa lý", icon: <Globe /> },
    { id: "physics", name: "Khoa học", icon: <FlaskConical /> },
    { id: "literature", name: "Văn học", icon: <Library /> },
  ];

  const handleSubjectSelect = (subjectName: string) => {
    setSubject(subjectName);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Adjust compression quality
        success: (result) => {
          resolve(
            new File([result], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
          );
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  };

  const compressPDF = async (file: File): Promise<File> => {
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      pdfDoc.setTitle("Optimized PDF");
      pdfDoc.setAuthor("Your App");

      const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

      return new File([compressedPdfBytes], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("PDF compression error:", error);
      return file; // If error occurs, return original file
    }
  };

  const compressDOCX = async (file: File): Promise<File> => {
    try {
      const docBytes = await file.arrayBuffer();
      const zip = new PizZip(docBytes);
      const doc = new Docxtemplater(zip);

      // Remove unused metadata
      // doc.setOptions({ paragraphLoop: true, linebreaks: true });
      const compressedDocBytes = doc.getZip().generate({ type: "uint8array" });

      return new File([compressedDocBytes], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("DOCX compression error:", error);
      return file; // If error occurs, return original file
    }
  };

  const compressFile = async (file: File): Promise<File> => {
    if (file.type.startsWith("image/")) {
      return await compressImage(file);
    } else if (file.type === "application/pdf") {
      return await compressPDF(file);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await compressDOCX(file);
    }
    return file; // If file type is not supported, return original file
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setNotificationTitle("File Required");
      setNotificationMessage("Please select a file to upload.");
      setNotificationAction(null);
      setShowNotification(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    const compressedFile = await compressFile(selectedFile);
    formData.append("file", compressedFile);
    formData.append("classroomId", classroomId ?? "");
    formData.append("subject", subject);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AI_API}/upload_for_quiz`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully:", response.data);

      localStorage.setItem("quiz", JSON.stringify(response.data));
      localStorage.setItem("subject", subject);

      // Set notification modal for success and navigate after user clicks OK
      setNotificationTitle("Success");
      setNotificationMessage("File uploaded successfully.");
      setNotificationAction(() => {
        navigate("/teacher/review-test");
      });
      setShowNotification(true);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setNotificationTitle("Error");
      setNotificationMessage("There was an error uploading the file.");
      setNotificationAction(null);
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="exam-list">
      <Container>
        <Row className="mb-5 border-bottom pb-5">
          <Col lg={6}>
            <img src="/src/assets/images/exam/banner.webp" alt="Banner" />
          </Col>

          <Col lg={6} className="d-flex align-items-center">
            <div>
              <h3>
                <span className="text-yellow">Đăng</span> khung tài liệu cho đề
                thi
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Môn học</label>
                  <Dropdown>
                    <Dropdown.Toggle
                      style={{ backgroundColor: "rgb(45, 100, 159)" }}
                      id="dropdown-basic"
                    >
                      {subject ? (
                        <>
                          {subjects.find((s) => s.name === subject)?.icon}{" "}
                          &nbsp;
                          {subjects.find((s) => s.name === subject)?.name}
                        </>
                      ) : (
                        "Chọn môn học"
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {subjects.map((subj) => (
                        <Dropdown.Item
                          key={subj.id}
                          onClick={() => handleSubjectSelect(subj.name)}
                        >
                          {subj.icon} &nbsp; {subj.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <Dropdown>
                  <Dropdown.Toggle
                    style={{ backgroundColor: "rgb(45, 100, 159)" }}
                    id="dropdown-basic"
                  >
                    <FontAwesomeIcon icon={faPaperclip} className="me-2" />
                    Chọn Tệp
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleFileSelect}>
                      <FontAwesomeIcon icon={faFolderClosed} className="me-2" />
                      Tải tệp lên
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                      <FontAwesomeIcon icon={faGoogleDrive} className="me-2" />
                      Google Drive
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                      <FontAwesomeIcon icon={faGear} className="me-2" />
                      Thêm thủ công
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                {selectedFile && (
                  <div className="mt-3">
                    <div className="d-flex align-items-center">
                      <span>{selectedFile.name}</span>
                      <Button
                        variant="link"
                        className="ms-2"
                        onClick={handleRemoveFile}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  style={{ backgroundColor: "rgb(45, 100, 159)" }}
                  type="submit"
                  className="mt-3"
                  disabled={!selectedFile || isSubmitting}
                >
                  Tải Lên
                </Button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={isSubmitting} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Uploading File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please wait while your file is being uploaded...
        </Modal.Body>
      </Modal>
      <Modal
        show={showNotification}
        onHide={() => {
          setShowNotification(false);
          if (notificationAction) {
            notificationAction();
          }
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{notificationTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{notificationMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowNotification(false);
              if (notificationAction) {
                notificationAction();
              }
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default UploadQuiz;
