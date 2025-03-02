import React, { useEffect, useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logo, RegisterImg } from "../../../../src/components/imagepath";
import { Link, useNavigate } from "react-router-dom";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch } from "react-redux";
import { setAccountInfo } from "../../../redux/slices/instructor/registerSlice";
import {
  useLazyCheckEmailExistQuery,
  useLazyCheckUsernameExistQuery,
} from "../../../redux/slices/auth/authApiSlice";
import { useSelector } from "react-redux";

const hasNumber = (value) => new RegExp(/[0-9]/).test(value);
const hasMixed = (value) =>
  new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
const hasSpecial = (value) => new RegExp(/[!#@$%^&*)(+=._-]/).test(value);

const strengthColor = (count) => {
  switch (count) {
    case 1:
      return "poor";
    case 2:
      return "weak";
    case 3:
      return "strong";
    case 4:
      return "heavy";
    default:
      return "";
  }
};

const RegisterOne = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const percentage = 0;

  const accountInfo = useSelector((state) => state.register.accountInfo);

  const [email, setEmail] = useState(accountInfo.email || "");
  const [username, setUsername] = useState(accountInfo.username || "");
  const [password, setPassword] = useState(accountInfo.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [validationError, setValidationError] = useState("");
  const [eye, setEye] = useState(true);
  const [confirmEye, setConfirmEye] = useState(true);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [passwordStrengthError, setPasswordStrengthError] = useState("");

  const [checkEmailExist] = useLazyCheckEmailExistQuery();
  const [checkUsernameExist] = useLazyCheckUsernameExistQuery();

  useEffect(() => {
    if (password) {
      let str = strengthIndicator(password);
      setStrength(strengthColor(str));

      if (str < 2) {
        setPasswordStrengthError(
          "Password is too weak! Please make it stronger."
        );
      } else {
        setPasswordStrengthError("");
      }
    } else {
      setStrength("");
      setPasswordStrengthError("");
    }
  }, [password]);

  var settings = {
    //autoWidth: true,
    items: 2,
    margin: 25,
    dots: true,
    nav: true,
    navText: [
      '<i className="fas fa-arrow-left"></i>',
      '<i className="fas fa-arrow-right"></i>',
    ],

    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 1,
      },
      1170: {
        items: 1,
      },
    },
  };

  const strengthIndicator = (value) => {
    let strengths = 0;
    if (value.length >= 8) strengths++;
    if (hasNumber(value)) strengths++;
    if (hasSpecial(value)) strengths++;
    if (hasMixed(value)) strengths++;

    return strengths;
  };

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
      return (
        <span style={{ fontSize: 12, color: "#DC3545" }}>
          😠 Weak. Must contain at least 8 characters
        </span>
      );
    } else if (validationError === 3) {
      return (
        <span style={{ fontSize: 12, color: "#FFC107" }}>
          😲 Average. Must contain at least 1 letter or number
        </span>
      );
    } else if (validationError === 4) {
      return (
        <span style={{ fontSize: 12, color: "#0D6EFD" }}>
          🙂 Almost. Must contain special symbol
        </span>
      );
    } else if (validationError === 5) {
      return (
        <span style={{ fontSize: 12, color: "#4BB543" }}>
          😊 Awesome! You have a secure password.
        </span>
      );
    }
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

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
    if (confirmPassword && confirmPassword !== value) {
      setPasswordMatchError("Passwords do not match!");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordMatchError("Passwords do not match!");
    } else {
      setPasswordMatchError("");
    }
  };

  const onEyeClick = () => {
    setEye(!eye);
  };

  const onConfirmEyeClick = () => {
    setConfirmEye(!confirmEye);
  };

  const handleNextStep = async (e) => {
    e.preventDefault();

    if (strengthColor(strengthIndicator(password)) === "poor") {
      toast.error("Your password is too weak!", { position: "top-right" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }

    try {
      const emailResponse = await checkEmailExist(email).unwrap();
      if (emailResponse.exists) {
        toast.error("Email already exists!", { position: "top-right" });
        return;
      }

      const usernameResponse = await checkUsernameExist(username).unwrap();
      if (usernameResponse.exists) {
        toast.error("Username already exists!", { position: "top-right" });
        return;
      }

      dispatch(
        setAccountInfo({
          email,
          username,
          password,
        })
      );
      navigate("/register2");
    } catch (error) {
      toast.error("Error checking email or username!", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="main-wrapper">
        <div className="col-lg-4 col-md-6 login-bg">
          <OwlCarousel
            {...settings}
            className="owl-carousel login-slide owl-theme"
          >
            <div className="welcome-login register-step">
              <div className="login-banner">
                <img src={RegisterImg} className="img-fluid" alt="Logo" />
              </div>
              <div className="mentor-course text-center">
                <h2>
                  Welcome to <br />
                  Virtual Course Network.
                </h2>
                <p>
                  Where knowledge knows no boundaries. Explore a wide range of
                  flexible online courses that help you learn and grow anytime,
                  anywhere.
                </p>
              </div>
            </div>
            <div className="welcome-login register-step">
              <div className="login-banner">
                <img src={RegisterImg} className="img-fluid" alt="Logo" />
              </div>
              <div className="mentor-course text-center">
                <h2>
                  Welcome to <br />
                  Virtual Course Network.
                </h2>
                <p>
                  Where knowledge knows no boundaries. Explore a wide range of
                  flexible online courses that help you learn and grow anytime,
                  anywhere.
                </p>
              </div>
            </div>
            <div className="welcome-login register-step">
              <div className="login-banner">
                <img src={RegisterImg} className="img-fluid" alt="Logo" />
              </div>
              <div className="mentor-course text-center">
                <h2>
                  Welcome to <br />
                  Virtual Course Network.
                </h2>
                <p>
                  Where knowledge knows no boundaries. Explore a wide range of
                  flexible online courses that help you learn and grow anytime,
                  anywhere.
                </p>
              </div>
            </div>
          </OwlCarousel>
        </div>

        <div className="col-lg-8 col-md-6 login-wrap-bg">
          {/* Login */}
          <div className="login-wrapper">
            <div className="loginbox register-box">
              <div className="img-logo">
                <img src={logo} className="img-fluid" alt="Logo" />
                <div className="back-home">
                  <Link to="/login">Back to Home</Link>
                </div>
              </div>
              <h1>Become An Instructor</h1>
              <div className="row">
                <div className="col-lg-5">
                  <div className="profile-box">
                    <div className="circle-bar circle-bar1 text-center">
                      <div
                        className="circle-graph1"
                        style={{ width: 120, height: 120 }}
                      >
                        <CircularProgressbarWithChildren
                          value={percentage}
                          text={`${percentage}%`}
                          styles={buildStyles({
                            textColor: "#159F46",
                            pathColor: "#159F46",
                          })}
                        >
                          <div style={{ marginTop: "35px" }}>1 of 3 </div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </div>
                    <h3>Profile Compleation</h3>
                    <div className="personal-detail d-flex align-items-center">
                      <span className="active-color active-bar">1</span>
                      <div className="personal-text">
                        <h4>Account Profiles</h4>
                        <p className="mb-0">Setup your account profiles</p>
                      </div>
                    </div>
                    <div className="personal-detail d-flex align-items-center">
                      <span>2</span>
                      <div className="personal-text">
                        <h4>Personal Details</h4>
                        <p className="mb-0">Setup your personal details</p>
                      </div>
                    </div>
                    <div className="personal-detail d-flex align-items-center">
                      <span>3</span>
                      <div className="personal-text">
                        <h4>Social Profiles</h4>
                        <p className="mb-0">Setup your social profiles links</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="personal-form">
                    <h4>Account Profiles</h4>
                    <form onSubmit={handleNextStep}>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Email<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Username<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Password<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="pass-group" id="passwordInput">
                              <input
                                className="form-control pass-input"
                                placeholder="Enter your password"
                                type={eye ? "password" : "text"}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                onPaste={(e) => e.preventDefault()}
                                onCopy={(e) => e.preventDefault()}
                              />
                              {passwordStrengthError && (
                                <span
                                  style={{ color: "red", fontSize: "12px" }}
                                >
                                  {passwordStrengthError}
                                </span>
                              )}
                              <span
                                onClick={onEyeClick}
                                className={`fa toggle-password feather-eye ${
                                  eye ? "fa-eye" : "fa-eye-slash"
                                }`}
                              />
                              <span className="pass-checked">
                                <i className="feather-check"></i>
                              </span>
                            </div>

                            {/* Thanh đánh giá độ mạnh password */}
                            <div
                              id="passwordStrength"
                              style={{ display: "flex" }}
                              className={`password-strength ${
                                strength === "poor"
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
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Confirm Password
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="pass-group">
                              <input
                                className="form-control pass-input"
                                placeholder="Re-enter your password"
                                type={confirmEye ? "password" : "text"}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                onPaste={(e) => e.preventDefault()}
                                onCopy={(e) => e.preventDefault()}
                              />
                              <span
                                onClick={onConfirmEyeClick}
                                className={`fa toggle-password feather-eye ${
                                  confirmEye ? "fa-eye" : "fa-eye-slash"
                                }`}
                              />
                            </div>
                            {passwordMatchError && (
                              <span style={{ fontSize: 12, color: "#DC3545" }}>
                                {passwordMatchError}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="next-btn">
                            <button className="btn btn-start" type="submit">
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Login */}
        </div>
      </div>
    </>
  );
};

export default RegisterOne;
