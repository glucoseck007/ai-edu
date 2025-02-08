import "./register.css";

import { useState } from "react";
import { faSchool, faUser } from "@fortawesome/free-solid-svg-icons";
import { Trans, useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import TextInput from "../../../components/common/input/Text-Input";
import PhoneInput from "../../../components/common/input/Phone-Input";
import CustomToggleButton from "../../../components/common/button/toggle-button/Custom-Toggle-Button";
import images from "../../../constants/image";
import EmailInput from "../../../components/common/input/Email-Input";
import PasswordInput from "../../../components/common/input/Password-Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ToastComponent from "../../../components/common/toast/Toast";
import LoadingButton from "../../../components/common/button/LoadingButton";
import LoadingLink from "../../../components/common/links/LoadingLink";

function RegisterPage() {
  const policyUrl = "";
  const termsUrl = "";

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [policy, setPolicy] = useState<boolean>(false);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastStatus, setToastStatus] = useState<
    "success" | "warning" | "error"
  >("success");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRoleChange = (newRole: "student" | "teacher") => {
    setRole(newRole);
  };

  const handleRegister = async () => {
    setIsSubmitting(true);

    if (
      !email.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !fullName.trim()
    ) {
      // Scroll to top first
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setToastStatus("warning");
        setToastMessage(t("Please fill in all required fields!"));
        setShowToast(true);
      }, 300);

      setIsSubmitting(false);
      return;
    }

    if (!policy) {
      // Scroll to top first
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setToastStatus("warning");
        setToastMessage(t("Bạn cần chấp nhận điều khoản và chính sách!"));
        setShowToast(true);
      }, 300);

      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/accounts/create-account`,
        {
          username: email,
          password,
          fullName,
          school,
          role,
          phone,
        }
      );

      // Scroll to top first
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Show success toast and navigate to login page after scroll
      setTimeout(() => {
        setToastStatus("success");
        setToastMessage(t("Registration successful! Please login."));
        setShowToast(true);

        // Navigate after showing toast
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }, 300);
    } catch (error: any) {
      // Scroll to top first
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Show error toast after scroll
      setTimeout(() => {
        setToastStatus("error");
        setToastMessage(
          error.response?.data?.message ||
            error.message ||
            "An error occurred during registration"
        );
        setShowToast(true);
      }, 300);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <ToastComponent
        status={toastStatus}
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="register-left">
        <form onSubmit={(e) => e.preventDefault}>
          <div className="register-left-inner">
            <h2 className="register-left-header">
              {t("auth.header.register")}
            </h2>
            <TextInput
              label={t("auth.inputLabel.fullname")}
              placeholder={t("auth.placeholder.fullname")}
              icon={faUser}
              value={fullName}
              onChange={(value) => setFullName(value)}
              isRequired
            />
            <EmailInput
              isRequired
              value={email}
              onChange={(value) => setEmail(value)}
            />
            <PasswordInput
              isRequired
              value={password}
              onChange={(value) => setPassword(value)}
            />
            <PhoneInput
              isRequired
              value={phone}
              onChange={(value) => setPhone(value)}
            />
            <CustomToggleButton onRoleChange={handleRoleChange} />
            <TextInput
              value={school}
              onChange={(value) => setSchool(value)}
              label={t("auth.inputLabel.school")}
              placeholder={t("auth.placeholder.school")}
              icon={faSchool}
            />
            <Form.Check
              className="policy"
              checked={policy}
              onChange={(e) => setPolicy(e.target.checked)}
              type="checkbox"
              id="default-checkbox"
              style={{ marginBottom: 25 }}
              label={
                <Trans
                  i18nKey="auth.checkboxTitle.policyAcceptance"
                  values={{ policyUrl, termsUrl }}
                  components={{
                    a: (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0656f2", fontWeight: "bold" }}
                      />
                    ),
                  }}
                />
              }
            />
            <LoadingButton
              isLoading={isSubmitting}
              onClick={handleRegister}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#001568",
                border: "none",
                fontWeight: 600,
                marginTop: "12px",
              }}
            >
              {t("auth.buttonTitle.register")}
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="register-right">
        <div className="register-right-inner">
          <h2 className="register-right-header">{t("auth.header.login")}</h2>
          <div className="padding-text">
            <p className="paragraph">
              {t("auth.paragraph.lorem-register-page")}
            </p>
            <LoadingLink to="/login">
              <LoadingButton
                isLoading={isSubmitting}
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: "#001568",
                  border: "none",
                  fontWeight: 600,
                  marginTop: "12px",
                }}
              >
                {t("auth.buttonTitle.login")}
              </LoadingButton>
            </LoadingLink>
          </div>
          <div className="login-background">
            <img src={images.loginBackground}></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
