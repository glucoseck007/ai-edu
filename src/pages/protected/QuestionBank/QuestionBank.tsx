import { Col, Row } from "react-bootstrap";
import CustomButton from "../../../components/common/button/custom-button/Custom-Button";
import "../QuestionBank/question-bank.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function QuestionBank() {
  const { t, i18n } = useTranslation();
  const titleParts = t("questionBank.title", { returnObjects: true }) as Array<{
    className: string;
    text: string;
  }>;

  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const language = i18n.language || "en";
        const data = await import(`../../../../i18n/locales/${language}.json`);
        const fetchedSkills = data.questionSpecific.module.flatMap(
          (module: any) => module.domain.flatMap((domain: any) => domain.skill)
        );
        setSkills(fetchedSkills);
      } catch (error) {
        console.error("Error loading JSON file: ", error);
      }
    };

    fetchSkills();
  }, [i18n.language]);

  return (
    <div className="question-bank-container">
      <h1>
        {(Array.isArray(titleParts) ? titleParts : []).map((part, index) => (
          <span key={index} className={part.className}>
            {part.text}
          </span>
        ))}
      </h1>
      <h6 style={{ fontWeight: "lighter", marginBottom: 24 }}>
        Write anything here if you want
      </h6>
      <div className="module-title">
        <h2>{t("questionSpecific.module.0.name")}</h2>
        <CustomButton
          width="400px"
          height="31px"
          border="1px solid #1A61CF;"
          title={t("questionBank.button.title.purchase")}
          color="black"
          backgroundColor="transparent"
          icon="../src//assets/images/all-icon/lock.svg"
        />
      </div>
      <Row className="skill-container">
        {skills.map((skill) => (
          <Col className="skill-item">{skill}</Col>
        ))}
      </Row>
    </div>
  );
}

export default QuestionBank;
