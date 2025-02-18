import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import SettingsPageHeader from "./settingsPageHeader";
import { useGetSocialQuery, useUpdateSocialMutation } from "../../../redux/slices/instructor/InstructorProfileApiSlice";

const InstructorProfileSocial = () => {
  const instructorId = useSelector(selectCurrentInstructor);
  
  // Gọi API để lấy dữ liệu Social hiện tại
  const {
    data: socialProfile,
    isLoading,
    isError,
  } = useGetSocialQuery({ instructorId });

  // Gọi API updateSocial
  const [updateSocial] = useUpdateSocialMutation();

  // State để quản lý dữ liệu Social Links
  const [socialData, setSocialData] = useState({
    googleUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
  });

  // Cập nhật state khi có dữ liệu từ API
  useEffect(() => {
    if (socialProfile) {
      setSocialData({
        googleUrl: socialProfile.googleUrl || "",
        facebookUrl: socialProfile.facebookUrl || "",
        instagramUrl: socialProfile.instagramUrl || "",
        linkedinUrl: socialProfile.linkedinUrl || "",
      });
    }
  }, [socialProfile]);

  const handleChange = (e) => {
    setSocialData({
      ...socialData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateSocial({
        instructorId,
        social: socialData,
      }).unwrap();
      alert("Social links updated successfully!");
    } catch (error) {
      console.error("Failed to update social links:", error);
      alert("Failed to update. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading social links.</p>;

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Settings"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Social Links</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Social Links
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
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-3">
                  <div className="profile-heading">
                    <h3>Social Links</h3>
                    <p>Edit your social media links</p>
                  </div>
                  <SettingsPageHeader />
                  <form onSubmit={handleSubmit}>
                  <div className="input-block">
                      <label className="form-label fw-bold">Google</label>
                      <input
                        type="text"
                        className="form-control"
                        name="googleUrl"
                        value={socialData.googleUrl}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-block">
                      <label className="form-label fw-bold">Facebook</label>
                      <input
                        type="text"
                        className="form-control"
                        name="facebookUrl"
                        value={socialData.facebookUrl}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-block">
                      <label className="form-label fw-bold">Instagram</label>
                      <input
                        type="text"
                        className="form-control"
                        name="instagramUrl"
                        value={socialData.instagramUrl}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-block">
                      <label className="form-label fw-bold">LinkedIn</label>
                      <input
                        type="text"
                        className="form-control"
                        name="linkedinUrl"
                        value={socialData.linkedinUrl}
                        onChange={handleChange}
                      />
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Update Social Links
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstructorProfileSocial;
