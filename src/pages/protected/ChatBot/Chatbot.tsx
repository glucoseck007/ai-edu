import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  closeWebSocket,
  fetchChatbotResponse,
  initializeWebSocket,
  sendAudioMessage,
} from "../../../redux/slices/chatbotSlice";
import { Send, Mic } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  const subjects = [
    { id: 1, name: "Toán học" },
    { id: 2, name: "Vật lý" },
    { id: 3, name: "Hóa học" },
    { id: 4, name: "Văn học" }
  ];

  const messagesEndRef = useRef(null);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeWebSocket());

    // Load welcome message
    setMessages([
      { id: 0, content: "Tôi có thể giúp gì cho bạn?", isBot: true }
    ]);

    return () => {
      dispatch(closeWebSocket());
    };
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const student_code = auth.user?.id;
    // Include selected subjects in the message
    const selectedSubjectNames = Array.from(selectedSubjects)
      .map(id => subjects.find(s => s.id === id)?.name)
      .filter(Boolean);

    const newMessage = {
      id: messages.length + 1,
      content: input,
      subjects: selectedSubjectNames,
      isBot: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    const selectedSubjectName = subjects.find(s => s.id === selectedSubject)?.name;

    const response = await dispatch(
      fetchChatbotResponse({
        student_code,
        question: input,
        subjects: selectedSubjectName ? [selectedSubjectName] : []
      })
    );

    const botResponse = {
      id: messages.length + 2,
      content: response.payload,
      subjects: selectedSubjectNames,
      isBot: true
    };

    setMessages(prev => [...prev, botResponse]);
  };

  const handleSubjectSelect = (subjectId: number) => {
    setSelectedSubject(subjectId);
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="h-100 m-0">
        {/* Sidebar */}
        <Col md={3} className="p-2 border-end bg-light">
          <Card className="h-100 border-0 rounded-0">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Select Subjects</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {subjects.map((subject) => (
                  <ListGroup.Item
                    key={subject.id}
                    action
                    // active={selectedSubjects.has(subject.id)}
                    onClick={() => handleSubjectSelect(subject.id)}
                    className="d-flex align-items-center"
                  >
                    <Form.Check
                      type="radio"
                      checked={selectedSubject === subject.id}
                      onChange={() => { }}
                      label={subject.name}
                      className="w-100"
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Chat Area */}
        <Col md={9} className="p-2 d-flex flex-column">
          <Card className="h-100 border-0 rounded-0">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Current Chat</h5>
            </Card.Header>

            {/* Messages Area */}
            <Card.Body className="p-3" style={{ overflowY: 'auto', height: '75vh' }}>
              {messages.map((message) => (
                <Row key={message.id} className="mb-3">
                  <Col className={message.isBot ? 'text-start' : 'text-end'}>
                    <Card
                      className={`d-inline-block ${message.isBot ? 'bg-light' : 'bg-primary text-white'}`}
                      style={{ maxWidth: '70%' }}
                    >
                      <Card.Body className="p-2">
                        {message.content}
                        {message.subjects?.length > 0 && (
                          <div className={`mt-1 ${message.isBot ? 'text-muted' : 'text-white'}`} style={{ fontSize: '0.8em' }}>
                            Subjects: {message.subjects.join(', ')}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ))}
              <div ref={messagesEndRef} />
            </Card.Body>

            {/* Input Area */}
            <Card.Footer className="bg-white">
              <Form onSubmit={handleSubmit}>
                <Row className="d-flex gap-2 align-items-center">
                  <Col>
                    <Form.Control
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                    />
                  </Col>
                  <Col xs="auto" className='d-flex gap-2'>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!selectedSubject|| !input.trim()}
                    >
                      <Send size={20} />
                    </Button>
                    <Button variant="light" onClick={() => {/* Add voice input handling */ }}>
                      <Mic size={20} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBot;