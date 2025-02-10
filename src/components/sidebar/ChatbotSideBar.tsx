import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, BookOpen, Settings, User } from "lucide-react";
import styles from "./AdminSideBar.module.css";

const ChatBotSidebarComponent: React.FC = () => {
    const location = useLocation();

    const navTopItems = [
        { path: "/", icon: Home },
        { path: "/tests", icon: Users },
        { path: "/student/chat-bot", icon: BookOpen },
    ];

    const navBottomItems = [
        { path: "/settings", icon: Settings },
        { path: "/profile", icon: User },
    ];

    return (
        <div className={`${styles.sidebar} ${styles.collapsed}`}>
            <Nav className={`flex-column ${styles.sidebarNav}`}>
                <div className={styles.navTop}>
                    {navTopItems.map((item) => (
                        <Nav.Item key={item.path}>
                            <Nav.Link
                                as={Link}
                                to={item.path}
                                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ""}`}
                            >
                                <item.icon size={18} />
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </div>
                <div className={styles.navBottom}>
                    {navBottomItems.map((item) => (
                        <Nav.Item key={item.path}>
                            <Nav.Link
                                as={Link}
                                to={item.path}
                                className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ""}`}
                            >
                                <item.icon size={18} />
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </div>
            </Nav>
        </div>
    );
};

export default ChatBotSidebarComponent;