import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CustomButton from "../../../../components/common/button/custom-button/Custom-Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import axios from "axios";

import "./testlist.css";

const TestList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const id = auth.user?.id;
  const [loading, setLoading] = useState(false);

  // Initialize state as an empty array instead of a Promise
  const [tests, setTests] = useState<any[]>([]);
  const navigate = useNavigate();

  const isTeacher = auth.user?.roles.includes("teacher"); // Check if user is a teacher

  // Placeholder for classCode (you might need to fetch this)
  const [classCode, setClassCode] = useState<string | null>(null);

  useEffect(() => {
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
          console.warn("Class code is missing for student role.");
          return;
        }

        setTests(response.data); // Ensure response.data is an array
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id, isTeacher, classCode]); // Fetch tests when `id` changes

  const handleCreateTest = () => {
    navigate("/upload-quiz");
  };

  const handleAssignTest = (testId: string) => {
    const classCode = prompt("Nhập mã lớp để giao bài:"); // Lấy mã lớp từ người dùng
    if (!classCode) return; // Nếu không nhập thì dừng lại

    axios
      .post(
        `${import.meta.env.VITE_API}/quiz/assign-quiz`,
        {
          quizId: testId, // Match backend DTO field name
          classCode: classCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => alert("Giao bài thành công!"))
      .catch((error) => console.error("Lỗi khi giao bài:", error));
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
                    <div className="d-flex justify-content-betwween">
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
                          style={{ backgroundColor: "rgb(45, 100, 159)" }}
                          onClick={() => navigate(`/test/${test.id}`)}
                        >
                          Tham gia
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">Không có bài kiểm tra nào.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default TestList;
