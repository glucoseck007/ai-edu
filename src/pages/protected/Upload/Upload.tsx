import {
  faFolderClosed,
  faPaperclip,
  faGear,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Row,
  Modal,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import Compressor from "compressorjs";
import { PDFDocument } from "pdf-lib";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import axios from "axios";

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for notification modal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAction, setNotificationAction] = useState<
    (() => void) | null
  >(null);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  console.log(query);
  // const classroomId = query.get("classroomId");
  const classroomCode = query.get("classroomCode");
  const auth = useSelector((state: RootState) => state.auth);
  const teacher_code = auth.user?.id.substring(0, 5);

  const school_code = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classroom/school_code`,
        { params: { classroomCode } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching school code:", error);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

    // Compress the file if needed
    const compressedFile = await compressFile(selectedFile);

    // Fetch the school code first
    const schoolCode = await school_code();
    if (!schoolCode) {
      setIsSubmitting(false);
      setNotificationTitle("Error");
      setNotificationMessage("Failed to retrieve school code.");
      setNotificationAction(null);
      setShowNotification(true);
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", compressedFile); // The file
    formData.append("document_name", selectedFile.name); // Document name
    formData.append("description", description);
    formData.append("school_code", schoolCode);
    formData.append("class_name", classroomCode || ""); // Using classroomCode for class_name
    formData.append("subject", subject);
    formData.append("teacher_code", teacher_code);
    formData.append("upload_date", new Date().toISOString());

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AI_API}/upload_for_chatbot`,
        formData
      );

      console.log("File uploaded successfully:", response.data);
      // Show notification modal for success
      setNotificationTitle("Success");
      setNotificationMessage("File uploaded successfully.");
      setNotificationAction(() => {
        setSelectedFile(null);
      });
      setShowNotification(true);
    } catch (error: any) {
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
      setNotificationTitle("Error");
      setNotificationMessage(
        "Error: " +
          (error.response?.data?.detail || "File upload failed.")
      );
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
                <span className="text-yellow">Đăng</span> tài liệu cho lớp học
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Tiêu đề</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Miêu tả</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Môn học</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
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
                      <FontAwesomeIcon
                        icon={faFolderClosed}
                        className="me-2"
                      />
                      Tải tệp lên
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                      <FontAwesomeIcon
                        icon={faGoogleDrive}
                        className="me-2"
                      />
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
                  disabled={!selectedFile}
                >
                  Tải Lên
                </Button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal shown during file upload */}
      <Modal show={isSubmitting} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Uploading File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please wait while your file is being uploaded...
        </Modal.Body>
      </Modal>

      {/* Notification Modal */}
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

export default Upload;
