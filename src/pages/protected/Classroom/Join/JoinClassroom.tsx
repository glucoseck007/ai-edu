import { useState } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";

const JoinClassRoom: React.FC = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const validateCode = (value: string) => {
        const regex = /^[a-z0-9]{6}$/;
        if (!regex.test(value)) {
            setError('Code must be 6 characters long and contain only lowercase letters and numbers');
        } else {
            setError('');
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCode(value);
        validateCode(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateCode(code);
        if (!error) {
            // Handle submission logic here
            console.log('Submitting code:', code);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="w-100" style={{ maxWidth: '400px' }}>
                <Card.Body>
                    <Card.Title as="h1" className="text-center mb-4">
                        Join Classroom
                    </Card.Title>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="classCode">
                            <Form.Label>Enter Class Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="Enter 6-character code"
                                maxLength={6}
                                isInvalid={!!error}
                            />
                            <Form.Text className="text-muted">
                                Please enter a 6-character code containing only lowercase letters and numbers.
                            </Form.Text>
                            <Form.Control.Feedback type="invalid">
                                {error}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={!code || !!error}
                            >
                                Join Class
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default JoinClassRoom;