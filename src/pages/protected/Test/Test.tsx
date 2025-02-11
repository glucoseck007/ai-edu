import { type FC } from "react";
import ReadingWritingModule from "./ReadandWrite/ReadandWrite";

const TestScreen: FC = () => {
  // Render current module based on section and pa
  return (
    <div className="p-4">
      <ReadingWritingModule />
    </div>
  );
};

export default TestScreen;
