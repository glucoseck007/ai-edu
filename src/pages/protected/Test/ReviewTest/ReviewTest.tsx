import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { numberToLetter } from "../../../../utils/Converters";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ToastComponent from "../../../../components/common/toast/Toast";

const ReviewTest: React.FC = () => {
  const storedData = JSON.parse(localStorage.getItem("quiz") || "{}");
  const quizData = Array.isArray(storedData.quiz) ? storedData.quiz : [];

  const [quizs, setQuizs] = useState(quizData);
  const [subject] = useState(localStorage.getItem("subject") || "");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editQuiz, setEditQuiz] = useState<any>({});
  const [editAnswer, setEditAnswer] = useState<{
    id: number | null;
    value: string;
  }>({ id: null, value: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [titleModal, setTitleModal] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState(storedData.title || "");
  const [newQuiz, setNewQuiz] = useState<any>({
    Title: "",
    "Question Type": "",
    Question: "",
    Answers: [],
    "Correct Answer": "",
    Reference: "",
  });

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastStatus, setToastStatus] = useState<
    "success" | "warning" | "error"
  >("success");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditQuiz(quizs[index]);
    setShowModal(true);
  };

  const handleAnswerChange = (index: number, newValue: string) => {
    setEditAnswer({ id: index, value: newValue });
  };

  const handleSaveAnswer = (index: number) => {
    const updatedQuiz = { ...editQuiz };
    if (updatedQuiz.Answers && Array.isArray(updatedQuiz.Answers)) {
      updatedQuiz.Answers[index] = editAnswer.value;
      setEditQuiz(updatedQuiz);
    }
    setEditAnswer({ id: null, value: "" });
  };

  const handleAddAnswer = () => {
    const updatedQuiz = { ...editQuiz };
    if (Array.isArray(updatedQuiz.Answers)) {
      updatedQuiz.Answers.push("");
    }
    setEditQuiz(updatedQuiz);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedQuizList = [...quizs];
      const updatedQuiz = { ...editQuiz };

      // Lọc bỏ các chuỗi rỗng trong mảng Answers
      updatedQuiz.Answers = updatedQuiz.Answers.filter(
        (answer: string) => answer !== ""
      );

      updatedQuizList[editIndex] = updatedQuiz;
      setQuizs(updatedQuizList);
      localStorage.setItem("quiz", JSON.stringify({ quiz: updatedQuizList }));
    }
    setShowModal(false);
  };

  const handleAddNewQuestion = () => {
    setShowAddModal(true);
  };

  const handleSaveNewQuestion = () => {
    if (!newQuiz.Question.trim()) {
      alert("Question cannot be empty");
      return;
    }

    if (newQuiz["Question Type"] === "TF") {
      setNewQuiz({ ...newQuiz, Answers: ["Có", "Không"] });
    } else if (
      newQuiz["Question Type"] === "MCQ" &&
      newQuiz.Answers.length < 2
    ) {
      alert("Multiple choice questions must have at least two answers");
      return;
    }

    if (!newQuiz["Correct Answer"].trim()) {
      alert("You must select a correct answer");
      return;
    }

    const updatedQuizList = [...quizs, newQuiz];
    setQuizs(updatedQuizList);
    localStorage.setItem("quiz", JSON.stringify({ quiz: updatedQuizList }));
    setShowAddModal(false);
    setNewQuiz({
      Title: "",
      "Question Type": "",
      Question: "",
      Answers: [],
      "Correct Answer": "",
      Reference: "",
    });
    setQuizTitle("");
  };

  const auth = useSelector((state: RootState) => state.auth);

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      alert("Quiz title cannot be empty!");
      return;
    }

    const quizDataToSave = {
      title: quizTitle,
      quiz: quizs,
      userId: auth.user?.id,
      subject,
    };

    localStorage.setItem("quiz", JSON.stringify(quizDataToSave));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/quiz/save`,
        quizDataToSave, // Ensure correct JSON format
        {
          headers: {
            "Content-Type": "application/json", // Set the correct content type
          },
        }
      );

      console.log("Response:", response.data);
      setToastStatus("success");
      setToastMessage("Add a new quiz successfully!");
      setShowToast(true);
    } catch (error: any) {
      console.error("Error:", error);
      setToastStatus("error");
      setToastMessage(
        error.message || "An error occurred while saving the quiz"
      );
      setShowToast(true);
    }
    setTitleModal(false);
  };

  return (
    <Container>
      <ToastComponent
        status={toastStatus}
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Row className="d-flex justify-content-center">
        <h1 className="text-bold text-center">Review Quiz</h1>
        <div className="d-flex justify-content-end my-3">
          <Button
            style={{ width: "20%", backgroundColor: "#07294d" }}
            onClick={() => handleAddNewQuestion()}
          >
            Thêm câu hỏi
          </Button>
        </div>
        <Col
          md={{ span: 12 }}
          style={{
            minWidth: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {quizs.map((quiz: any, index: number) => (
            <Card
              key={index}
              className="mb-3 pe-3"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                width: "100%", // Hoặc bạn có thể đặt width cụ thể như "80%" tùy vào yêu cầu
                maxWidth: "1200px", // Để giới hạn độ rộng tối đa của Card
              }}
            >
              <Card.Body>
                <Container className="d-flex flex-grow-1">
                  <Col md={6} className="border-end">
                    <div className="d-flex justify-content-between align-items-center mb-3 bg-secondary-subtle rounded-pill px-3 py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-dark text-white"
                          style={{
                            width: "30px",
                            height: "30px",
                            fontSize: "14px",
                          }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-dark">{quiz.Question}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="px-4 d-flex flex-column">
                    {/* Main Question Content */}
                    <div className="flex-grow-1">
                      <div className="mb-3 px-2">
                        {quiz.Answers &&
                          quiz.Answers.map(
                            (option: string, Answerindex: number) => (
                              <div
                                style={{ cursor: "pointer" }}
                                key={Answerindex}
                                className={`d-flex align-items-center gap-3 mb-3 hover-effect`}
                              >
                                <div
                                  className={`flex-grow-1 d-flex justify-content-between align-items-center border border-3 rounded-pill px-3 py-2`}
                                >
                                  <div className="d-flex align-items-center gap-2">
                                    <div
                                      className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-dark"
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {numberToLetter(Answerindex + 1)}
                                    </div>
                                    <span className="text-black">{option}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </Col>
                </Container>
                <Button
                  className="ms-4"
                  onClick={() => handleEdit(index)}
                  style={{ width: "20%", backgroundColor: "#07294d" }}
                >
                  Sửa
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      <Row>
        <div className="d-flex justify-content-center my-3">
          <Button
            type="submit"
            onClick={() => setTitleModal(true)}
            style={{ width: "20%", backgroundColor: "#ffd98e", color: "black" }}
          >
            Lưu bài kiểm tra
          </Button>
        </div>
      </Row>
      <Modal show={titleModal} onHide={() => setTitleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm tiêu đề</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tên đề thi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đề thi"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#07294d" }}
            onClick={handleSaveQuiz}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa câu hỏi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Kiểu câu hỏi</Form.Label>
              <Form.Control
                type="text"
                value={editQuiz["Question Type"] || ""}
                onChange={(e) =>
                  setEditQuiz({ ...editQuiz, "Question": e.target.value })
                }
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={editQuiz["Question"] || ""}
                onChange={(e) =>
                  setEditQuiz({ ...editQuiz, "Question": e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Group>
                <Form.Label>Đáp án</Form.Label>
                {Array.isArray(editQuiz.Answers) &&
                  editQuiz.Answers.map((answer, i) => (
                    <div key={i} className="d-flex align-items-center">
                      {editAnswer.id === i ? (
                        <>
                          <Form.Control
                            type="text"
                            value={editAnswer.value}
                            onChange={(e) =>
                              handleAnswerChange(i, e.target.value)
                            }
                          />
                          <Button
                            variant="success"
                            onClick={() => handleSaveAnswer(i)}
                            className="ms-2"
                          >
                            Submit
                          </Button>
                        </>
                      ) : (
                        <>
                          <Form.Check
                            type="radio"
                            id={`radio-${i}`}
                            label={answer}
                            name="quiz-answer"
                            checked={editQuiz["Correct Answer"] === answer}
                            onChange={() =>
                              setEditQuiz({
                                ...editQuiz,
                                "Correct Answer": answer,
                              })
                            }
                          />
                          {editQuiz["Question Type"] !== "TF" && (
                            <Button
                              variant="white"
                              className="ms-2"
                              style={{ width: "2%" }}
                              onClick={() => handleAnswerChange(i, answer)}
                            >
                              <Pencil />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                {editQuiz["Question Type"] !== "TF" && (
                  <Button
                    style={{ backgroundColor: "#07294d" }}
                    onClick={handleAddAnswer}
                  >
                    Thêm đáp án
                  </Button>
                )}
              </Form.Group>
            </Form.Group>
            <Form.Group>
              <Form.Label>Đáp án đúng</Form.Label>
              <Form.Control
                type="text"
                value={editQuiz["Correct Answer"] || ""}
                onChange={(e) =>
                  setEditQuiz({ ...editQuiz, "Correct Answer": e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tham khảo</Form.Label>
              <Form.Control
                type="text"
                value={editQuiz.Reference || ""}
                onChange={(e) =>
                  setEditQuiz({ ...editQuiz, Reference: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#07294d" }} onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="lg"
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm câu hỏi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Loại câu hỏi</Form.Label>
              <Form.Select
                value={newQuiz["Question Type"]}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, "Question Type": e.target.value })
                }
              >
                <option value="">Chọn kiểu câu hỏi</option>
                <option value="MCQ">Trắc nghiệm</option>
                <option value="TF">Đúng sai</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Câu hỏi</Form.Label>
              <Form.Control
                type="text"
                value={newQuiz.Question}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, Question: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              {newQuiz["Question Type"] === "MCQ" ? (
                <Form.Group>
                  <Form.Label>Đáp án</Form.Label>
                  {newQuiz.Answers.map((answer: string, i: number) => (
                    <div
                      key={`answer-${answer}-${i}`}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <div className="ps-3">
                        <Form.Check
                          type="radio"
                          name="correctAnswer"
                          checked={newQuiz["Correct Answer"] === answer}
                          onChange={() =>
                            setNewQuiz({ ...newQuiz, "Correct Answer": answer })
                          }
                        />
                        <Form.Control
                          type="text"
                          value={answer}
                          onChange={(e) => {
                            const updatedAnswers = [...newQuiz.Answers];
                            updatedAnswers[i] = e.target.value;
                            setNewQuiz({ ...newQuiz, Answers: updatedAnswers });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    style={{ backgroundColor: "#07294d" }}
                    onClick={() =>
                      setNewQuiz({
                        ...newQuiz,
                        Answers: [...newQuiz.Answers, ""],
                      })
                    }
                  >
                    Thêm đáp án
                  </Button>
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>Đáp án</Form.Label>
                  {["Có", "Không"].map((answer: string, i: number) => (
                    <div
                      key={`answer-${answer}-${i}`}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <div className="ps-3">
                        <Form.Check
                          type="radio"
                          name="correctAnswer"
                          checked={newQuiz["Correct Answer"] === answer}
                          onChange={() =>
                            setNewQuiz({ ...newQuiz, "Correct Answer": answer })
                          }
                        />
                        <Form.Control
                          type="text"
                          value={answer}
                          onChange={(e) => {
                            const updatedAnswers = [...newQuiz.Answers];
                            updatedAnswers[i] = e.target.value;
                            setNewQuiz({ ...newQuiz, Answers: updatedAnswers });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Form.Group>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Đáp án đúng</Form.Label>
              <Form.Control
                type="text"
                value={newQuiz["Correct Answer"]}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, "Correct Answer": e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tham khảo</Form.Label>
              <Form.Control
                type="text"
                value={newQuiz.Reference}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, Reference: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#07294d" }}
            onClick={handleSaveNewQuestion}
          >
            Lưu câu hỏi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReviewTest;
