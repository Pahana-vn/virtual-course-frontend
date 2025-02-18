import FeatherIcon from "feather-icons-react";
import React, { useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../../services/authService";
import { LoginImg, logo, NetIcon1, NetIcon2 } from "../../imagepath";

const Login = () => {
  // State cho email, password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Toggle hiển thị password
  const [passwordType, setPasswordType] = useState("password");

  const navigate = useNavigate();

  // OwlCarousel config
  var settings = {
    items: 1,
    margin: 25,
    dots: true,
    nav: true,
    loop: true,
    responsiveClass: true,
    navText: [
      '<i className="fas fa-arrow-left"></i>',
      '<i className="fas fa-arrow-right"></i>',
    ],
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi request login lên server
      const data = await login(email, password);
      // data: { token, accountId, username, roles, ... }

      // Lưu token & accountId
      localStorage.setItem("token", data.token);
      localStorage.setItem("accountId", data.accountId);

      // Tùy role, bạn có thể điều hướng sang trang khác
      // Ở đây ví dụ: nếu roles chứa "INSTRUCTOR" => /instructor-dashboard
      // ngược lại => /student-dashboard
      if (data.roles && data.roles.includes("INSTRUCTOR")) {
        navigate("/instructor/instructor-dashboard");
      } else if (data.roles && data.roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="main-wrapper log-wrap">
      <div className="row">
        {/* Login Banner */}
        <div className="col-md-6 login-bg">
          <OwlCarousel {...settings} className="owl-carousel login-slide owl-theme">
            <div className="welcome-login">
              <div className="login-banner">
                <img src={LoginImg} className="img-fluid" alt="Banner" />
              </div>
              <div className="mentor-course text-center">
                <h2>Welcome to <br />DreamsLMS Courses.</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              </div>
            </div>
            <div className="welcome-login">
              <div className="login-banner">
                <img src={LoginImg} className="img-fluid" alt="Banner" />
              </div>
              <div className="mentor-course text-center">
                <h2>Welcome to <br />DreamsLMS Courses.</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              </div>
            </div>
            <div className="welcome-login">
              <div className="login-banner">
                <img src={LoginImg} className="img-fluid" alt="Banner" />
              </div>
              <div className="mentor-course text-center">
                <h2>Welcome to <br />DreamsLMS Courses.</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              </div>
            </div>
          </OwlCarousel>
        </div>
        {/* /Login Banner */}

        <div className="col-md-6 login-wrap-bg">
          {/* Login */}
          <div className="login-wrapper">
            <div className="loginbox">
              <div className="w-100">
                <div className="img-logo">
                  <img src={logo} className="img-fluid" alt="Logo" />
                  <div className="back-home">
                    <Link to="/home">Back to Home</Link>
                  </div>
                </div>
                <h1>Sign into Your Account</h1>

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="input-block">
                    <label className="form-control-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="input-block">
                    <label className="form-control-label">Password</label>
                    <div className="pass-group">
                      <input
                        type={passwordType}
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                      <span className="toggle-password feather-eye" onClick={togglePassword}>
                        {passwordType === "password" ? <FeatherIcon icon="eye" /> : <FeatherIcon icon="eye-off" />}
                      </span>
                    </div>
                  </div>

                  <div className="forgot">
                    <span>
                      <Link className="forgot-link" to="/forgot-password">
                        Forgot Password?
                      </Link>
                    </span>
                  </div>

                  <div className="remember-me">
                    <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                      Remember me
                      <input type="checkbox" name="radio" />
                      <span className="checkmark" />
                    </label>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-start" type="submit">
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="google-bg text-center">
              <span>
                <Link to="#">Or sign in with</Link>
              </span>
              <div className="sign-google">
                <ul>
                  <li>
                    <Link to="/oauth2/authorization/google">
                      <img src={NetIcon1} className="img-fluid" alt="Logo" />
                      Sign In using Google
                    </Link>
                  </li>
                  <li>
                    <Link to="/oauth2/authorization/facebook">
                      <img src={NetIcon2} className="img-fluid" alt="Logo" />
                      Sign In using Facebook
                    </Link>
                  </li>
                </ul>
              </div>
              <p className="mb-0">
                New User ? <Link to="/register">Create an Account</Link>
              </p>
            </div>
          </div>
          {/* /Login */}
        </div>
      </div>
    </div>
  );
};

export default Login;
