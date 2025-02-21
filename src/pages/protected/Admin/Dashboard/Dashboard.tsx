import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../../../../components/sidebar/AdminSideBar";
// import DashboardCards from '../components/DashboardCards';
// import Chart from '../components/Chart';
import "./Dashoard.scss";
import { useLocation } from "react-router-dom";
import UserList from "./UserList";
import AddSchool from "./AddSchool";
import AddSubject from "./AddSubject";

const Dashboard = () => {
  const location = useLocation();

  const path = location.pathname.split("/")[3];
  console.log(path);
  const renderContent = () => {
    switch (path) {
      case "users":
        return <UserList />;
      case "add-school":
        return <AddSchool />;
      case "add-subject":
        return <AddSubject />;
      default:
        return <div>Dashboard Overview</div>;
    }
  };
  return (
    <Container fluid className="p-0" style={{ overflow: "hidden" }}>
      <Row>
        <Col md={3} lg={2} className="sidebar-container">
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="main-content">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
