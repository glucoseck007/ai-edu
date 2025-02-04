import {
  faEye,
  faFolderClosed,
  faGear,
  faPaperclip,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "flag-icons/css/flag-icons.min.css";
import React from "react";

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

const Upload: React.FC = () => {
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
                  <span className="text-yellow">Submit</span> your own exams
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
                  <Dropdown.Item href="#/action-1">
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
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Upload;
