import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import "../Chatbot.scss";
import ChatBotImg from "../../../../assets/images/Chatbot.jpg";
import TeacherImg from "../../../../assets/images/teacher.jpg";
import ChatBotSidebarComponent from "../../../../components/sidebar/ChatbotSideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Latex from "react-latex-next";
import { fetchTeacherChatbotResponse } from "../../../../redux/slices/chatbotSlice"; // Keeping API call

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  isError?: boolean;
  isLoading?: boolean;
}

const TeacherChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessageId, setLoadingMessageId] = useState<number | null>(null);

  useEffect(() => {
    setMessages([
      { id: 0, content: "Tôi có thể giúp gì cho bạn?", isBot: true },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const newMessage: Message = {
        id: messages.length + 1,
        content: input,
        isBot: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      const loadingMessage: Message = {
        id: messages.length + 2,
        content: "Loading...",
        isBot: true,
        isLoading: true,
      };

      setMessages((prev) => [...prev, loadingMessage]);
      setLoadingMessageId(loadingMessage.id);

      try {
        setTimeout(async () => {
          const response = await fetchTeacherChatbotResponse({
            question: input,
          });

          setMessages((prev) =>
            prev.filter((msg) => msg.id !== loadingMessage.id)
          );
          setLoadingMessageId(null);

          const botResponse: Message = {
            id: messages.length + 3,
            content: response.payload,
            isBot: true,
            isError: response.error,
          };
          setMessages((prev) => [...prev, botResponse]);
        }, 5000);
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 3,
            content: "An error occurred while sending your message",
            isBot: true,
            isError: true,
          },
        ]);
        setLoadingMessageId(null);
      }
    },
    [input, messages]
  );

  return (
    <Container
      fluid
      className="chat-container p-0 m-0"
      style={{ overflow: "hidden" }}
    >
      <Row className="h-100 gx-0">
        <ChatBotSidebarComponent />
        <Col className="p-0 m-0">
          <Card className="chat-card">
            <Card.Header className="py-3">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faRobot} />
                &nbsp;Teacher Chat Bot
              </h4>
            </Card.Header>
            <Card.Body className="chat-body">
              <div
                className="messages-container"
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 150px)" }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.isBot ? "bot" : "user"}`}
                  >
                    <div className="avatar">
                      <Image
                        roundedCircle
                        src={message.isBot ? ChatBotImg : TeacherImg}
                      />
                    </div>
                    <div className="content">
                      {message.isLoading ? (
                        <span className="text-secondary">
                          Waiting for response...
                        </span>
                      ) : (
                        <div className="align-items-center">
                          <span
                            className={
                              message.isError
                                ? "ps-2 text-danger"
                                : message.isBot
                                ? "ps-2 text-black"
                                : "ps-2 text-white"
                            }
                          >
                            {message.content.split("\n").map((line, index) => (
                              <React.Fragment key={index}>
                                <Latex>{line}</Latex>
                                <br />
                              </React.Fragment>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={handleSubmit}>
                <Row className="align-items-center">
                  <Col>
                    <Form.Control
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                    />
                  </Col>
                  <Col xs="auto">
                    <Button type="submit" disabled={!input.trim()}>
                      <Send size={20} />
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

export default TeacherChatBot;
