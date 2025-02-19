import React, {useState} from "react";
import { useSelector } from "react-redux";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";
import SettingsPageHeader from "./settingsPageHeader";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import { useInstructorProfileQuery, useUpdateInstructorProfileMutation } from "../../../redux/slices/instructor/instructorApiSlice";

const InstructorProfileSettings = () => {

  const id = useSelector(selectCurrentInstructor);
  const {
    data: instructorProfile,
    isLoading,
    isError,
  } = useInstructorProfileQuery({ id: id });

  const [updateInstructorProfile, { isLoading: isUpdating }] = useUpdateInstructorProfileMutation();
  const [formData, setFormData] = useState({
    firstName: instructorProfile?.firstName || "",
    lastName: instructorProfile?.lastName || "",
    title: instructorProfile?.title || "",
    address: instructorProfile?.address || "",
    phone: instructorProfile?.phone || "",
    bio: instructorProfile?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Call the mutation to update the instructor profile
    updateInstructorProfile({
      id,
      profileData: formData,
    }).unwrap()
      .then(() => {
        alert("Profile updated successfully!");
      })
      .catch(() => {
        alert("Failed to update profile.");
      });
  };

  if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading instructor details.</p>;
  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Settings"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">My Profile</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      My Profile
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
            <InstructorSidebar />
            {/* Instructor Settings */}
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-3">
                  <div className="profile-heading">
                    <h3>My Profile</h3>
                    <p>
                      You can manage your instructor profile.
                    </p>
                  </div>
                  <SettingsPageHeader />
                  <form onSubmit={handleSubmit}>
                    <div className="course-group profile-upload-group mb-0 d-flex">
                      <div className="course-group-img profile-edit-field d-flex align-items-center">
                        <Link
                          to="/student/student-profile"
                          className="profile-pic"
                        >
                          <img src={instructorProfile.photo} alt="Img" className="img-fluid" />
                        </Link>
                        <div className="profile-upload-head">
                          <h4>
                            <Link to="/instructor/instructor-profile">
                              Your avatar
                            </Link>
                          </h4>
                          <p>
                            PNG or JPG no bigger than 800px width and height
                          </p>
                          <div className="new-employee-field">
                            <div className="d-flex align-items-center mt-2">
                              <div className="image-upload mb-0">
                                <input type="file" />
                                <div className="image-uploads">
                                  <i className="bx bx-cloud-upload" />
                                </div>
                              </div>
                              <div className="img-delete">
                                <Link to="#" className="delete-icon">
                                  <i className="bx bx-trash" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="checkout-form settings-wrap">
                      <div className="edit-profile-info">
                        <h5>Personal Details</h5>
                        <p>Edit your personal information</p>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-block">
                            <label className="form-label">Bio</label>
                            <textarea
                              rows={4}
                              className="form-control"
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <button className="btn btn-primary" type="submit" disabled={isUpdating}>
                          {isUpdating ? "Updating..." : "Update Profile"}
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
    </div>
  );
};

export default InstructorProfileSettings;
