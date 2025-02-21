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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";

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
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
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

      try {
        const teacher_code = auth.user?.id ? auth.user.id.substring(0, 5) : "";

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

        setTimeout(async () => {
          const response = await dispatch(
            fetchTeacherChatbotResponse({
            teacher_code:teacher_code,
            question: input,
          })
        );

          console.log(response);
          

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

      } catch (error) {
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
    [input, messages,auth.user?.id, dispatch]
  );

  const handleRetry = useCallback(
      async (messageToRetry: Message) => {
        const teacher_code = auth.user?.id ? auth.user.id.substring(0, 5) : "";
  
        // Remove the error message
        setMessages((prev) => prev.filter((msg) => msg.id !== messageToRetry.id));
  
        // Add a new loading message
        const loadingMessage: Message = {
          id: Date.now(),
          content: "Loading...",
          isBot: true,
          isLoading: true,
        };
  
        setMessages((prev) => [...prev, loadingMessage]);
        setLoadingMessageId(loadingMessage.id);
  
        try {
          setTimeout(async () => {
            const response = await dispatch(
              fetchTeacherChatbotResponse({     
                teacher_code:teacher_code,         
                question: messageToRetry.content,
              })
            );
  
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== loadingMessage.id)
            );
            setLoadingMessageId(null);
  
            if (response.error) {
              const errorData = response.payload as {
                message: string;
                status: number;
              };
              const botResponse: Message = {
                id: Date.now(),
                content: errorData.message,
                isBot: true,
                isError: true,
              };
              setMessages((prev) => [...prev, botResponse]);
            } else {
              const botResponse: Message = {
                id: Date.now(),
                content: response.payload,
                isBot: true,
              };
              setMessages((prev) => [...prev, botResponse]);
            }
          }, 5000);
        } catch (error: any) {
          const errorMessage =
            error?.message || "An error occurred while retrying the message";
          const botResponse: Message = {
            id: Date.now(),
            content: errorMessage,
            isBot: true,
            isError: true,
          };
          setMessages((prev) => [...prev, botResponse]);
          setLoadingMessageId(null);
        }
      },
      [auth.user?.id, dispatch]
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
            <Card.Body className="chat-body" style={{ height: "calc(100vh - 250px)", overflow: "hidden" }}>
  <div className="messages-container" style={{ overflowY: "auto", height: "100%" }}>
    {messages.map((message) => (
      <div key={message.id} className={`message ${message.isBot ? "bot" : "user"}`}>
        <div className="avatar">
          <Image roundedCircle src={message.isBot ? ChatBotImg : TeacherImg} />
        </div>
        <div className="content">
          {message.isLoading ? (
            <span className="text-secondary">Waiting for response...</span>
          ) : (
            <div>
              {message.content?.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  <Latex>{line}</Latex>
                  <br />
                </React.Fragment>
              ))}
              {message.isError && (
                <div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRetry(message)}
                    style={{ width: "20%" }}
                  >
                    Retry
                  </Button>
                </div>
              )}
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
