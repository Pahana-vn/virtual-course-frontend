import React, { useState } from "react";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";
import Footer from "../../footer";
import SettingsPageHeader from "./settingsPageHeader";
import { Link } from "react-router-dom";
import { useChangePasswordMutation } from "../../../redux/slices/instructor/instructorApiSlice";

const InstructorChangePassword = () => {
  
  const [changePassword ] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.currentPassword.trim()) {
      alert("Current password is required.");
      return;
    }
    if (formData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    if (formData.newPassword === formData.currentPassword) {
      alert("New password cannot be the same as the current password.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirmation password do not match.");
      return;
    }

    try {
      const response = await changePassword(formData).unwrap();
      alert(response.message || "Password changed successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Password not match.");
    }
  };
  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Settings"} />
      {/* Breadcrumb */}
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
                      Change Password
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* sidebar */}
            <InstructorSidebar />
            {/* /Sidebar */}
            {/* Instructor Settings */}
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Settings</h3>
                    <p>
                      You have full control to manage your own account settings
                    </p>
                  </div>
                  <SettingsPageHeader/>
                  <form onSubmit={handleSubmit}>
                    <div className="checkout-form settings-wrap">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">
                              Current Password
                            </label>
                            <input 
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            className="form-control" />
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
                            <label className="form-label">
                              Re-type New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              className="form-control"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
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
            {/* /Instructor Settings */}
          </div>
        </div>
      </div>
      <Footer />
      {/* /Page Content */}
    </div>
  );
};

export default InstructorChangePassword;
