import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";
import SettingsPageHeader from "./settingsPageHeader";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import {
  useInstructorProfileQuery,
  useUpdateInstructorProfileMutation,
} from "../../../redux/slices/instructor/instructorApiSlice";
import axios from "axios";
import ProfileAvatarEditor from "./ProfileAvatarEditor";
import defaultAvatar from "../../../assets/img/default-avatar.png";

const InstructorProfileSettings = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  // const [scale, setScale] = useState(1.2);
  // const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  // const editorRef = useRef(null);

  const id = useSelector(selectCurrentInstructor);

  const {
    data: instructorProfile,
    isLoading,
    isError,
  } = useInstructorProfileQuery({ id: id });

  const [updateInstructorProfile, { isLoading: isUpdating }] =
    useUpdateInstructorProfileMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    address: "",
    phone: "",
    gender: "",
    bio: "",
    photo: "",
  });

  useEffect(() => {
    if (instructorProfile) {
      setFormData({
        firstName: instructorProfile.firstName || "",
        lastName: instructorProfile.lastName || "",
        title: instructorProfile.title || "",
        address: instructorProfile.address || "",
        phone: instructorProfile.phone || "",
        gender: instructorProfile.gender || "",
        bio: instructorProfile.bio || "",
        photo: instructorProfile.photo || "",
      });
      setAvatarUrl(instructorProfile.photo || "");
    }
  }, [instructorProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveAvatar = async (croppedBlob) => {
    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", croppedBlob, "avatar.jpg");
    formData.append("type", "instructor");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/files/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!response.data) throw new Error("No response from server");
      const fileUrl = response.data;
      const fileName = fileUrl.split("/").pop();
      setAvatarFileName(fileName);

      // setFormData((prevData) => ({
      //   ...prevData,
      //   photo: fileName,
      // }));

      toast.success(
        'Avatar have been changed, please press "Update" to upload Avatar!'
      );
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfileData = { ...formData, photo: avatarFileName || instructorProfile.photo };

    updateInstructorProfile({
      id,
      profileData: updatedProfileData,
    })
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
      })
      .catch(() => {
        toast.error("Failed to update profile.");
      });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading instructor details.</p>;
  return (
    <>
      <ToastContainer autoClose={3000} />

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
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
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
                      <p>You can manage your instructor profile.</p>
                    </div>
                    <SettingsPageHeader />
                    <form onSubmit={handleSubmit}>
                      <div className="course-group profile-upload-group mb-0 d-flex">
                        <div className="course-group-img profile-edit-field d-flex align-items-center">
                          <Link to="#" className="profile-pic">
                            <img
                              src={avatarUrl || instructorProfile.photo || defaultAvatar}
                              alt="Img"
                              className="img-fluid"
                            />
                          </Link>
                          <div className="profile-upload-head">
                            <h4>
                              <Link to={`/instructor/${id}/instructor-profile`}>
                                Your avatar
                              </Link>
                            </h4>
                            <p>
                              PNG or JPG no bigger than 800px width and height
                            </p>
                            {isUploading && <div className="spinner"></div>}
                            {uploadError && (
                              <p style={{ color: "red" }}>{uploadError}</p>
                            )}

                            <div className="text-center mt-3">
                              <ProfileAvatarEditor
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                                onSave={handleSaveAvatar}
                                currentAvatar={
                                  avatarUrl || instructorProfile?.photo
                                }
                              />
                            </div>

                            <div className="new-employee-field">
                              <div className="d-flex align-items-center mt-2">
                                <div className="image-upload mb-0">
                                  <div className="image-uploads">
                                    <Link onClick={() => setModalOpen(true)}>
                                      <i className="bx bx-cloud-upload" />
                                    </Link>
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
                          <div className="col-md-6">
                            <div className="input-block">
                              <label className="form-label">Gender</label>
                              <input
                                type="text"
                                className="form-control"
                                name="gender"
                                value={formData.gender}
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
                            <button
                              className="btn btn-primary"
                              type="submit"
                              disabled={isUpdating}
                            >
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
    </>
  );
};

export default InstructorProfileSettings;
