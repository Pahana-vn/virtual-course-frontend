import React, { useState, useEffect } from "react";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import InstructorSidebar from "../sidebar";
import { Link } from "react-router-dom";
import useUser from "../../hooks/useUser";

const DashboardProfile = () => {
  const [instructorProfile, setInstructorProfile] = useState(null);
  const userData = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(userData.username);
  useEffect(() => {
    const fetchInstructorProfileData = async () => {
      const username = userData?.username; // Kiểm tra username có tồn tại không
      if (!username) {
        setError("Username is missing");
        setLoading(false);
        return;
      } 
      try {
        const [response] = await Promise.all([
          fetch(`http://localhost:8080/api/instructor/profile?username=${encodeURIComponent(username)}`)
        ]);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const intructorProfileData = await response.json();

        setInstructorProfile(intructorProfileData);
        setLoading(false);
      } catch (err) {
      setError(err.message);
      setLoading(false); 
      }
    };
    fetchInstructorProfileData();
  }, []);
  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang fetch dữ liệu
  }

  if (error) {
    return <div>Error: {error}</div>; // Hiển thị lỗi nếu fetch thất bại
  }
  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"My Profile"} />
      {/* Breadcrumb */}
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
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* sidebar */}
            <InstructorSidebar />
            {/* /Sidebar */}
            {/* Instructor profile */}
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
                          <h6>First Name</h6>
                          <p>{instructorProfile.firstName}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Last Name</h6>
                          <p>{instructorProfile.lastName}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>User Name</h6>
                          <p>{instructorProfile.username}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Email</h6>
                          <p>{instructorProfile.email}</p>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="contact-info">
                          <h6>Phone Number</h6>
                          <p>{instructorProfile.phone}</p>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="contact-info mb-0">
                          <h6>{instructorProfile.bio}</h6>
                          <p>
                            {" "}
                            Very well thought out and articulate communication.
                            Clear milestones, deadlines and fast work. Patience.
                            Infinite patience. No shortcuts. Even if the client is
                            being careless. Some quick example text to build on the
                            card title and bulk the card&apos;s content Moltin gives you
                            platform. As a highly skilled and successfull product
                            development and design specialist with more than 4 Years
                            of My experience lies in successfully conceptualizing,
                            designing, and modifying consumer products specific to
                            interior design and home furnishings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Instructor profile */}
          </div>
        </div>
      </div>
      {/* /Page Content */}

      <Footer />
    </div>
  );
}

export default DashboardProfile