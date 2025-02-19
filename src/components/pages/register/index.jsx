import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../../services/authService";
import { LoginImg, logo, NetIcon1, NetIcon2 } from "../../imagepath";

const hasNumber = (value) => new RegExp(/[0-9]/).test(value);
const hasMixed = (value) => new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
const hasSpecial = (value) => new RegExp(/[!#@$%^&*)(+=._-]/).test(value);

const strengthColor = (count) => {
  if (count < 1) return "poor";
  if (count < 2) return "weak";
  if (count < 3) return "strong";
  if (count < 4) return "heavy";
};

const Register = () => {
  // Thông tin form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Thêm role nếu bạn muốn cho user chọn: STUDENT, INSTRUCTOR, ...
  // Mặc định "STUDENT" nếu không có yêu cầu
  // const [role, setRole] = useState("STUDENT");

  // Các state cũ cho kiểm tra độ mạnh mật khẩu
  const [validationError, setValidationError] = useState("");
  const [strength, setStrength] = useState("");
  const [eye, setEye] = useState(true);

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

  // Toggle password
  const onEyeClick = () => {
    setEye(!eye);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // Kiểm tra password
  const validatePassword = (value) => {
    if (!value) {
      setValidationError(1);
    } else if (value.length < 8) {
      setValidationError(2);
    } else if (!/[0-9]/.test(value)) {
      setValidationError(3);
    } else if (!/[!@#$%^&*()]/.test(value)) {
      setValidationError(4);
    } else {
      setValidationError(5);
    }
  };

  const messages = () => {
    if (validationError === 1) {
      return "";
    } else if (validationError === 2) {
      return <span style={{ fontSize: 12, color: "#DC3545" }}>
        😠 Weak. Must contain at least 8 characters
      </span>;
    } else if (validationError === 3) {
      return <span style={{ fontSize: 12, color: "#FFC107" }}>
        😲 Average. Must contain at least 1 letter or number
      </span>;
    } else if (validationError === 4) {
      return <span style={{ fontSize: 12, color: "#0D6EFD" }}>
        🙂 Almost. Must contain special symbol
      </span>;
    } else if (validationError === 5) {
      return <span style={{ fontSize: 12, color: "#4BB543" }}>
        😊 Awesome! You have a secure password.
      </span>;
    }
  };

  const strengthIndicator = (value) => {
    let strengths = 0;
    if (value.length >= 8) strengths = 1;
    if (hasNumber(value) && value.length >= 8) strengths = 2;
    if (hasSpecial(value) && value.length >= 8 && hasNumber(value)) strengths = 3;
    if (hasMixed(value) && hasSpecial(value) && value.length >= 8 && hasNumber(value)) strengths = 3;
    return strengths;
  };

  useEffect(() => {
    if (password) {
      let str = strengthIndicator(password);
      let color = strengthColor(str);
      setStrength(color);
    } else {
      setStrength("");
    }
  }, [password]);

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ở đây, "fullName" bạn có thể tách ra firstName/lastName 
      // nếu backend yêu cầu. Tạm thời coi fullName = username
      const result = await register(fullName, email, password);
      // result: { message: "..."} hoặc lỗi

      alert(result.message || "Register successful!");
      // Chuyển sang trang login
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error.response || error.message);
      alert("Register failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
<<<<<<< HEAD
    <>
      <div className="main-wrapper log-wrap">
        <div className="row">
          {/* Login Banner */}
          <div className="col-md-6 login-bg">
            <OwlCarousel
              {...settings}
              className="owl-carousel login-slide owl-theme"
            >
              <div className="welcome-login">
                <div className="login-banner">
                  <img src={LoginImg} className="img-fluid" alt="Logo" />
                </div>
                <div className="mentor-course text-center">
                <h2>
                    Welcome to <br />
                    Virtual Course Network.
                  </h2>
                  <p>
                  Where knowledge knows no boundaries. Explore a wide range of flexible online courses that help you learn and grow anytime, anywhere.
                  </p>
                </div>
              </div>
              <div className="welcome-login">
                <div className="login-banner">
                  <img src={LoginImg} className="img-fluid" alt="Logo" />
                </div>
                <div className="mentor-course text-center">
                <h2>
                    Welcome to <br />
                    Virtual Course Network.
                  </h2>
                  <p>
                  Where knowledge knows no boundaries. Explore a wide range of flexible online courses that help you learn and grow anytime, anywhere.
                  </p>
                </div>
              </div>
              <div className="welcome-login">
                <div className="login-banner">
                  <img src={LoginImg} className="img-fluid" alt="Logo" />
                </div>
                <div className="mentor-course text-center">
                <h2>
                    Welcome to <br />
                    Virtual Course Network.
                  </h2>
                  <p>
                  Where knowledge knows no boundaries. Explore a wide range of flexible online courses that help you learn and grow anytime, anywhere.
                  </p>
=======
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
          {/* Register */}
          <div className="login-wrapper">
            <div className="loginbox">
              <div className="img-logo">
                <img src={logo} className="img-fluid" alt="Logo" />
                <div className="back-home">
                  <Link to="/home">Back to Home</Link>
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
                </div>
              </div>
              <h1>Sign up</h1>
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="input-block">
                  <label className="form-control-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

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
                  <div className="pass-group" id="passwordInput">
                    <input
                      className="form-control pass-input"
                      placeholder="Enter your password"
                      type={eye ? "password" : "text"}
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <span onClick={onEyeClick} className={`fa toggle-password feather-eye ${eye ? "fa-eye" : "fa-eye-slash"}`} />
                    <span className="pass-checked">
                      <i className="feather-check"></i>
                    </span>
                  </div>

                  {/* Thanh đánh giá độ mạnh password */}
                  <div
                    id="passwordStrength"
                    style={{ display: "flex" }}
                    className={`password-strength ${strength === "poor"
                      ? "poor-active"
                      : strength === "weak"
                        ? "avg-active"
                        : strength === "strong"
                          ? "strong-active"
                          : strength === "heavy"
                            ? "heavy-active"
                            : ""
                      }`}
                  >
                    <span id="poor" className="active"></span>
                    <span id="weak" className="active"></span>
                    <span id="strong" className="active"></span>
                    <span id="heavy" className="active"></span>
                  </div>
                  <div id="passwordInfo">{messages()}</div>
                </div>

                <div className="form-check remember-me">
                  <label className="form-check-label mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="remember"
                      required
                    />
                    I agree to the&nbsp;
                    <Link to="/term-condition">Terms of Service</Link> and&nbsp;
                    <Link to="/privacy-policy">Privacy Policy.</Link>
                  </label>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-start" type="submit">
                    Create Account
                  </button>
                </div>
              </form>
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
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
          {/* /Register */}
        </div>
      </div>
    </div>
  );
};

export default Register;
