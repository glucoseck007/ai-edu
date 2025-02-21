import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { House, Users, BarChart, School } from "lucide-react";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/admin/dashboard">
            <House size={18} /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/admin/dashboard/users">
            <Users size={18} /> Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/admin/dashboard/add-school">
            <School size={18} /> Add School
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
