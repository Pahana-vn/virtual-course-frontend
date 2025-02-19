import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SettingsPageHeader = () => {
  const location = useLocation();

  return (
    <div>
      <div className="settings-page-head">
        <ul className="settings-pg-links">
          <li>
            <Link
              to="/instructor/instructor-profile-settings"
              className={
                location.pathname === "/instructor/instructor-profile-settings"
                  ? "active"
                  : ""
              }
            > 
              <i className="bx bx-edit" />
              Basic Profile
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-profile-education"
              className={
                location.pathname === "/instructor/instructor-profile-education"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-lock" />
              Education Profile
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-profile-experience"
              className={
                location.pathname ===
                "/instructor/instructor-profile-experience"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-bell" />
              Experience Profile
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-profile-skill"
              className={
                location.pathname === "/instructor/instructor-profile-skill"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-wallet-alt" />
              Skills Profile
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/instructor-profile-social"
              className={
                location.pathname === "/instructor/instructor-profile-social"
                  ? "active"
                  : ""
              }
            >
              <i className="bx bx-error-alt" />
              Social Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPageHeader;
