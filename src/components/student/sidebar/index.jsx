import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { logout } from "../../../services/authService";
import { fetchStudentByStudentId } from "../../../services/studentService";

const DEFAULT_AVATAR = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ36xMCcz67__zewKxiZ1t5bQf1dI01lvQKsBK2nX_mzWfFerwJwZ0WcEAokPCmzPJv42g&usqp=CAU";

export default function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  const [student, setStudent] = useState({
    avatar: DEFAULT_AVATAR,
    username: "Student Name",
  });

  useEffect(() => {
    const getStudentData = async () => {
      if (!studentId) return;
      try {
        const studentData = await fetchStudentByStudentId(studentId);
        setStudent({
          avatar: studentData.avatar || DEFAULT_AVATAR,
          username: studentData.username || "Student Name",
        });
      } catch (error) {
        console.error("Error fetching student avatar:", error);
      }
    };
    getStudentData();
  }, [studentId]);

  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="col-xl-3 col-lg-3 theiaStickySidebar">
      <StickyBox offsetTop={20} offsetBottom={20}>
        <div className="settings-widget dash-profile">
          <div className="settings-menu">
            <div className="profile-bg">
              <div className="profile-img">
                <Link to={`/student/student-profile/${studentId}`}>
                  <img
                    src={student.avatar}
                    onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                    alt="Student Avatar"
                    className="img-fluid"
                  />
                </Link>
              </div>
            </div>
            <div className="profile-group">
              <div className="profile-name text-center">
                <h4>
                  <Link to={`/student/student-profile/${studentId}`}>
                    {student.username}
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
              <li className={`nav-item ${getActiveClass('/student/student-dashboard')}`}>
                <Link to={`/student/student-dashboard/${studentId}`} className="nav-link">
                  <i className="bx bxs-tachometer" />
                  Dashboard
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-profile')}`}>
                <Link to={`/student/student-profile/${studentId}`} className="nav-link">
                  <i className="bx bxs-user" />
                  My Profile
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-study')}`}>
                <Link to="/student/student-study" className="nav-link">
                  <i className="bx bxs-user-plus" />
                  Study
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-learning-schedule')}`}>
                <Link to="/student/student-learning-schedule" className="nav-link">
                  <i className="bx bxs-chat" />
                  Calendar Study
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-courses')}`}>
                <Link to="/student/student-courses" className="nav-link">
                  <i className="bx bxs-graduation" />
                  Enrolled Courses
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-wishlist')}`}>
                <Link to="/student/student-wishlist" className="nav-link">
                  <i className="bx bxs-heart" />
                  Wishlist
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-quiz')}`}>
                <Link to="/student/student-quiz" className="nav-link">
                  <i className="bx bxs-shapes" />
                  My Quiz Attempts
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-order-history')}`}>
                <Link to="/student/student-order-history" className="nav-link">
                  <i className="bx bxs-cart" />
                  Order History
                </Link>
              </li>

              <li className={`nav-item ${getActiveClass('/student/student-messages')}`}>
                <Link to="/student/student-messages" className="nav-link">
                  <i className="bx bxs-chat" />
                  Messages
                </Link>
              </li>
            </ul>
            <h3>Account Settings</h3>
            <ul>
              <li className={`nav-item ${getActiveClass('/student/student-setting')}`}>
                <Link to="/student/student-setting" className="nav-link">
                  <i className="bx bxs-cog" />
                  Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/home" onClick={handleLogout} className="nav-link">
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
