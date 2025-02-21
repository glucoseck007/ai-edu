import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";
import CustomButton from "../../../../components/common/button/custom-button/Custom-Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import axios from "axios";

import "./testlist.scss";
import { SearchIcon } from "lucide-react";

const TestList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const id = auth.user?.id;
  const [loading, setLoading] = useState(false);

  // Initialize state as an empty array
  const [tests, setTests] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const isTeacher = auth.user?.roles.includes("teacher"); // Check if user is a teacher

  // Placeholder for classCode (you might need to fetch this)
  const [classCode, setClassCode] = useState<string | null>(null);

  // --- States for the assign test modal ---
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTestId, setAssignTestId] = useState<string | null>(null);
  const [assignClassCode, setAssignClassCode] = useState("");
  const [assignModalMessage, setAssignModalMessage] = useState<string | null>(null);

  const fetchTests = async () => {
    if (!id) return;

    setLoading(true);
    try {
      let response;
      if (isTeacher) {
        response = await axios.get(
          `${import.meta.env.VITE_API}/quiz/account/${id}`
        );
      } else if (classCode) {
        response = await axios.get(
          `${import.meta.env.VITE_API}/quiz/by-account-classCode`,
          { params: { accountId: id, classCode } }
        );
      } else {
        // Fallback: fetch classCodes and then tests
        const classCodes = await axios.get(
          `${import.meta.env.VITE_API}/classroom/classroomcode/${id}`
        );
        const body = classCodes.data;
        response = await axios.post(
          `${import.meta.env.VITE_API}/quiz/student/list-quiz`,
          { classCodes: body, accountId: id }
        );
      }

      setTests(response.data); // Ensure response.data is an array
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [id, isTeacher, classCode]); // Fetch tests when `id` changes

  const handleCreateTest = () => {
    navigate("/upload-quiz");
  };

  // Instead of prompt, we open a modal for assigning a test.
  const handleAssignTest = (testId: string) => {
    setAssignTestId(testId);
    setAssignClassCode("");
    setAssignModalMessage(null);
    setShowAssignModal(true);
  };

  // This function is called when the user confirms the class code in the modal.
  const handleConfirmAssignTest = async () => {
    if (!assignTestId || !assignClassCode) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/quiz/assign-quiz`,
        {
          quizId: assignTestId, // Match backend DTO field name
          classCode: assignClassCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setAssignModalMessage("Giao bài thành công!");
    } catch (error: any) {
      console.error("Lỗi khi giao bài:", error);
      setAssignModalMessage(
        "Lỗi khi giao bài: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEnterClassCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setClassCode(classCode ?? "");
    }
  };

  return (
    <div className="min-vh-100">
      <Container className="my-4">
        {auth.user?.roles[0] === "teacher" && (
          <div className="button-create-test">
            <CustomButton
              width="400px"
              height="31px"
              border="1px solid #1A61CF;"
              title="Tạo đề thi với AI"
              color="black"
              backgroundColor="transparent"
              icon="../src/assets/images/all-icon/lock.svg"
              onClick={handleCreateTest}
            />
          </div>
        )}

        <Row>
          <Col>
            <h1 className="text-center my-3">Danh sách bài kiểm tra</h1>
          </Col>
        </Row>

        <Row className="class-code-container mb-4">
          <Col md={6} className="mx-auto">
            <InputGroup className="class-code-input">
              <Form.Control
                type="text"
                placeholder="Nhập mã lớp học"
                value={classCode ?? ""}
                onChange={(e) => setClassCode(e.target.value)}
                onKeyDown={handleEnterClassCode}
              />
              <InputGroup.Text onClick={fetchTests} className="input-icon">
                <SearchIcon size={22} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        <Row xs={1} md={3} className="g-4">
          {tests.length > 0 ? (
            tests.map((test) => (
              <Col key={test.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{test.title}</Card.Title>
                    <Card.Text>
                      <div className="mb-2">
                        <strong>Thời gian:</strong> 60 phút
                      </div>
                      <div className="mb-2">
                        <strong>Môn học:</strong> {test.subject}
                      </div>
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      {auth.user?.roles[0] === "teacher" ? (
                        <>
                          <Button
                            className="me-2"
                            style={{
                              backgroundColor: "rgb(45, 100, 159)",
                            }}
                            onClick={() =>
                              navigate(`/teacher/test-review/${test.id}`)
                            }
                          >
                            Đánh giá
                          </Button>
                          <Button
                            style={{ backgroundColor: "rgb(45, 100, 159)" }}
                            onClick={() => handleAssignTest(test.id)}
                          >
                            Giao bài
                          </Button>
                        </>
                      ) : (
                        <Button
                          style={
                            test.completed
                              ? { backgroundColor: "green" }
                              : { backgroundColor: "rgb(45, 100, 159)" }
                          }
                          onClick={
                            () =>
                              test.completed
                                ? navigate(`/student/test-result/${test.id}`) // Navigate to history page
                                : navigate(`/test/${test.id}`) // Navigate to test page if not completed
                          }
                        >
                          {test.completed ? "Đã làm" : "Tham gia"}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No tests available</p>
          )}
        </Row>
      </Container>

      {/* Assign Test Modal */}
      <Modal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Giao bài</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {assignModalMessage ? (
            <p>{assignModalMessage}</p>
          ) : (
            <>
              <p>Nhập mã lớp để giao bài:</p>
              <Form.Control
                type="text"
                placeholder="Mã lớp"
                value={assignClassCode}
                onChange={(e) => setAssignClassCode(e.target.value)}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {assignModalMessage ? (
            <Button
              variant="primary"
              onClick={() => {
                setShowAssignModal(false);
                setAssignModalMessage(null);
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleConfirmAssignTest}>
                Xác nhận
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestList;
