import React, { useEffect, useRef, useState } from "react";
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
import AvatarEditor from "react-avatar-editor";
import { useDispatch } from "react-redux";
import { setPersonalInfo } from "../../../redux/slices/instructor/registerSlice";
import axios from "axios";
import { useSelector } from "react-redux";

const RegisterTwo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const percentage = 33;

  const personalInfo = useSelector((state) => state.register.personalInfo);
  const accountInfo = useSelector((state) => state.register.accountInfo);

  useEffect(() => {
    if (!accountInfo.email) {
      navigate("/register1");
    }
  }, [accountInfo, navigate]);

  const [firstName, setFirstName] = useState(personalInfo.firstName || "");
  const [lastName, setLastName] = useState(personalInfo.lastName || "");
  const [phone, setPhone] = useState(personalInfo.phone || "");
  const [gender, setGender] = useState(personalInfo.gender || "");
  const [address, setAddress] = useState(personalInfo.address || "");
  const [title, setTitle] = useState(personalInfo.title || "");
  const [workplace, setWorkplace] = useState(personalInfo.workplace || "");
  const [bio, setBio] = useState(personalInfo.bio || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [scale, setScale] = useState(1.2);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const editorRef = useRef(null);

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

  const validatePhoneNumber = (phone) => {
    // Biểu thức chính quy kiểm tra số điện thoại hợp lệ (cho Việt Nam)
    const phoneRegex = /^(0[1-9]{1}[0-9]{8})$/;
    return phoneRegex.test(phone);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.warn("No avatar image selected.");
      return;
    }
    setSelectedImage(URL.createObjectURL(file)); // Hiển thị ảnh trước khi crop
    setIsSaveDisabled(false);
  };

  const getCroppedImage = async () => {
    if (!editorRef.current) return null;
    return new Promise((resolve) => {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  // Xử lý chọn ảnh từ input file
  const uploadCroppedImage = async () => {
    setIsUploading(true);
    setUploadError("");

    const croppedBlob = await getCroppedImage();
    if (!croppedBlob) {
      setUploadError("Error cropping image. Please try again.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", croppedBlob, "avatar.jpg");
    formData.append("type", "instructor"); // Lưu vào thư mục avatars

    try {
      // Gọi API tải ảnh
      const response = await axios.post(
        "http://localhost:8080/api/files/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!response.data) throw new Error("No response from server");
      const fileUrl = response.data;
      setAvatarUrl(fileUrl);

      const fileName = fileUrl.split("/").pop(); // Lấy tên ảnh từ URL
      setAvatarFileName(fileName);

      toast.success("Avatar uploaded successfully!");
      setIsSaveDisabled(true);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phone)) {
      toast.error("Please enter a valid phone number.", {
        position: "top-right",
      });
      return;
    }

    if (selectedImage && !isSaveDisabled) {
      toast.error("Please save your avatar before proceeding!", {
        position: "top-right",
      });
      return;
    }

    if (!avatarUrl) {
      await uploadCroppedImage(); // Nếu chưa tải ảnh, mới thực hiện tải ảnh
    }
   
    if (avatarFileName && avatarUrl) {
      dispatch(
        setPersonalInfo({
          firstName,
          lastName,
          phone,
          gender,
          address,
          title,
          workplace,
          bio,
          photo: avatarFileName, // Lưu tên file ảnh vào Redux
        })
      );

      navigate("/register3");
    } else {
      toast.error("Avatar is not available. Please try again", {
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
                          <div style={{ marginTop: "35px" }}>2 of 3 </div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </div>
                    <h3>Profile Compleation</h3>
                    <div className="personal-detail d-flex align-items-center">
                      <span className="active-color">
                        <i className="fa-solid fa-check" />
                      </span>
                      <div className="personal-text">
                        <h4>Account Profiles</h4>
                        <p className="mb-0">Setup your account profiles</p>
                      </div>
                    </div>
                    <div className="personal-detail d-flex align-items-center">
                      <span className="active-color active-bar">2</span>
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
                    <h4>Personal Details</h4>
                    <form onSubmit={handleNextStep}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="input-block">
                            <label className="form-control-label">
                              Upload Avatar<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="form-control"
                            />
                            {isUploading && <div className="spinner"></div>}
                            {uploadError && (
                              <p style={{ color: "red" }}>{uploadError}</p>
                            )}
                          </div>
                        </div>
                        {/* Hiển thị AvatarEditor nếu có ảnh */}
                        {selectedImage && (
                          <div className="col-lg-12 text-center">
                            <div className="row">
                              <div
                                className="col-lg-8"
                                style={{
                                  width: "260px", // Đặt chiều rộng tổng thể
                                  height: "260px", // Đặt chiều cao tổng thể
                                  // borderRadius: "50%", // Bo tròn khung ngoài cùng
                                  overflow: "hidden", // Ẩn phần ảnh bị tràn ra ngoài
                                  border: "5px solid #ddd", // Tạo viền bên ngoài (tùy chỉnh màu)
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <AvatarEditor
                                  ref={editorRef}
                                  image={selectedImage}
                                  width={200} // Chiều rộng ảnh crop
                                  height={200} // Chiều cao ảnh crop
                                  border={30} // Viền xung quanh ảnh
                                  scale={scale} // Scale ảnh (zoom in/out)
                                  rotate={0} // Xoay ảnh nếu cần
                                  borderRadius={100}
                                />
                              </div>
                              <div className="col-lg-4 mt-2">
                                <input
                                  type="range"
                                  min="1"
                                  max="3"
                                  step="0.1"
                                  value={scale}
                                  onChange={(e) =>
                                    setScale(parseFloat(e.target.value))
                                  }
                                  style={{ width: "100%" }}
                                />
                                <button
                                  className="btn btn-primary mt-2"
                                  type="button"
                                  onClick={uploadCroppedImage}
                                  disabled={isSaveDisabled}
                                >
                                  Save Avatar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              First Name<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your first Name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Last Name<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your last Name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">Phone<span style={{ color: "red" }}>*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your phone number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Work Place<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your work place"
                              value={workplace}
                              onChange={(e) => setWorkplace(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label
                              htmlFor="sel1"
                              className="form-control-label"
                            >
                              Gender<span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              className="form-select"
                              id="sel1"
                              name="sellist1"
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">
                              Address<span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-block">
                            <label className="form-control-label">Title<span style={{ color: "red" }}>*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter your title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-block">
                            <label className="form-control-label">Bio<span style={{ color: "red" }}>*</span></label>
                            <textarea
                              className="form-control"
                              placeholder="Write something about yourself..."
                              rows="4"
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="btn-group d-flex">
                        <div className="back-btn">
                          <Link
                            to="/register1"
                            className="btn btn-back"
                            type="submit"
                          >
                            Back
                          </Link>
                        </div>
                        <div className="next-btn">
                          <button className="btn btn-start">Next</button>
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

export default RegisterTwo;
