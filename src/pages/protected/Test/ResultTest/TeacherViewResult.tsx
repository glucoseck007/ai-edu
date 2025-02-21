import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherViewResult: React.FC = () => {
  const { quizId, studentId } = useParams(); // Get testId from URL
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/quiz/attempt/${quizId}/${studentId}`
        );

        if (response.status === 200) {
          setData(response.data[0].results);
          // console.log(data);
        } else {
          throw new Error("Failed to fetch results");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, studentId]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-4" />;
  if (error)
    return <div className="text-center text-danger mt-4">Lỗi: {error}</div>;
  if (!data) return <div className="text-center mt-4">Không có dữ liệu.</div>;

  // Extract file name from reference
  const extractReference = (reference: string | null) => {
    if (!reference) return "Không có tài liệu tham khảo";
    const match = reference.match(/(.+?\.(doc|pdf|txt|xlsx|ppt))/i);
    return match ? match[1] : reference;
  };

  const correctAnswers = data.filter((question: any) => question.isCorrect);
  // console.log(correctAnswers);
  const scorePercentage = (correctAnswers.length / data.length) * 100;

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Kết Quả Bài Kiểm Tra</h1>

      {/* Score Summary */}
      <Card className="mb-4 text-center">
        <Card.Body>
          <Card.Title className="h2">Tổng Điểm</Card.Title>
          <div
            className={`display-4 ${
              scorePercentage >= 50 ? "text-primary" : "text-danger"
            }`}
          >
            {scorePercentage.toFixed(1)}%
          </div>
          <Card.Text>
            Số câu đúng: {correctAnswers.length}/{data.length}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Questions and Answers */}
      {Array.isArray(data) && data.length > 0 ? (
        data.map((question: any, index: number) => (
          <Card
            key={index}
            className="mb-4"
            border={question.isCorrect ? "success" : "danger"}
          >
            <Card.Body>
              <Card.Title className="mb-3">
                Câu {index + 1}: {question.question}
              </Card.Title>
              <div className="mb-3">
                <div
                  className={`p-2 mb-2 rounded ${
                    question.isCorrect
                      ? "bg-success text-white"
                      : "bg-danger text-white"
                  }`}
                >
                  Bạn trả lời: {question.userAnswer}
                </div>
                {!question.isCorrect && (
                  <div className="p-2 mb-2 rounded bg-light">
                    Đáp án đúng: {question.correctAnswer}
                  </div>
                )}
              </div>
              <Card className="bg-light">
                <Card.Body>
                  <Card.Subtitle className="mb-2">Tham khảo:</Card.Subtitle>
                  <Card.Text className="text-muted">
                    {extractReference(question.reference)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center mt-4">Không có câu hỏi trong bài thi.</div>
      )}

      {/* Button to Return */}
      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => navigate("/tests")}>
          Quay lại danh sách bài thi
        </Button>
      </div>
    </Container>
  );
};

export default TeacherViewResult;
