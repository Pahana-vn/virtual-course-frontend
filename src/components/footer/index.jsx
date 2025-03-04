import React from "react";
import { Link } from "react-router-dom";
import { Icon19, Icon20, Icon21, logo } from "../imagepath";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-about">
                <div className="footer-logo">
                  <img src={logo} alt="logo" />
                </div>
                <div className="footer-about-content">
                  <p>
                    At Virtual Course Network, we break down barriers to learning. With a diverse selection of high-quality courses, you can expand your knowledge anytime, anywhere—without limits.
                  </p>
                </div>
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Instructor</h2>
                <ul>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register1">Register</Link>
                  </li>
                </ul>
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-2 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-menu">
                <h2 className="footer-title">For Student</h2>
                <ul>

                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>

                </ul>
              </div>
              {/* /Footer Widget */}
            </div>
            <div className="col-lg-4 col-md-6">
              {/* Footer Widget */}
              <div className="footer-widget footer-contact">

                <div className="footer-contact-info">
                  <div className="footer-address">
                    <img src={Icon20} alt="" className="img-fluid" />
                    <p>
                      {" "}
                      62 Street 36, Van Phuc Urban Area, Thu Duc, Ho Chi Minh 71300
                    </p>
                  </div>
                  <p>
                    <img src={Icon19} alt="" className="img-fluid" />
                    virtualcourselms@example.com
                  </p>
                  <p className="mb-0">
                    <img src={Icon21} alt="" className="img-fluid" />
                    +19 123-456-7890
                  </p>
                </div>
              </div>
              {/* /Footer Widget */}
            </div>
          </div>
        </div>
      </div>
      {/* /Footer Top */}
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          {/* Copyright */}
          <div className="copyright">
            <div className="row">

              <div className="col-md-12">
                <div className="copyright-text">
                  <p className="mb-0">© 2025 VirtualCourseLMS. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
          {/* /Copyright */}
        </div>
      </div>
      {/* /Footer Bottom */}
    </footer>
  );
};

export default Footer;
