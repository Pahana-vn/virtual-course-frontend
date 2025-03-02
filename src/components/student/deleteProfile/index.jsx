import React from "react";
import { Link } from "react-router-dom";
import StudentHeader from "../header";
import StudentSettingPageHeader from "../setting/settingPageHeader";
import StudentSidebar from "../sidebar";

const StudentDeleteProfile = () => {
  return (
    <div className="main-wrapper">
      <>
        {/* Header */}
        <StudentHeader activeMenu={"Dashboard"} />
        {/* /Header */}
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
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Social Profile
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
              <StudentSidebar />
              {/* /Sidebar */}
              {/* Student Settings */}
              <div className="col-xl-9 col-lg-9">
                <div className="settings-widget card-details">
                  <div className="settings-menu p-0">
                    <div className="profile-heading">
                      <h3>Settings</h3>
                      <p>
                        You have full control to manage your own account
                        settings
                      </p>
                    </div>
                    <StudentSettingPageHeader />
                    <form>
                      <div className="col-xl-9 col-md-8">
                        <div className="settings-widget profile-details">
                          <div className="settings-menu p-0">
                            <div className="profile-heading">
                              <h3>Delete your account</h3>
                              <p>Delete or Close your account permanently.</p>
                            </div>
                            <div className="checkout-form personal-address">
                              <div className="personal-info-head">
                                <h4>Warning</h4>
                                <p>
                                  If you close your account, you will be unsubscribed from
                                  all your 0 courses, and will lose access forever.
                                </p>
                              </div>
                              <div className="un-subscribe p-0">
                                <Link to="#" className="btn btn-danger">
                                  Delete My Account
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* /Student Settings */}
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>
    </div>
  );
};

export default StudentDeleteProfile;
