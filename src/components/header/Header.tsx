// import {} from 'react-bootstrap'

function Header() {
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
                      <img src="./src/assets/images/logo-future-me.png" alt="Logo" width="120px" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-9 col-8">
              <nav className="navbar navbar-expand-lg justify-content-end">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <div className="collapse navbar-collapse sub-menu-bar justify-content-end" id="navbarSupportedContent">
                  <ul className="navbar-nav align-items-center">
                    <li className="nav-item">
                      <a className="active" href="index-2.html">Home</a>
                      <ul className="sub-menu">
                        <li><a className="active" href="index-2.html">Home 01</a></li>
                        <li><a href="index-3.html">Home 02</a></li>
                        <li><a href="index-4.html">Home 03</a></li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a href="about.html">About us</a>
                    </li>
                    <li className="nav-item">
                      <a href="courses.html">Courses</a>
                      <ul className="sub-menu">
                        <li><a href="courses.html">Courses</a></li>
                        <li><a href="courses-singel.html">Course Singel</a></li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a href="courses.html">Courses</a>
                      <ul className="sub-menu">
                        <li><a href="courses.html">Courses</a></li>
                        <li><a href="courses-singel.html">Course Singel</a></li>
                      </ul>
                    </li>
                    <li className="nav-item px-0">
                      <div className="veritical-line-sm"></div>
                    </li>
                    <li className="nav-item">
                      <a href="#" className="main-btn">Login</a>
                    </li>
                    <li className="nav-item">
                      <a href="courses.html" style={{ "textDecoration": 'underline' }}>Sign In</a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

    </header>
  )
}

export default Header
