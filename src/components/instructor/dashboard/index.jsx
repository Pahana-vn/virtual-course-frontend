import React, { useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../../footer";
import { InstructorHeader } from "../../instructor/header";
import { Icon1, Icon2 } from "../../imagepath";
import InstructorSidebar from "../sidebar";
import { Link } from "react-router-dom";
import {
  useGetCoursesByInstructorIdQuery,
  useGetInstructorCoursesPurchasedByStudentQuery,
} from "../../../redux/slices/course/courseApiSlice";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import { useInstructorStatisticsQuery } from "../../../redux/slices/instructor/instructorApiSlice";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";

export const Dashboard = () => {
  const [isClassAdded, setIsClassAdded] = useState([false]);
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = useCurrencyFormatter();

  const instructorId = useSelector(selectCurrentInstructor);

  const {
    data: instructorCourses,
    error,
    isLoading,
  } = useGetInstructorCoursesPurchasedByStudentQuery({instructorId:instructorId});

  const { data: instructorStatistics } = useInstructorStatisticsQuery({ id: instructorId });

  const {
    data: Icourses,
  } = useGetCoursesByInstructorIdQuery({instructorId});

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return (
      <div>
        Error: {error.data?.message || "Something went wrong!"} (Status:{" "}
        {error.status || "Unknown"})
      </div>
    );
  }

  // Pagination state
  const itemsPerPage = 6;
  const totalPages =
    instructorCourses?.length
      ? Math.ceil(instructorCourses?.length / itemsPerPage + 1)
      : 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedCourses =
    instructorCourses?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const toggleClass = (index) => {
    const updatedClasses = [...isClassAdded];
    updatedClasses[index] = !updatedClasses[index];
    setIsClassAdded(updatedClasses);
  };
  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Dashboard"} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Instructor Dashboard</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Instructor Dashboard
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
            {/* Student Dashboard */}
            <div className="col-xl-9 col-lg-9">
              {/* Dashboard Grid */}
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="card dash-info flex-fill">
                    <div className="card-body">
                      <h5>Total Courses</h5>
                      <h2>{instructorStatistics?.totalCourses}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="card dash-info flex-fill">
                    <div className="card-body">
                      <h5>Published Courses</h5>
                      <h2>{instructorStatistics?.totalPublishedCourses}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="card dash-info flex-fill">
                    <div className="card-body">
                      <h5>Pending Courses</h5>
                      <h2>{instructorStatistics?.totalPendingCourses}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="card dash-info flex-fill">
                    <div className="card-body">
                      <h5>Total Students</h5>
                      <h2>{instructorStatistics?.totalStudents}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 d-flex">
                  <div className="card dash-info flex-fill">
                    <div className="card-body">
                      <h5>Total Earnings</h5>
                      <h2>{formatCurrency(instructorStatistics?.balance)}</h2>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Dashboard Grid */}
              <div className="instructor-course-table">
                <div className="dashboard-title">
                  <h4>Recently Created Courses</h4>
                </div>
                <div className="table-responsive custom-table">
                  {/* Referred Users*/}
                  <table className="table table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>Courses</th>
                        <th>Enrolled</th>
                        <th>Status</th>
                        <th>Functions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Icourses?.length > 0 ? (
                        Icourses.map((course, index) => (
                          <tr key={index}>
                            <td>
                              <div className="table-course-detail">
                                <Link 
                                to={`/course/${course.id}/course-details`} 
                                className="course-table-img">
                                  <span>
                                    <img
                                    style={{ objectFit: 'contain',width:'110px', height: '80px' }}
                                      src={
                                        course.imageCover || "default-image-url"
                                      }
                                      alt={course.titleCourse}
                                    />
                                  </span>
                                </Link>
                                  <Link 
                                  to={`/course/${course.id}/course-details`} className="course-title d-flex align-items-center justify-content-center"
                                  style={{}}>
                                    {course.titleCourse}
                                  </Link>
                              </div>
                            </td>
                            <td>{course.students || 0}</td>
                            <td>{course.status || "N/A"}</td>
                            <td>
                            <Link
                                    to={`/instructor/course-test/${course.id}`}
                                    className="btn btn-primary"
                                  >
                                    Manage Tests
                                  </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">No courses found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="dashboard-title">
                <h4>Recently Enrolled Courses</h4>
              </div>
              {/* Course Grid */}
              <div className="row">
                {paginatedCourses?.length > 0 ? (
                  paginatedCourses.map((course, index) => (
                    <div className="col-xxl-4 col-md-6 d-flex" key={index}>
                      <div className="course-box flex-fill">
                        <div className="product">
                          <div className="product-img">
                            <Link to={`/course/${course.id}/course-details`}>
                              <img
                                className="img-fluid"
                                style={{ objectFit: 'contain', height: '200px' }}
                                alt={course.titleCourse}
                                src={
                                  course.imageCover ||
                                  "default-course-image.jpg"
                                }
                              />
                            </Link>
                            <div className="price">
                              <h3>
                                {formatCurrency(course.basePrice)}
                              </h3>
                            </div>
                          </div>
                          <div className="product-content">
                            <div className="course-group d-flex">
                              <div className="course-group-img d-flex">
                                <Link
                                  to={`/instructor/${course.instructorId}/instructor-profile`}
                                >
                                  <img
                                    src={
                                      course.instructorPhoto ||
                                      "default-avatar.jpg"
                                    }
                                    alt={
                                      course.instructorFirstName +
                                      course.instructorLastName
                                    }
                                    className="img-fluid"
                                  />
                                </Link>
                                <div className="course-name">
                                  <h4>
                                    <Link
                                      to={`/instructor/${course.instructorId}/instructor-profile`}
                                    >
                                      {`${course.instructorFirstName} ${course.instructorLastName}`}
                                    </Link>
                                  </h4>
                                  <p>Instructor</p>
                                </div>
                              </div>
                              <div className="course-share d-flex align-items-center justify-content-center">
                                <Link to="#" onClick={() => toggleClass(index)}>
                                  <i
                                    className={`fa-regular fa-heart ${
                                      isClassAdded[index] ? "color-active" : ""
                                    }`}
                                  />
                                </Link>
                              </div>
                            </div>
                            <h3 className="course-title instructor-text">
                              <Link to={`/course/${course.id}/course-details`}>
                                {course.titleCourse}
                              </Link>
                            </h3>
                            <div className="course-info d-flex align-items-center">
                              <div className="rating-img d-flex align-items-center">
                                <img src={Icon1} alt="Icon" />
                                <p>{course.totalLectures}+ Lessons</p>
                              </div>
                              <div className="course-view d-flex align-items-center">
                                <img src={Icon2} alt="Icon" />
                                <p>{course.duration} {course.duration === 1 ? "hr" : "hrs"}</p>
                              </div>
                            </div>
                            <div className="rating mb-0">
                              {Array(5)
                                .fill(null)
                                .map((_, i) => (
                                  <i
                                    className={`fas fa-star ${
                                      i < course.rating ? "filled" : ""
                                    } me-1`}
                                    key={i}
                                  />
                                ))}
                              <span className="d-inline-block average-rating">
                                <span>{course.rating}</span> (
                                {course.reviewCount})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p>No courses found.</p>
                  </div>
                )}
              </div>
              <div className="dash-pagination">
                <div className="row align-items-center">
                  <div className="col-6">
                    <p>
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="col-6">
                    <ul className="pagination">
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(index + 1)}
                            className="page-link"
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() =>
                            handlePageChange(
                              currentPage < totalPages
                                ? currentPage + 1
                                : totalPages
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="page-link"
                        >
                          <i className="bx bx-chevron-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* Student Dashboard */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <Footer />
    </div>
  );
};
