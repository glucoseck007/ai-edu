import { Pencil, Plus, Save } from "lucide-react";
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
import "./ReviewTest.scss";

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
  const [toastStatus, setToastStatus] = useState<"success" | "warning" | "error">("success");
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

      // Filter out empty strings from Answers
      updatedQuiz.Answers = updatedQuiz.Answers.filter((answer: string) => answer !== "");

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
    } else if (newQuiz["Question Type"] === "MCQ" && newQuiz.Answers.length < 2) {
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
        quizDataToSave,
        {
          headers: {
            "Content-Type": "application/json",
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
      setToastMessage(error.message || "An error occurred while saving the quiz");
      setShowToast(true);
    }
    setTitleModal(false);
  };

  return (
    <Container className="review-container">
      <ToastComponent
        status={toastStatus}
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <Row className="d-flex justify-content-center">
        <h1 className="review-title text-center">Review Quiz</h1>
        <div className="d-flex justify-content-end my-3 w-100">
          <Button className="add-question-btn" onClick={handleAddNewQuestion}>
            <Plus size={18} className="me-2" /> Add new question
          </Button>
        </div>
        <Col md={12} className="d-flex flex-column align-items-center">
          {quizs.map((quiz: any, index: number) => (
            <Card key={index} className="quiz-card">
              <Card.Body>
                <div className="question-header">
                  <div className="d-flex align-items-center">
                    <div className="question-number">{index + 1}</div>
                    <span className="question-text">{quiz.Question}</span>
                  </div>
                </div>
                <div className="answers-section">
                  {quiz.Answers.map((option: string, answerIndex: number) => (
                    <div key={answerIndex} className="answer-item">
                      <div className="answer-letter">
                        {numberToLetter(answerIndex + 1)}
                      </div>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
                <Button className="edit-btn" onClick={() => handleEdit(index)}>
                  <Pencil size={16} className="me-1" /> Edit
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      <Row>
        <div className="d-flex justify-content-center my-3">
          <Button className="save-quiz-btn" onClick={() => setTitleModal(true)}>
            <Save size={16} className="me-1" /> Save quiz
          </Button>
        </div>
      </Row>
      <Modal show={titleModal} onHide={() => setTitleModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Add Quiz Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Quiz Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="save-quiz-btn" onClick={handleSaveQuiz}>
            <Save size={16} className="me-1" /> Save Title
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Edit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Question Type</Form.Label>
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
              <Form.Label>Answers</Form.Label>
              {Array.isArray(editQuiz.Answers) &&
                editQuiz.Answers.map((answer, i) => (
                  <div key={i} className="d-flex align-items-center mb-2">
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
                          <Save size={16} />
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
                            onClick={() => handleAnswerChange(i, answer)}
                          >
                            <Pencil size={16} />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              {editQuiz["Question Type"] !== "TF" && (
                <Button className="add-question-btn mt-2" onClick={handleAddAnswer}>
                  <Plus size={16} className="me-1" /> Add answer
                </Button>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Correct Answer</Form.Label>
              <Form.Control
                type="text"
                value={editQuiz["Correct Answer"] || ""}
                onChange={(e) =>
                  setEditQuiz({ ...editQuiz, "Correct Answer": e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reference</Form.Label>
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
          <Button className="save-quiz-btn" onClick={handleSave}>
            <Save size={16} className="me-1" /> Save changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Question Type</Form.Label>
              <Form.Select
                value={newQuiz["Question Type"]}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, "Question Type": e.target.value })
                }
              >
                <option value="">Select question type</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="TF">True False</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Question</Form.Label>
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
                  <Form.Label>Answers</Form.Label>
                  {newQuiz.Answers.map((answer: string, i: number) => (
                    <div key={`answer-${i}`} className="d-flex align-items-center gap-2 mb-2">
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
                    className="add-question-btn"
                    onClick={() =>
                      setNewQuiz({
                        ...newQuiz,
                        Answers: [...newQuiz.Answers, ""],
                      })
                    }
                  >
                    <Plus size={16} className="me-1" /> Add Answer
                  </Button>
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>Answers</Form.Label>
                  {["Có", "Không"].map((answer: string, i: number) => (
                    <div key={`answer-${i}`} className="d-flex align-items-center gap-2 mb-2">
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
              <Form.Label>Correct Answer</Form.Label>
              <Form.Control
                type="text"
                value={newQuiz["Correct Answer"]}
                onChange={(e) =>
                  setNewQuiz({ ...newQuiz, "Correct Answer": e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reference</Form.Label>
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
          <Button className="save-quiz-btn" onClick={handleSaveNewQuestion}>
            <Save size={16} className="me-1" /> Save Question
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReviewTest;
