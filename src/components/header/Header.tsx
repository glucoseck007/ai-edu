import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();

  return (
    <header id="header-part">
      <div className="navigation">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-2 col-sm-3 col-4">
              <div className="right-icon">
                <ul>
                  <li>
                    <a href="index-2.html">
                      <img
                        src="./src/assets/images/logo-future-me.png"
                        alt="Logo"
                        width="120px"
                      />
                    </a>
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
                      <a className="active">{t("homePage.header.home")}</a>
                    </li>
                    <li className="nav-item">
                      <a href="courses.html">{t("homePage.header.test")}</a>
                    </li>
                    <li className="nav-item">
                      <a href="#" className="main-btn">
                        {t("homePage.header.login")}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a style={{ "textDecoration": "underline" }}>
                        {t("homePage.header.register")}
                      </a>
                    </li>
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
