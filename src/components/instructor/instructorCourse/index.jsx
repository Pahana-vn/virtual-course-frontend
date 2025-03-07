import React, { useState } from "react";
import { Link } from "react-router-dom";
import InstructorSidebar from "../sidebar";
import { InstructorHeader } from "../header";
import { Icon1, Icon2 } from "../../imagepath";
import { useDeleteCourseMutation, useGetInstructorCoursesQuery } from "../../../redux/slices/course/courseApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";

const InstructorCourse = () => {
  const [activeTab, setActiveTab] = useState("PUBLISHED");
  const instructorId = useSelector(selectCurrentInstructor);
  const formatCurrency = useCurrencyFormatter();

  const { data: courses, isLoading, isError } = useGetInstructorCoursesQuery({
    instructorId: instructorId, status: activeTab
  });

  const [deleteCourse] = useDeleteCourseMutation();

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse({ id }).unwrap();
        alert("Course deleted successfully!");
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Error deleting course. Please try again.");
      }
    }
  };

  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"My Course"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">My Courses</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      My Courses
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="row">
            <InstructorSidebar />
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-info">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>My Courses</h3>
                    <p>Manage your courses and its updates</p>
                  </div>
                  <div className="checkout-form pb-0">
                    <div className="wishlist-tab">
                      <ul className="nav">
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={
                              activeTab === "PUBLISHED" ? "active" : ""
                            }
                            onClick={() => handleTabChange("PUBLISHED")}
                          >
                            Published
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={activeTab === "PENDING" ? "active" : ""}
                            onClick={() => handleTabChange("PENDING")}
                          >
                            Pending
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            className={activeTab === "DRAFT" ? "active" : ""}
                            onClick={() => handleTabChange("DRAFT")}
                          >
                            Draft
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content">
                      {isLoading && <p>Loading...</p>}
                      {isError && <p>Error loading courses.</p>}
                      {!isLoading && courses && (
                        <div className="row">
                          {courses.length > 0 ? (
                            courses.map((course) => (
                              <div
                                className="col-xxl-4 col-md-6 d-flex"
                                key={course.id}
                              >
                                <div className="course-box flex-fill">
                                  <div className="product">
                                    <div className="product-img">
                                      <Link
                                        to={`/course/${course.id}/course-details`}
                                      >
                                        <img
                                          className="img-fluid"
                                          style={{ objectFit: 'contain', height: '150px' }}
                                          alt={course.titleCourse}
                                          src={course.imageCover}
                                        />
                                      </Link>
                                      <div className="price">
                                        <h3>
                                          {formatCurrency(course.basePrice)}
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="product-content">
                                      <h3 className="course-title instructor-text">
                                        <Link
                                          to={`/course/${course.id}/course-details`}
                                        >
                                          {course.titleCourse}
                                        </Link>
                                      </h3>
                                      <div className="course-info d-flex align-items-center">
                                        <div className="rating-img d-flex align-items-center">
                                          <img src={Icon1} alt="Lessons" />
                                          <p>
                                            {course.totalLectures}+ Lessons
                                          </p>
                                        </div>
                                        <div className="course-view d-flex align-items-center">
                                          <img src={Icon2} alt="Duration" />
                                          <p>
                                          {course.duration} {course.duration === 1 ? "hr" : "hrs"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="course-edit-btn d-flex align-items-center justify-content-between">
                                        <Link
                                          to={`/instructor/edit-course/${course.id}`}
                                        >
                                          <i className="bx bx-edit me-2" />
                                          Edit
                                        </Link>
                                        <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>
                                          <i className="bx bx-trash me-2" />
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center">
                              No courses found for {activeTab}.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dash-pagination">
                <div className="row align-items-center">
                  <div className="col-6">
                    <p>Page 1 of 1</p>
                  </div>
                  <div className="col-6">
                    <ul className="pagination">
                      <li className="active">
                        <Link to="#">1</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* /Instructor Courses */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourse;
