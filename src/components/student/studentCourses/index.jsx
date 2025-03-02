import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudentCourses } from "../../../services/studentService";
import Footer from "../../footer";
import { Icon1, Icon2 } from "../../imagepath";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentCourses = () => {
  const [courses, setCourses] = useState({
    enrolled: [],
    active: [],
    completed: [],
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("enrolled");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        console.log("🔍 Student ID:", studentId);

        if (!studentId) {
          setError("⚠️ Student ID not found in localStorage.");
          return;
        }

        const response = await fetchStudentCourses(studentId);
        console.log("📡 API Response:", response);
        setCourses(response || { enrolled: [], active: [], completed: [] });
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to fetch courses. Please try again.");
      }
    };

    fetchCourses();
  }, []);

  const renderCourses = (courseList) => {
    if (!courseList || courseList.length === 0) {
      return <p>No courses available in this category.</p>;
    }

    return courseList.map((course, index) => (
      <div key={index} className="col-xxl-4 col-md-6 d-flex">
        <div className="course-box flex-fill">
          <div className="product">
            <div className="product-img">
              <Link to={`/course-details/${course.id}`}>
                <img
                  className="img-fluid"
                  alt={course.titleCourse}
                  src={course.imageCover || "default-image.jpg"}
                />
              </Link>
              <div className="price">
                <h3>{course.basePrice.toLocaleString()} VND</h3>
              </div>
            </div>
            <div className="product-content">
              <div className="course-group d-flex">
                <div className="course-group-img d-flex">
                  <Link to={`/instructor/instructor-profile/${course.instructorId}`}>
                    <img
                      src={course.instructorPhoto || "default-avatar.jpg"}
                      alt="Instructor"
                      className="img-fluid"
                    />
                  </Link>
                  <div className="course-name">
                    <h4>
                      <Link to={`/instructor/instructor-profile/${course.instructorId}`}>
                        {course.instructorFirstName} {course.instructorLastName}
                      </Link>
                    </h4>
                    <p>Instructor</p>
                  </div>
                </div>
              </div>
              <h3 className="title instructor-text">
                <Link to={`/course-details/${course.id}`}>{course.titleCourse}</Link>
              </h3>
              <div className="course-info d-flex align-items-center">
                <div className="rating-img d-flex align-items-center">
                  <img src={Icon1} alt="Img" />
                  <p>12+ Lesson</p>
                </div>
                <div className="course-view d-flex align-items-center">
                  <img src={Icon2} alt="Img" />
                  <p>70hr 30min</p>
                </div>
              </div>
              <div className="rating mb-0">
                <i className="fas fa-star filled me-1" />
                <i className="fas fa-star filled me-1" />
                <i className="fas fa-star filled me-1" />
                <i className="fas fa-star filled me-1" />
                <i className="fas fa-star filled me-1" />
                <span className="d-inline-block average-rating">
                  <span>5.0</span> (20)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  if (error) {
    return <p className="error-message">❌ {error}</p>;
  }

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Enrolled Courses"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Enrolled Courses</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Enrolled Courses
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
            <StudentSidebar />
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-info">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Enrolled Courses</h3>
                  </div>
                  <div className="checkout-form pb-0">
                    <div className="wishlist-tab">
                      <ul className="nav">
                        <li className="nav-item">
                          <Link
                            className={`nav-link ${activeTab === "enrolled" ? "active" : ""}`}
                            onClick={() => setActiveTab("enrolled")}
                          >
                            Enrolled Courses ({courses.enrolled.length})
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className={`nav-link ${activeTab === "active" ? "active" : ""}`}
                            onClick={() => setActiveTab("active")}
                          >
                            Uncompleted Courses ({courses.active.length})
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
                            onClick={() => setActiveTab("completed")}
                          >
                            Completed Courses ({courses.completed.length})
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content">
                      {activeTab === "enrolled" && (
                        <div className="tab-pane fade show active">
                          <div className="row">{renderCourses(courses.enrolled)}</div>
                        </div>
                      )}
                      {activeTab === "active" && (
                        <div className="tab-pane fade show active">
                          <div className="row">{renderCourses(courses.active)}</div>
                        </div>
                      )}
                      {activeTab === "completed" && (
                        <div className="tab-pane fade show active">
                          <div className="row">{renderCourses(courses.completed)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentCourses;
