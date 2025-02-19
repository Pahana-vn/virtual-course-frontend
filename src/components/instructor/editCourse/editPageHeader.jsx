import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EditPageHeader = () => {
  const location = useLocation();

  return (
    <div>
      <div className="settings-page-head">
        <ul className="settings-pg-links">
          <li>
            <Link
              to="/instructor/instructor-settings"
              className={
                location.pathname === "/instructor/instructor-settings"
                  ? "active"
                  : ""
              }
            > 
              <i className="bx bx-edit" />
              Manage Basic Info
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-change-password"
              className={
                location.pathname === "/instructor/instructor-change-password"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-lock" />
              Manage Curriculum
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-setting-notifications"
              className={
                location.pathname ===
                "/instructor/instructor-setting-notifications"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-bell" />
              Manage Questions
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-setting-withdraw"
              className={
                location.pathname === "/instructor/instructor-setting-withdraw"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-wallet-alt" />
              Manage Tests
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-delete-account"
              className={
                location.pathname === "/instructor/instructor-delete-account"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-error-alt" />
              Delete Account
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EditPageHeader;
