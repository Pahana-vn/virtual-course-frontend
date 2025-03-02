import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Icon25, Icon26, Icon27, ProfileAvatar } from "../../imagepath";
import { useGetInstructorStatisticsQuery } from "../../../redux/slices/instructor/instructorStatisticsApiSlice";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";

export default function MenuInstructorDashboard() {
  const formatCurrency = useCurrencyFormatter();
  const instructorId = useSelector(selectCurrentInstructor);
  const { data: instructorStatistics, isError, isLoading } = useGetInstructorStatisticsQuery({instructorId:instructorId});

  if (isLoading) return <p>Loading statistics...</p>;
  if (isError) return <p>Error loading statistics</p>;
  return (
    <div className="page-banner instructor-bg-blk">
      <div className="container">
        <div className="row align-items-center student-group">
          <div className="col-lg-6 col-md-12">
            <div className="instructor-profile d-flex align-items-center">
              <div className="instructor-profile-pic">
                <Link to={`/instructor/${instructorId}/instructor-profile`}>
                  <img src={instructorStatistics.avatarImage || ProfileAvatar} alt="" className="img-fluid" />
                </Link>
              </div>
              <div className="instructor-profile-content">
                <h4>
                  <Link to={`/instructor/${instructorId}/instructor-profile`}>
                  {instructorStatistics.instructorName}
                  </Link>
                </h4>
                <p>Instructor</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="instructor-profile-menu">
              <ul className="nav">
                <li>
                  <div className="d-flex align-items-center">
                    <div className="instructor-profile-menu-img">
                      <img src={Icon25} alt="" />
                    </div>
                    <div className="instructor-profile-menu-content">
                      <h4>{instructorStatistics.totalCourses}</h4>
                      <p>Courses</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <div className="instructor-profile-menu-img">
                      <img src={Icon26} alt="" />
                    </div>
                    <div className="instructor-profile-menu-content">
                      <h4>{instructorStatistics.totalStudents}</h4>
                      <p>Total Students</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-center">
                    <div className="instructor-profile-menu-img">
                      <img src={Icon27} alt="" />
                    </div>
                    <div className="instructor-profile-menu-content">
                      <h4>{formatCurrency(instructorStatistics.balance)}</h4>
                      <p>Total Balance</p>
                    </div>
                  </div>
                </li>
                {/* <li>
                  <div className="d-flex align-items-center">
                    <div className="instructor-profile-menu-img">
                      <img src={Icon27} alt="" />
                    </div>
                    <div className="instructor-profile-menu-content">
                      <h4>{instructorStatistics.totalReviews}</h4>
                      <p>Reviews</p>
                    </div>
                  </div>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="my-student-list">
              <ul>
                <li>
                  <Link
                    className="active"
                    to="/instructor/deposit-instructor-dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/instructor/instructor-dashboard">Courses</Link>
                </li>
                <li className="mb-0">
                  <Link to="/instructor/transactions-instructor">
                    Transactions
                  </Link>
                </li>
                <li>
                  <Link to="/instructor/deposit-instructor">Deposits</Link>
                </li>
                <li>
                  <Link to="/instructor/withdrawal-instructor">Withdrawals</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
