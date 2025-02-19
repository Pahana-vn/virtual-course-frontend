import React from "react";
import DOMPurify from "dompurify";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import InstructorSidebar from "../sidebar";
import { Link } from "react-router-dom";
import { useInstructorProfileQuery } from "../../../redux/slices/instructor/instructorApiSlice";

const DashboardProfile = () => {
  const { data: profile, isLoading, isError } = useInstructorProfileQuery();
  console.log(profile)
  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Error loading profile.</p>;

  const sanitizedInstructorProfileBio = DOMPurify.sanitize(profile.bio);

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"My Profile"} />
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
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details mb-0">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>My Profile</h3>
                  </div>
                  <div className="checkout-form personal-address">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Username</h6>
                          <p>{profile.username}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Email</h6>
                          <p>{profile.email}</p>
                          <small>
                            {profile.verifiedEmail ? (
                              <span style={{ color: "green" }}>Verified</span>
                            ) : (
                              <span style={{ color: "red" }}>Not Verified</span>
                            )}
                          </small>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>First Name</h6>
                          <p>{profile.firstName}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Last Name</h6>
                          <p>{profile.lastName}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Gender</h6>
                          <p>{profile.gender}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Phone</h6>
                          <p>{profile.phone}</p>
                          <small>
                            {profile.verifiedPhone ? (
                              <span style={{ color: "green" }}>Verified</span>
                            ) : (
                              <Link to="/verify-phone" style={{ color: "red" }}>
                                Not Verified
                              </Link>
                            )}
                          </small>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Title</h6>
                          <p>{profile.title}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Workplace</h6>
                          <p>{profile.workplace}</p>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="contact-info">
                          <h6>Address</h6>
                          <p>{profile.address}</p>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="contact-info">
                          <h6>Bio</h6>
                          <div
                    dangerouslySetInnerHTML={{ __html: sanitizedInstructorProfileBio }}
                  ></div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default DashboardProfile;
