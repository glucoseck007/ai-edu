import React, { useEffect } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";

const ClassResultTest: React.FC = () => {
  // Generate random student data
  //   const generateStudentData = () => {
  //     const students = [];
  //     for (let i = 1; i <= 20; i++) {
  //       const mark = (Math.random() * 9 + 1).toFixed(1); // Random mark between 1 and 10
  //       students.push({
  //         id: `SE${String(i).padStart(3, "0")}`,
  //         name: `Học sinh ${i}`,
  //         mark: parseFloat(mark),
  //         status: parseFloat(mark) >= 5 ? "Đạt" : "Không đạt",
  //       });
  //     }
  //     return students;
  //   };

  const [testHistory, setTestHistory] = React.useState<any[]>([]);
  const quizId = useParams().testId;

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/quiz-attempt/${quizId}`
      );
      setTestHistory(response.data);
    } catch (error) {
      console.error("Error fetching test history:", error);
    }
  };

  useEffect(() => {
    fetchTestHistory();
  }, []);

  const students = testHistory;

  // Calculate class statistics
  const classAverage = (
    students.reduce((sum, student) => sum + student.score, 0) / students.length
  ).toFixed(1);
  const passCount = students.filter((student) => student.score >= 5).length;
  const passRate = ((passCount / students.length) * 100).toFixed(1);

  return (
    <Container>
      <h1 className="text-center my-4">Kết Quả Bài Kiểm Tra lớp SE</h1>

      {/* Class Statistics */}
      <div className="text-center mb-4">
        <h4>Thống kê lớp</h4>
        <p>
          Điểm trung bình: <Badge bg="primary">{classAverage}</Badge>
        </p>
        <p>
          Tỉ lệ đạt: <Badge bg="success">{passRate}%</Badge> ({passCount}/20 học
          sinh)
        </p>
      </div>

      {/* Results Table */}
      <Table striped bordered hover responsive>
        <thead className="bg-primary text-white">
          <tr>
            <th className="text-center">STT</th>
            <th className="text-center">Mã số</th>
            <th className="text-center">Họ và tên</th>
            <th className="text-center">Điểm</th>
            <th className="text-center">Kết quả</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">
                {student.accountId.substring(0, 5)}
              </td>
              <td className="text-center">{student.fullName}</td>
              <td className="text-center">
                <strong
                  className={student.mark >= 5 ? "text-success" : "text-danger"}
                >
                  {student.score}
                </strong>
              </td>
              <td className="text-center">
                <Badge bg={student.status ? "success" : "danger"}>
                  {student.status ? "Đạt" : "Không đạt"}
                </Badge>
              </td>
              <td className="text-center">
                <a
                  href={`/teacher/test-result/1/${student.id}`}
                  className="text-decoration-none"
                >
                  Xem chi tiết
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ClassResultTest;
