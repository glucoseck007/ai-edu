import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../../redux/store"
import {
    closeWebSocket,
    fetchChatbotResponse,
    initializeWebSocket,
} from "../../../../redux/slices/chatbotSlice"
import { Send } from "lucide-react"
import { Container, Row, Col, Card, Form, Button, ListGroup, Overlay } from "react-bootstrap"

interface Message {
    id: number
    content: string
    isBot: boolean
    isAudio?: boolean
}

const TeacherChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch<AppDispatch>()
    const auth = useSelector((state: RootState) => state.auth)


    useEffect(() => {
        dispatch(initializeWebSocket())

        setMessages([{ id: 0, content: "Tôi có thể giúp gì cho bạn?", isBot: true }])

        return () => {
            dispatch(closeWebSocket())
        }
    }, [dispatch])

    useEffect(() => {
        scrollToBottom()
    }, []) //Fixed unnecessary dependency

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const student_code = auth.user?.id

        const newMessage: Message = {
            id: messages.length + 1,
            content: input,
            isBot: false,
        }

        setMessages((prev) => [...prev, newMessage])
        setInput("")

        const response = await dispatch(
            fetchChatbotResponse({
                student_code,
                question: input,
                subject: "",
            }),
        )

        const botResponse: Message = {
            id: messages.length + 2,
            content: response.payload,
            isBot: true,
        }

        setMessages((prev) => [...prev, botResponse])
    }

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 m-0">               
                <Col className="p-2 d-flex flex-column">
                    <Card className="h-100 border-0 rounded-0">
                        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Chatbot</h5>
                        </Card.Header>

                        <Card.Body className="p-3" style={{ overflowY: "auto", height: "75vh" }}>
                            {messages.map((message) => (
                                <Row key={message.id} className="mb-3">
                                    <Col className={message.isBot ? "text-start" : "text-end"}>
                                        <Card
                                            className={`d-inline-block ${message.isBot ? "bg-light" : "bg-primary text-white"}`}
                                            style={{ maxWidth: "70%" }}
                                        >
                                            <Card.Body className="p-2">
                                                {message.isAudio ? <audio controls src={message.content} className="w-100" /> : message.content}                                              
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            ))}
                            <div ref={messagesEndRef} />
                        </Card.Body>

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
                                    <Col xs="auto" className="d-flex gap-2">
                                        <Button type="submit" variant="primary" disabled={!input.trim()}>
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
    )
}

export default TeacherChatBot;

