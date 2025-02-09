import { Route, Routes } from "react-router-dom";

import ExplainMe from "../pages/protected/ExplainMe/ExplainMe";
import ProtectedLayouts from "../layouts/protectedLayouts/ProtectedLayouts";
import AuthLayouts from "../layouts/authLayouts/AuthLayouts";
import LoginPage from "../pages/auth/Login/LoginPage";
import RegisterPage from "../pages/auth/Register/RegisterPage";
import Home from "../pages/landing/Home";
import GoogleCallbackPage from "../pages/auth/Login/GoogleCallBackPage";
import TestLayouts from "../layouts/testLayouts/TestLayouts";
import Blog from "../pages/protected/Blog/Blog";
import ExamList from "../pages/protected/Exam/ExamList";
import TestScreen from "../pages/protected/Test/Test";
import QuestionBank from "../pages/protected/QuestionBank/QuestionBank";
import Chatbot from "../pages/protected/ChatBot/Chatbot";
import ChatLayouts from "../layouts/chatLayouts/ChatLayouts";
import Upload from "../pages/protected/Upload/Upload";
import AddClass from "../pages/protected/AddClass/AddClass";
import Classroom from "../pages/protected/Classroom/Classroom";
import ClassroomDetail from "../pages/protected/Classroom/ClassroomDetail/ClassroomDetail";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayouts />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/google-callback" element={<GoogleCallbackPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedLayouts />}>
        <Route path="/" element={<Home />} />
        <Route path="/explain-me" element={<ExplainMe />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/exam-list" element={<ExamList />} />
        <Route path="upload" element={<Upload />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route
          path="/classroom/classroom-detail"
          element={<ClassroomDetail />}
        />
        <Route path="/add-class" element={<AddClass />} />
      </Route>

      {/* Test Routes */}
      <Route element={<TestLayouts />}>
        <Route path="/test" element={<TestScreen />} />
      </Route>

      <Route element={<ChatLayouts />}>
        <Route path="/chat-bot" element={<Chatbot />}></Route>
      </Route>
    </Routes>
  );
};
export default AppRoute;
