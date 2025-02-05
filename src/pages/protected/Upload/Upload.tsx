import {
  faEye,
  faFolderClosed,
  faGear,
  faPaperclip,
  faPen,
  faTimes, // Icon for removing file
} from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "flag-icons/css/flag-icons.min.css";
import React, { useRef, useState } from "react";

import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import axios from "axios";

const Upload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Track selected file

  // Function to trigger file input
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the selected file
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null); // Remove the selected file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value to allow re-selection
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully:", response.data);
      alert("File uploaded successfully.");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file.");
    }
  };

  return (
    <section id="exam-list">
      <Container>
        <Row className="row first-row mb-5 border-bottom pb-5">
          <Col lg={6} className="col-lg-6">
            <div className="singel-blog ">
              <div className="blog-thum">
                <img src="/src/assets/images/exam/banner.webp" alt="Blog" />
              </div>
            </div>
          </Col>
          <Col lg={6} className="col-lg-6 d-flex align-items-center">
            <div className="blog-cont">
              <div className="mb-4">
                <h3 className="m-0">
                  <span className="text-yellow">Đăng</span> tài liệu cho lớp học
                </h3>
              </div>

              <p className="mb-4">
                Lorem ipsum gravida nibh vel velit auctor aliquetn
                sollicitudirem quibibendum auci elit cons equat ipsutis sem
              </p>
              <Dropdown>
                <Dropdown.Toggle
                  variant="primary"
                  id="dropdown-basic"
                  size="lg"
                  className="px- py-3 rounded-4"
                >
                  <FontAwesomeIcon icon={faPaperclip} className="me-4" />
                  <span className="fw-semibold me-3"> Select File</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleFileSelect}>
                    <span className="fs-5">
                      <FontAwesomeIcon icon={faFolderClosed} /> <input type="file"  />
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    <span className="fs-5">
                      <FontAwesomeIcon icon={faPaperclip} /> By URL
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    <span className="fs-5">
                      <FontAwesomeIcon icon={faGoogleDrive} /> From Google Drive
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    <span className="fs-5">
                      <FontAwesomeIcon icon={faGear} /> Add manually
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Hidden file input for file selection */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Display selected file details if any */}
              {selectedFile && (
                <div className="mt-4">
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
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Upload;
