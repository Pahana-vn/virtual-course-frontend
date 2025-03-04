import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchStudentByStudentId, updateStudentProfile } from "../../../services/studentService";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";
import StudentSettingPageHeader from "./settingPageHeader";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36xMCcz67__zewKxiZ1t5bQf1dI01lvQKsBK2nX_mzWfFerwJwZ0WcEAokPCmzPJv42g&usqp=CAU";
const StudentSetting = () => {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      navigate("/login");
    }
  }, [studentId, navigate]);

  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    address: "",
    gender: "",
    phone: "",
    avatar: DEFAULT_AVATAR,
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getStudentData = async () => {
      try {
        const data = await fetchStudentByStudentId(studentId);
        setStudent({
          firstName: data.firstName || "Your First Name",
          lastName: data.lastName || "Your Last Name",
          username: data.username || "",
          dob: data.dob || "2000-01-01",
          address: data.address || "Not Set",
          gender: data.gender || "OTHER",
          phone: data.phone || "",
          avatar: data.avatar || DEFAULT_AVATAR,
          bio: data.bio || "No bio yet.",
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    if (studentId) {
      getStudentData();
    }
  }, [studentId]);

  const validateForm = (data) => {
    let errors = {};

    if (!data.username || data.username.trim() === "") {
      errors.username = "Username is required.";
    } else {
      data.username = data.username.trim();
    }

    if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    const today = new Date();
    const dob = new Date(data.dob);
    if (dob > today) {
      errors.dob = "Date of birth cannot be in the future.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setStudent((prev) => ({ ...prev, avatar: fileUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const validationErrors = validateForm(student);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const updatedStudent = { ...student };

      if (student.avatar && student.avatar.includes("blob:")) {
        const formData = new FormData();
        formData.append("file", e.target.avatar.files[0]);
        formData.append("type", "student");

        const response = await fetch("http://localhost:8080/api/files/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");

        const fileUrl = await response.text();
        updatedStudent.avatar = fileUrl;
      }

      await updateStudentProfile(studentId, updatedStudent);
      setMessage("Profile updated successfully!");

      // Lấy lại dữ liệu mới từ server
      const updatedData = await fetchStudentByStudentId(studentId);
      setStudent(updatedData);
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <>
        <StudentHeader activeMenu={"Settings"} />
        <div className="breadcrumb-bar breadcrumb-bar-info">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="breadcrumb-list">
                  <h2 className="breadcrumb-title">Settings</h2>
                  <nav aria-label="breadcrumb" className="page-breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/home">Home</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Edit Profile
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-content">
          <div className="container">
            <div className="row">
              <StudentSidebar />
              <div className="col-xl-9 col-lg-9">
                <div className="settings-widget card-details">
                  <div className="settings-menu p-0">
                    <div className="profile-heading">
                      <h3>Settings</h3>
                      <p>You have full control to manage your own account settings</p>
                    </div>
                    <StudentSettingPageHeader />
                    <form onSubmit={handleSubmit}>
                      {/* Avatar Section */}
                      <div className="course-group profile-upload-group mb-0 d-flex">
                        <div className="course-group-img profile-edit-field d-flex align-items-center">
                          <Link to="/student/student-profile" className="profile-pic">
                            <img
                              src={student.avatar}
                              onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                              alt="Avatar"
                              className="img-fluid"
                            />
                          </Link>
                          <div className="profile-upload-head">
                            <h4>
                              <Link to="/student/student-profile">Your avatar</Link>
                            </h4>
                            <p>PNG or JPG no bigger than 800px width and height</p>
                            <div className="new-employee-field">
                              <div className="d-flex align-items-center mt-2">
                                <div className="image-upload mb-0">
                                  <input type="file" name="avatar" onChange={handleFileChange} />
                                  <div className="image-uploads">
                                    <i className="bx bx-cloud-upload" />
                                  </div>
                                </div>
                                <div className="img-delete">
                                  <Link to="#" className="delete-icon" onClick={() => setStudent({ ...student, avatar: DEFAULT_AVATAR })}>
                                    <i className="bx bx-trash" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Personal Details Section */}
                      <div className="checkout-form settings-wrap">
                        <div className="edit-profile-info">
                          <h5>Personal Details</h5>
                          <p>Edit your personal information</p>
                        </div>
                        {message && <p className="alert alert-info">{message}</p>}
                        <div className="row">
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">First Name</label>
                              <input type="text" name="firstName" value={student.firstName} onChange={handleChange} className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">Last Name</label>
                              <input type="text" name="lastName" value={student.lastName} onChange={handleChange} className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">Username</label>
                              <input type="text" name="username" value={student.username} onChange={handleChange} className={`form-control ${errors.username ? "is-invalid" : ""}`} />
                              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">Phone Number</label>
                              <input type="text" name="phone" value={student.phone} onChange={handleChange} className={`form-control ${errors.phone ? "is-invalid" : ""}`} />
                              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">Date of Birth</label>
                              <input type="date" name="dob" value={student.dob ? student.dob.substring(0, 10) : ""} onChange={handleChange} className={`form-control ${errors.dob ? "is-invalid" : ""}`} />
                              {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">Gender</label>
                              <select name="gender" value={student.gender} onChange={handleChange} className="form-control">
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="input-block">
                              <label className="form-label">Address</label>
                              <input type="text" name="address" value={student.address} onChange={handleChange} className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="input-block">
                              <label className="form-label">Bio</label>
                              <textarea name="bio" value={student.bio} onChange={handleChange} className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                              {loading ? "Updating..." : "Update Profile"}
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
        </div>
      </>
    </div>
  );
};

export default StudentSetting;
