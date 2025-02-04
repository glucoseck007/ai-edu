import "../ChatBot/chatbot.css";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  closeWebSocket,
  fetchChatbotResponse,
  initializeWebSocket,
  sendAudioMessage,
} from "../../../redux/slices/chatbotSlice";

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

    dispatch(initializeWebSocket());

    return () => {
      dispatch(closeWebSocket());
    };
  }, [dispatch]);

  // const send = async (text: string | Blob) => {
  //   const student_code = auth.user?.id;
  //   const response = await dispatch(
  //     fetchChatbotResponse({ student_code: student_code, question: text })
  //   );
  //   const newMessages: JSX.Element[] = [
  //     ...messages,
  //     <UserMessage key={messages.length + 1} content={text} />,
  //     <BotMessage key={messages.length + 2} userMessage={response.payload} />,
  //   ];
  //   setMessages(newMessages);
  // };

  const send = async (text: string | Blob) => {
    const student_code = auth.user?.id;

    if (text instanceof Blob) {
      // If it's an audio message, send via WebSocket
      dispatch(sendAudioMessage(text));
    } else {
      // If it's a text-based message, fetch chatbot response via API
      const response = await dispatch(
        fetchChatbotResponse({ student_code: student_code, question: text })
      );
      const newMessages: JSX.Element[] = [
        ...messages,
        <UserMessage key={messages.length + 1} content={text} />,
        <BotMessage key={messages.length + 2} userMessage={response.payload} />,
      ];
      setMessages(newMessages);
    }
  };

  return (
    <div className="chatbot">
      <Messages messages={messages} />
      <Input onSend={send} />
    </div>
  );
}
export default Chatbot;
