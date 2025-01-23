import { Route, Routes } from "react-router-dom"
import ExplainMe from "../pages/protected/explainMe/ExplainMe"
import ProtectedLayouts from "../layouts/protectedLayouts/ProtectedLayouts"
import AuthLayouts from "../layouts/authLauoyts/AuthLayouts"
import LoginPage from "../pages/auth/login/LoginPage"
import RegisterPage from "../pages/auth/register/RegisterPage"
import Home from "../pages/landing/Home"

const AppRoute: React.FC = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayouts />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<Home />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedLayouts />}>
                <Route path="/" element={<ExplainMe />} />
                <Route path="/explain-me" element={<ExplainMe />} />
            </Route>
        </Routes>
    )
}

export default AppRoute
