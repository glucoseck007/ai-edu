import React, { useState } from "react";
import "./addclass.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const AddClass: React.FC = () => {
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");
  const auth = useSelector((state: RootState) => state.auth);
  const accountId = auth.user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClassroom = { name, section, subject, room, accountId };

    try {
      // Send POST request to add a new classroom
      const response = await axios.post(
        `${import.meta.env.VITE_API}/classroom/add_class`,
        newClassroom
      );
      console.log("Classroom created successfully:", response.data);

      // Optionally clear the form after successful submission
      setName("");
      setSection("");
      setSubject("");
      setRoom("");
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  return (
    <div className="add-classroom-form">
      <h2>Tạo một lớp học mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên lớp học</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="section">Học phần</label>
          <input
            type="text"
            id="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Môn học</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="room">Phòng</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <button type="submit">Tạo</button>
      </form>
    </div>
  );
};

export default AddClass;
