import { useState } from "react";
import { Card, Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";

const JoinClassRoom: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);

  // Placeholder for accountId (replace with actual user ID from auth context or state)
  const accountId = auth.user?.id;

  const validateCode = (value: string) => {
    const regex = /^[a-z0-9]{6}$/;
    if (!regex.test(value)) {
      setError(
        "Code must be 6 characters long and contain only lowercase letters and numbers"
      );
    } else {
      setError("");
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(value);
    validateCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateCode(code);

    if (!error) {
      try {
        setIsLoading(true);
        setSuccessMessage("");
        setError("");

        const response = await axios.post(
          `${import.meta.env.VITE_API}/classroom/join`,
          {
            accountId,
            classroomCode: code,
          }
        );

        setSuccessMessage("Tham gia thành công!");
        setCode(""); // Clear the input field on success
      } catch (err: any) {
        console.error("Failed to join classroom:", err);
        setError(err.response?.data || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <Card.Title as="h1" className="text-center mb-4">
            Tham gia lớp học
          </Card.Title>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="classCode">
              <Form.Label>Nhập mã lớp học</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="Nhập mã chứa 6 ký tự"
                maxLength={6}
                isInvalid={!!error && code.length === 6}
                disabled={isLoading}
              />
              <Form.Text className="text-muted">
                Nhập mã lớp học để tham gia.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={!code || !!error || isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Tham gia"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JoinClassRoom;
