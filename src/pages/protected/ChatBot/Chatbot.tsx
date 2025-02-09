import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../redux/store"
import { closeWebSocket, fetchChatbotResponse, initializeWebSocket } from "../../../redux/slices/chatbotSlice"
import { Mic, Send, Square } from "lucide-react"
import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap"
import "./StudentChatBot.scss"

interface Message {
  id: number
  content: string
  subject?: string
  isBot: boolean
  isAudio?: boolean
}

const StudentChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("math")
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)

  const subjects = [
    { id: "math", name: "Toán học" },
    { id: "physics", name: "Vật lý" },
    { id: "chemistry", name: "Hóa học" },
    { id: "literature", name: "Văn học" },
    { id: "history", name: "Lịch sử" },
  ]

  useEffect(() => {
    dispatch(initializeWebSocket())
    setMessages([{ id: 0, content: "Tôi có thể giúp gì cho bạn?", isBot: true }])
    return () => {
      dispatch(closeWebSocket())
    }
  }, [dispatch])

  useEffect(() => {
    scrollToBottom()
  }, []) //Corrected dependency array

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const student_code = auth.user?.id
    const selectedSubjectName = subjects.find((s) => s.id === selectedSubject)?.name

    const newMessage: Message = {
      id: messages.length + 1,
      content: input,
      subject: selectedSubjectName,
      isBot: false,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    const response = await dispatch(
      fetchChatbotResponse({
        student_code,
        question: input,
        subject: selectedSubjectName ?? "",
      }),
    )

    const botResponse: Message = {
      id: messages.length + 2,
      content: response.payload,
      subject: selectedSubjectName,
      isBot: true,
    }

    setMessages((prev) => [...prev, botResponse])
  }

  return (
    <Container fluid className="chat-container">
      <Row className="h-100">
        <Col md={12} className="p-0">
          <Card className="chat-card">
            <Card.Header>
              <h4 className="mb-0">Student Chat Bot</h4>
            </Card.Header>
            <Nav variant="tabs" activeKey={selectedSubject} onSelect={(k) => setSelectedSubject(k || "math")}>
              {subjects.map((subject) => (
                <Nav.Item key={subject.id}>
                  <Nav.Link eventKey={subject.id}>{subject.name}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Card.Body className="chat-body">
              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.isBot ? "bot" : "user"}`}>
                    <div className="avatar">{message.isBot ? "B" : "U"}</div>
                    <div className="content">
                      {message.isAudio ? (
                        <audio controls src={message.content} className="w-100" />
                      ) : (
                        <p>{message.content}</p>
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
                    <Button type="submit" disabled={!selectedSubject || !input.trim()}>
                      <Send size={20} />
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowAudioRecorder(true)}
                      disabled={!selectedSubject}
                    >
                      <Mic size={20} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      {showAudioRecorder && (
        <AudioRecorderPopover
          setShowAudioRecorder={setShowAudioRecorder}
          setMessages={setMessages}
          selectedSubject={selectedSubject}
          subjects={subjects}
        />
      )}
    </Container>
  )
}

interface AudioRecorderPopoverProps {
  setShowAudioRecorder: React.Dispatch<React.SetStateAction<boolean>>
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  selectedSubject: string
  subjects: { id: string; name: string }[]
}

interface Message {
  id: number
  content: string
  subject?: string
  isBot: boolean
  isAudio?: boolean
}

const AudioRecorderPopover: React.FC<AudioRecorderPopoverProps> = ({
  setShowAudioRecorder,
  setMessages,
  selectedSubject,
  subjects,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const handleSendAudio = async () => {
    if (audioURL && selectedSubject) {
      const selectedSubjectName = subjects.find((s) => s.id === selectedSubject)?.name
      const student_code = auth.user?.id

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

      const audioMessage: Message = {
        id: Date.now(),
        content: audioURL,
        subject: selectedSubjectName,
        isBot: false,
        isAudio: true,
      }

      setMessages((prev) => [...prev, audioMessage])

      try {
        const response = await dispatch(
          fetchChatbotResponse({
            student_code,
            question: audioBlob,
            subject: selectedSubjectName ?? "",
          }),
        )

        const botResponse: Message = {
          id: Date.now() + 1,
          content: response.payload,
          subject: selectedSubjectName,
          isBot: true,
        }

        setMessages((prev) => [...prev, botResponse])
      } catch (error) {
        console.error("Error sending audio message:", error)
      }

      setShowAudioRecorder(false)
    }
  }

  return (
    <Card className="audio-recorder-popover">
      <Card.Body>
        {isRecording ? (
          <Button onClick={stopRecording} variant="danger" className="w-100 mb-2">
            <Square className="me-2" size={16} />
            Stop Recording
          </Button>
        ) : (
          <Button onClick={startRecording} variant="primary" className="w-100 mb-2">
            <Mic className="me-2" size={16} />
            Start Recording
          </Button>
        )}

        {audioURL && (
          <div className="mt-2">
            <audio controls src={audioURL} className="w-100 mb-2" />
            <Button onClick={handleSendAudio} variant="success" className="w-100">
              <Send className="me-2" size={16} />
              Send Audio
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default StudentChatBot

