import "../header/header.css";

import { faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { useTranslation } from "react-i18next";

import LoadingLink from "../../common/links/LoadingLink";
import Dropdown from "react-bootstrap/Dropdown";
import {DropdownButton} from "react-bootstrap";  
import AppLogo from "../../../assets/images/logo.png";

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header id="header-part">
      <div className="navigation">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-2 col-sm-3 col-4">
              <div className="right-icon">
                <ul>
                  <li>
                    <LoadingLink to="/" style={{ textDecoration: "none" }}>
                      <img
                        src={AppLogo}
                        alt="Logo"
                        width="120px"
                      />
                    </LoadingLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-9 col-8">
              <nav className="navbar navbar-expand-lg justify-content-end">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <div
                  className="collapse navbar-collapse sub-menu-bar justify-content-end"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav align-items-center">
                    <li className="nav-item">
                      <LoadingLink
                        className="active"
                        to="/"
                        style={{ textDecoration: "none" }}
                      >
                        {t("homePage.header.home")}
                      </LoadingLink>
                    </li>
                    <li className="nav-item">
                      <LoadingLink
                        to="/tests"
                        style={{ textDecoration: "none" }}
                      >
                        {t("homePage.header.test")}
                      </LoadingLink>
                    </li>
                    <li className="nav-item">
                      <LoadingLink
                        to="/student/chat-bot"
                        style={{ textDecoration: "none" }}
                      >
                        {t("homePage.header.chatBot")}
                      </LoadingLink>
                    </li>
                    <>
                      <li className="nav-item">
                        <div className="dropdown">
                          <LoadingLink to="/classroom">Lớp học</LoadingLink>
                          <div className="dropdown-content">
                            <LoadingLink to="/join-class">Tham gia</LoadingLink>
                            {auth.user?.roles.includes("teacher") && (
                              <LoadingLink to="/add-class">Tạo mới</LoadingLink>
                            )}
                          </div>
                        </div>
                      </li>
                      {/* <li className="nav-item">
                          <LoadingLink
                            to="/upload"
                            style={{ textDecoration: "none" }}
                          >
                            <FontAwesomeIcon icon={faUpload} />
                            <span className="description">
                              Tải tài liệu lên
                            </span>
                          </LoadingLink>
                        </li> */}
                    </>
                    <li className="nav-item px-0">
                      <div className="veritical-line-sm"></div>
                    </li>
                    {auth.user ? (
                      <DropdownButton
                        id="dropdown-basic-button"
                        className="user-dropdown"
                        title={<FontAwesomeIcon icon={faUser} />}
                      >
                        <Dropdown.Item href="#">
                          {t("homePage.dropdown.profile")}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                          {t("homePage.dropdown.logout")}
                        </Dropdown.Item>
                      </DropdownButton>
                    ) : (
                      <>
                        <li className="nav-item">
                          <a
                            href="/login"
                            className="main-btn"
                            style={{ textDecoration: "none" }}
                          >
                            {t("homePage.header.login")}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="/register"
                            style={{ textDecoration: "underline" }}
                          >
                            {t("homePage.header.register")}
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
