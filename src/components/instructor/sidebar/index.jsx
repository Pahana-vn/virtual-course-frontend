import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGetInstructorByIdQuery, useInstructorAvatarQuery } from "../../../redux/slices/instructor/instructorApiSlice";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
// eslint-disable-next-line react/prop-types
export default function InstructorSidebar() {
  const location = useLocation();
  const instructorId = useSelector(selectCurrentInstructor);
  const {
    data: instructor,
    isLoading,
    isError,
  } = useGetInstructorByIdQuery({ id: instructorId });
  const accountId = useSelector((state) => state.auth.user.accountId);
  const { data } = useInstructorAvatarQuery({accountId});
  const avatarUrl = data?.url || "default-avatar.png";
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading instructor details.</p>;
  return (
    <div className="col-xl-3 col-lg-3 theiaStickySidebar">
      <StickyBox offsetTop={20} offsetBottom={20}>
        <div className="settings-widget dash-profile">
          <div className="settings-menu">
            <div className="profile-bg">
              <div className="profile-img">
                <Link to={`/instructor/${instructorId}/instructor-profile`}>
                  <img
                    src={avatarUrl || "https://via.placeholder.com/150"}
                    alt={`${instructor.firstName} ${instructor.lastName}'s avatar`}
                  />
                </Link>
              </div>
            </div>
            <div className="profile-group">
              <div className="profile-name text-center">
                <h4>
                  <Link to={`/instructor/${instructorId}/instructor-profile`}>
                    {`${instructor.firstName} ${instructor.lastName}` || "Instructor Name"}
                  </Link>
                </h4>
                <p>Instructor</p>
                <Link
                  to="/instructor/add-course"
                  className="add-course btn-primary"
                >
                  Add New Course
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="settings-widget account-settings">
          <div className="settings-menu">
            <h3>Instructor Dashboard</h3>
            <ul>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-dashboard"
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/instructor/instructor-dashboard"
                  className="nav-link"
                >
                  <i className="bx bxs-tachometer" />
                  Dashboard
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-course"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/instructor/instructor-course" className="nav-link ">
                  <i className="bx bxs-rocket" />
                  My Courses
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-profiles"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/instructor/instructor-profile-settings" className="nav-link">
                  <i className="bx bxs-user" />
                  My Profile
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-reviews"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/instructor/instructor-reviews" className="nav-link">
                  <i className="bx bxs-star" />
                  Reviews
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-qa"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/instructor/instructor-qa" className="nav-link">
                  <i className="bx bxs-bookmark-alt" />
                  Question &amp; Answer
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-chat"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/instructor/instructor-chat" className="nav-link">
                  <i className="bx bxs-chat" />
                  Messages
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-notifications"
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/instructor/instructor-notifications"
                  className="nav-link"
                >
                  <i className="bx bxs-bell" />
                  Notifications
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-announcement"
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/instructor/instructor-announcement"
                  className="nav-link"
                >
                  <i className="bx bxs-volume-full" />
                  Announcements
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-withdraw"
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/instructor/instructor-withdraw"
                  className="nav-link "
                >
                  <i className="bx bxs-wallet" />
                  Withdrawls
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-assignment"
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/instructor/instructor-assignment"
                  className="nav-link "
                >
                  <i className="bx bxs-file" />
                  Assignments
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-earnings"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/instructor/instructor-earnings" className="nav-link">
                  <i className="bx bxs-badge-dollar" />
                  Earnings
                </Link>
              </li>
            </ul>
            <h3>Account Settings</h3>
            <ul>
              <li
                className={`nav-item ${
                  location.pathname === "/instructor/instructor-settings" ||
                  location.pathname ===
                    "/instructor/instructor-change-password" ||
                  location.pathname ===
                    "/instructor/instructor-setting-notifications" ||
                  location.pathname ===
                    "/instructor/instructor-setting-withdraw" ||
                  location.pathname === "/instructor/instructor-delete-account"
                    ? "active"
                    : ""
                }`}
              >
                <Link
                  to="/instructor/instructor-settings"
                  className="nav-link "
                >
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
// Định nghĩa propTypes
InstructorSidebar.propTypes = {
  accountStatistics: PropTypes.shape({
    instructorName: PropTypes.string, // instructorName phải là chuỗi
    // Bạn có thể thêm các thuộc tính khác nếu cần
  }), // accountStatistics phải là một đối tượng với các thuộc tính đúng kiểu
};
