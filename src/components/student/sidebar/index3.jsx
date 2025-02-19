import React from "react";
import { Link, useLocation } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { User16 } from "../../imagepath";

// eslint-disable-next-line react/prop-types
export default function StudentSidebar() {
    const location = useLocation();
    const studentId = localStorage.getItem("studentId"); // Lấy studentId từ localStorage

    return (
        <div className="col-xl-3 col-lg-3 theiaStickySidebar">
            <StickyBox offsetTop={20} offsetBottom={20}>
                <div className="settings-widget dash-profile">
                    <div className="settings-menu">
                        <div className="profile-bg">
                            <div className="profile-img">
                                <Link to={`/student/student-profile/${studentId}`}>
                                    <img src={User16} alt="Img" />
                                </Link>
                            </div>
                        </div>
                        <div className="profile-group">
                            <div className="profile-name text-center">
                                <h4>
                                    <Link to={`/student/student-profile/${studentId}`}>
                                        Rolands Richard
                                    </Link>
                                </h4>
                                <p>Student</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="settings-widget account-settings">
                    <div className="settings-menu">
                        <h3>Dashboard</h3>
                        <ul>
                            <li className={`nav-item ${location.pathname === `/home` ? 'active' : ''}`}>
                                <Link to={`/home`} className="nav-link">
                                    <i className="bx bxs-tachometer" />
                                    Dashboard
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-profile/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-profile/${studentId}`} className="nav-link">
                                    <i className="bx bxs-user" />
                                    My Profile
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-study/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-study/${studentId}`} className="nav-link">
                                    <i className="bx bxs-user-plus" />
                                    Study
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-learning-schedule/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-learning-schedule/${studentId}`} className="nav-link">
                                    <i className="bx bxs-chat" />
                                    Calendar Study
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-qa/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-qa/${studentId}`} className="nav-link">
                                    <i className="bx bxs-bookmark-alt" />
                                    Certificate
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-courses/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-courses/${studentId}`} className="nav-link">
                                    <i className="bx bxs-graduation" />
                                    Enrolled Courses
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-wishlist/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-wishlist/${studentId}`} className="nav-link">
                                    <i className="bx bxs-heart" />
                                    Wishlist
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-reviews/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-reviews/${studentId}`} className="nav-link">
                                    <i className="bx bxs-star" />
                                    Reviews
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-quiz/${studentId}` || location.pathname === `/student/student-quiz-details/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-quiz/${studentId}`} className="nav-link">
                                    <i className="bx bxs-shapes" />
                                    My Quiz Attempts
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-order-history/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-order-history/${studentId}`} className="nav-link">
                                    <i className="bx bxs-cart" />
                                    Order History
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-messages/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-messages/${studentId}`} className="nav-link">
                                    <i className="bx bxs-chat" />
                                    Messages
                                </Link>
                            </li>
                            <li className={`nav-item ${location.pathname === `/student/student-ticket/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-ticket/${studentId}`} className="nav-link">
                                    <i className="bx bxs-coupon" />
                                    Support Tickets
                                </Link>
                            </li>
                        </ul>
                        <h3>Account Settings</h3>
                        <ul>
                            <li className={`nav-item ${location.pathname === `/student/student-setting/${studentId}` || location.pathname === `/student/student-change-password/${studentId}` || location.pathname === `/student/student-social-profile/${studentId}` || location.pathname === `/student/student-linked-accounts/${studentId}` || location.pathname === `/student/student-notification/${studentId}` ? 'active' : ''}`}>
                                <Link to={`/student/student-setting/${studentId}`} className="nav-link">
                                    <i className="bx bxs-cog" />
                                    Settings
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">
                                    <i className="bx bxs-log-out" />
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </StickyBox>
        </div>
    );
}
