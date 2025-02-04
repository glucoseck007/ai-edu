import "../ChatBot/chatbot.css";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchChatbotResponse } from "../../../redux/slices/chatbotSlice";

import BotMessage from "./chatbot/BotMessage";
import Messages from "./chatbot/Message";
import Input from "./chatbot/Input";
import UserMessage from "./chatbot/UserMessage";

function Chatbot() {
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function loadWelcomeMessage() {
      setMessages([
        <BotMessage key="0" userMessage="Tôi có thể giúp gì cho bạn?" />,
      ]);
    }
    loadWelcomeMessage();
  }, []);

  const send = async (text: string) => {
    const student_code = auth.user?.id;
    const response = await dispatch(
      fetchChatbotResponse({ student_code: student_code, question: text })
    );
    const newMessages: JSX.Element[] = [
      ...messages,
      <UserMessage key={messages.length + 1} text={text} />,
      <BotMessage key={messages.length + 2} userMessage={response.payload} />,
    ];
    setMessages(newMessages);
  };

  return (
    <div className="chatbot">
      <Messages messages={messages} />
      <Input onSend={send} />
    </div>
  );
}

export default Chatbot;
