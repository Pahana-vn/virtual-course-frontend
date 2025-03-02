import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentRoles } from "../../redux/slices/auth/authSlice";
import { InstructorHeader } from "../instructor/header";
import StudentHeader from "../student/header";
import Header from "./index";

const RoleBasedHeader = () => {
  const role = useSelector(selectCurrentRoles);

  if (role?.includes("ROLE_INSTRUCTOR")) {
    return <InstructorHeader />;
  }
  if (role?.includes("ROLE_STUDENT")) {
    return <StudentHeader />;
  }
  return <Header />;
};

export default RoleBasedHeader;
