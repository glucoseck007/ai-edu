import { useEffect, useState } from "react";
import test from "../../../data/test.json";
import ReadingWritingModule from "./ReadandWrite/ReadandWrite";
import MathModule from "./Math/Math";

const TestScreen: React.FC = () => {
  const {
    test: { section, totalTime },
  } = test;
  const [time, setTime] = useState<number>(totalTime);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentPart, setCurrentPart] = useState<number>(0);

  // Tính toán thời gian cho mỗi section và part
  const sectionTimings = section.map((sect) => ({
    name: sect.name,
    totalTime: sect.part.reduce((acc, part) => acc + part.time, 0),
    parts: sect.part.map((part) => part.time),
  }));

  // Xác định section và part hiện tại dựa trên thời gian còn lại
  useEffect(() => {
    let remainingTime = totalTime - time;
    let currentSectionIndex = 0;
    let currentPartIndex = 0;
    let timeAccumulated = 0;

    for (let i = 0; i < sectionTimings.length; i++) {
      const sectionTime = sectionTimings[i].totalTime;
      if (remainingTime < sectionTime) {
        currentSectionIndex = i;
        // Tìm part hiện tại trong section
        let partTimeSum = 0;
        for (let j = 0; j < sectionTimings[i].parts.length; j++) {
          partTimeSum += sectionTimings[i].parts[j];
          if (remainingTime < partTimeSum) {
            currentPartIndex = j;
            break;
          }
        }
        break;
      }
      remainingTime -= sectionTime;
    }

    setCurrentSection(currentSectionIndex);
    setCurrentPart(currentPartIndex);
  }, [time, sectionTimings]);

  // Timer
  useEffect(() => {
    let interval: number;
    if (time > 0) {
      interval = window.setInterval(() => {
        setTime((prevTime: number) => prevTime - 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, []);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Render current module based on section and part
  const renderCurrentModule = () => {
    if (time <= 0) {
      return <div>Bài thi đã kết thúc</div>;
    }

    const currentSectionData = section[currentSection];
    const currentPartData = currentSectionData.part[currentPart];

    switch (currentSectionData.name.toLowerCase()) {
      case "readingwriting":
        return <ReadingWritingModule part={currentPartData} />;
      case "math":
        return <MathModule part={currentPartData} />;
      default:
        return <div>Không tìm thấy phần thi</div>;
    }
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        <h1>Thời gian còn lại: {formatTime(time)}</h1>
        <p>Section hiện tại: {section[currentSection]?.name}</p>
        <p>Part hiện tại: {section[currentSection]?.part[currentPart]?.name}</p>
      </div>
      {renderCurrentModule()}
    </div>
  );
};

export default TestScreen;
