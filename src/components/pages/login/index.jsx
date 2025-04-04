import FeatherIcon from "feather-icons-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useLoginMutation } from "../../../redux/slices/auth/authApiSlice";
import { setCredentials } from "../../../redux/slices/auth/authSlice";
import { LoginImg, logo, NetIcon1, NetIcon2 } from "../../imagepath";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Toggle hiển thị password
  const [passwordType, setPasswordType] = useState("password");
  const [errMsg, setErrMsg] = useState("");
  const [login] = useLoginMutation();

  // Toggle hiển thị mật khẩu
  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  // Validation schema với Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must be a valid format"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Hàm xử lý submit
  const handleSubmit = async (credentials, { setSubmitting }) => {
    setSubmitting(true);
    setErrMsg("");
    try {
      const userData = await login(credentials).unwrap();
      dispatch(setCredentials(userData));
      navigate("/");
    } catch (error) {
      if (!error.data) {
        setErrMsg("No Server Response");
      } else if (error.status === 400) {
        setErrMsg("Invalid email or password");
      } else if (error.status === 401) {
        setErrMsg("Incorrect email or password");
      } else if (error.status === 403) {
        if (error.data.message.includes("pending approval")) {
          setErrMsg("Your account is pending approval. Please wait for admin approval.");
        } else {
          setErrMsg("Email is not verified. Please check your inbox.");
        }
      } else {
        setErrMsg("Login Failed: Unknown error");
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
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
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={false}
                    validateOnBlur={false}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        {errMsg && (
                          <div className="alert alert-danger text-center mb-3">
                            {errMsg}
                          </div>
                        )}
                        {/* Email */}
                        <div className="input-block">
                          <label className="form-control-label" htmlFor="email">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email address"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Password */}
                        <div className="input-block">
                          <label
                            className="form-control-label"
                            htmlFor="password"
                          >
                            Password
                          </label>
                          <div className="pass-group">
                            <Field
                              type={passwordType}
                              name="password"
                              className="form-control"
                              placeholder="Password"
                            />
                            <span
                              className="toggle-password feather-eye"
                              onClick={togglePassword}
                            >
                              {passwordType === "password" ? (
                                <FeatherIcon icon="eye" />
                              ) : (
                                <FeatherIcon icon="eye-off" />
                              )}
                            </span>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Forgot Password */}
                        <div className="forgot">
                          <span>
                            <Link className="forgot-link" to="/forgot-password">
                              Forgot Password?
                            </Link>
                          </span>
                        </div>

                        {/* Remember Me
                        <div className="remember-me">
                          <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                            Remember me
                            <Field type="checkbox" name="rememberMe" />
                            <span className="checkmark" />
                          </label>
                        </div> */}

                        {/* Submit Button */}
                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-start"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
              <div className="google-bg text-center">
                <span>
                  <Link to="#">Or sign in with</Link>
                </span>
                <div className="sign-google">
                  <ul>
                    <li>
                      <Link to="#">
                        <img src={NetIcon1} className="img-fluid" alt="Logo" />{" "}
                        Sign In using Google
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <img src={NetIcon2} className="img-fluid" alt="Logo" />
                        Sign In using Facebook
                      </Link>
                    </li>
                  </ul>
                </div>
                <p className="mb-0">
                  New User ? <Link to="/register">Create an Student Account</Link>
                </p>
                <p className="mb-0">
                  Become a Instructor ? <Link to="/register1">Create a Instructor Account</Link>
                </p>
              </div>
            </div>
          </div>
          {/* /Login */}
        </div>
      </div>
    </>
  );
};

export default Login;
