import React, { useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logo, RegisterImg } from "../../../../src/components/imagepath";
import { Link, useNavigate } from "react-router-dom";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { resetRegister, setSocialInfo } from "../../../redux/slices/instructor/registerSlice";
import { useInstructorRegisterMutation, useResendVerificationEmailMutation } from "../../../redux/slices/auth/authApiSlice";

const RegisterThree = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const percentage = 66;

  const accountInfo = useSelector((state) => state.register.accountInfo);
  const personalInfo = useSelector((state) => state.register.personalInfo);
  const socialInfo = useSelector((state) => state.register.socialInfo);

  // useEffect(() => {
  //   if (!accountInfo.email) {
  //     navigate("/login");
  //   }
  // }, [accountInfo, navigate]);

  const [registerInstructor] = useInstructorRegisterMutation();
  const [resendVerificationEmail] = useResendVerificationEmailMutation();

  const [facebookUrl, setFacebookUrl] = useState(socialInfo.facebookUrl || "");
  const [googleUrl, setGoogleUrl] = useState(socialInfo.googleUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(socialInfo.linkedinUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(socialInfo.instagramUrl || "");
  const { avatarFileName } = personalInfo;
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

      const handleFinish = async (e) => {
    e.preventDefault(); // Chặn reload trang

    dispatch(
      setSocialInfo({
        facebookUrl,
        googleUrl,
        linkedinUrl,
        instagramUrl,
      })
    );

    try {
      const completeData = {
        avatarFileName,
        ...accountInfo,
        ...personalInfo,
        facebookUrl,
        googleUrl,
        linkedinUrl,
        instagramUrl,
      };

      const response = await registerInstructor(completeData).unwrap();
      if (response && response.message) {
        toast.success(response.message, { position: "top-right", });
      }

      await resendVerificationEmail(accountInfo.email);

      dispatch(resetRegister()); // Xóa dữ liệu đăng ký sau khi hoàn tất
      navigate("/verify-email-notice");
    } catch (err) {
      if (err.data && err.data.message) {
        toast.error(err.data.message, { position: "top-right", });
      } else {
        toast.error("Failed to create instructor. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
    <ToastContainer autoClose={3000} />
      <div className="main-wrapper">
        <div className="row">
          {/* Login Banner */}
          <div className="col-lg-4 col-md-6 login-bg">
            <OwlCarousel
             {...settings}
             className="owl-carousel login-slide owl-theme">
              <div className="welcome-login register-step">
                <div className="login-banner">
                  <img
                    src={RegisterImg}
                    className="img-fluid"
                    alt="Logo"
                  />
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
              <div className="welcome-login register-step">
                <div className="login-banner">
                  <img
                    src={RegisterImg}
                    className="img-fluid"
                    alt="Logo"
                  />
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
              <div className="welcome-login register-step">
                <div className="login-banner">
                  <img
                    src={RegisterImg}
                    className="img-fluid"
                    alt="Logo"
                  />
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
          <div className="col-lg-8 col-md-6 login-wrap-bg">
            {/* Login */}
            <div className="login-wrapper">
              <div className="loginbox register-box">
                <div className="img-logo">
                  <img
                    src={logo}
                    className="img-fluid"
                    alt="Logo"
                  />
                  <div className="back-home">
                    <Link to="/login">Back to Home</Link>
                  </div>
                </div>
                <h1>Become An Instructor</h1>
                <div className="row">
                  <div className="col-lg-5">
                    <div className="profile-box">
                    <div className="circle-bar circle-bar1 text-center">
                      <div className="circle-graph1" style={{ width: 120, height: 120, backGroungColor:"#159F46" }}>
                      <CircularProgressbarWithChildren value={percentage} text={`${percentage}%`} 
                      styles={buildStyles({
                        textColor:"#159F46",
                        pathColor:"#159F46"
                      })}>
                        <div style={{ marginTop:"35px"}}>2 of 3 </div>
                      </CircularProgressbarWithChildren>
                      </div>
                    </div>
                    <h3>Profile Compleation</h3>
                    <div className="personal-detail d-flex align-items-center">
                      <span className="active-color"><i className="fa-solid fa-check" /></span>
                      <div className="personal-text">
                        <h4>Account Profiles</h4>
                        <p className="mb-0">Setup your account profiles</p>
                      </div>
                    </div>
                    <div className="personal-detail d-flex align-items-center">
                    <span className="active-color"><i className="fa-solid fa-check" /></span>
                      <div className="personal-text">
                        <h4>Personal Details</h4>
                        <p className="mb-0">Setup your personal details</p>
                      </div>
                    </div>
                    <div className="personal-detail d-flex align-items-center">
                      <span className="active-color active-bar">3</span>
                      <div className="personal-text">
                        <h4>Social Profiles</h4>
                        <p className="mb-0">
                        Setup your social profiles links
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                  <div className="col-lg-7">
                    <div className="personal-form">
                      <h4>Social Profiles</h4>
                      <form onSubmit={handleFinish}>
                        <div className="input-block">
                          <label className="form-control-label">Google</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Google Profile URL"
                            value={googleUrl}
                            onChange={(e) => setGoogleUrl(e.target.value)}
                          />
                        </div>
                        <div className="input-block">
                          <label className="form-control-label">Facebook</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Facebook Profile URL"
                            value={facebookUrl}
                            onChange={(e) => setFacebookUrl(e.target.value)}
                          />
                        </div>
                        <div className="input-block">
                          <label className="form-control-label">
                            LinkedIn
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="LinkedIn Profile URL"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                          />
                        </div>
                        <div className="input-block">
                          <label className="form-control-label">Instagram</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Instagram Profile URL"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                          />
                        </div>
                        <div className="btn-group d-flex">
                          <div className="back-btn">
                            <Link
                              to="/register2"
                              className="btn btn-back"
                              type="submit"
                            >
                              Back
                            </Link>
                          </div>
                          <div className="next-btn">
                            <button className="btn btn-start">
                              Finish
                            </button>
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
      </div>
    </>
  );
};

export default RegisterThree;
