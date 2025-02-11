import { useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";

const ReviewTest: React.FC = () => {

    const storedData = JSON.parse(localStorage.getItem("quiz") || "{}");

    const quizData = Array.isArray(storedData.quiz) ? storedData.quiz : [];
    console.log(quizData);

    const [quizs, setQuizs] = useState(quizData);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editQuiz, setEditQuiz] = useState<any>({});

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setEditQuiz(quizs[index]);
        setShowModal(true);
    };

    const handleSave = () => {
        const updatedQuiz = [...quizs];
        if (editIndex !== null) {
            updatedQuiz[editIndex] = editQuiz;
            setQuizs(updatedQuiz);
            localStorage.setItem("quiz", JSON.stringify({ quiz: updatedQuiz }));
        }
        setShowModal(false);
    };

    return (
        <Container>
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Review Quiz</Card.Title>
                            {quizData.map((quiz: any, index: number) => (
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <ul>
                                            <li><strong>Question:</strong> {quiz.Question}</li>
                                            <li><strong>Your Answer:</strong> {quiz.Answers.join(", ")}</li>
                                            <li><strong>Correct Answer:</strong> {quiz["Correct Answer"]}</li>
                                            <li><strong>Reference:</strong> {quiz.Reference}</li>
                                            <li><strong>Type:</strong> {quiz["Question Type"]}</li>
                                        </ul>
                                        <Button variant="primary" onClick={() => handleEdit(index)}>Edit</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={editQuiz["Question Type"] || "mcq"}
                                onChange={(e) => setEditQuiz({ ...editQuiz, "Question Type": e.target.value })}
                            >
                                <option value="mcq">MCQ</option>
                                <option value="tf">True/False</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Answers</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={editQuiz.Answers?.join(", ") || ""}
                                onChange={(e) => setEditQuiz({ ...editQuiz, Answers: e.target.value.split(", ") })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Correct Answer</Form.Label>
                            <Form.Control
                                type="text"
                                value={editQuiz["Correct Answer"] || ""}
                                onChange={(e) => setEditQuiz({ ...editQuiz, "Correct Answer": e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Reference</Form.Label>
                            <Form.Control
                                type="text"
                                value={editQuiz.Reference || ""}
                                onChange={(e) => setEditQuiz({ ...editQuiz, Reference: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ReviewTest;