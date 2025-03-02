import React, { useState } from "react";
import { Link } from "react-router-dom";
import { changeStudentPassword } from "../../../services/studentService";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";
import StudentSettingPageHeader from "./settingPageHeader";

const StudentChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const studentId = localStorage.getItem("studentId"); // Lấy studentId từ localStorage

    if (!studentId) {
      setError("Student ID not found!");
      return;
    }

    try {
      const response = await changeStudentPassword(studentId, formData);
      setMessage(response.message);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to change password.");
    }
  };

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Dashboard"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Settings</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Change Password</li>
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
                    <h3>Change Password</h3>
                    <p>Update your password for security reasons.</p>
                  </div>
                  <StudentSettingPageHeader />
                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="checkout-form settings-wrap">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">Current Password</label>
                            <input
                              type="password"
                              name="currentPassword"
                              className="form-control"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="input-block">
                            <label className="form-label">New Password</label>
                            <input
                              type="password"
                              name="newPassword"
                              className="form-control"
                              value={formData.newPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="input-block">
                            <label className="form-label">Confirm New Password</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              className="form-control"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <button className="btn btn-primary" type="submit">
                            Change Password
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
    </div>
  );
};

export default StudentChangePassword;
