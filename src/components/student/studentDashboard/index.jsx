import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudentDashboardData } from "../../../services/studentService";
import { course02, Icon1, Icon2, User2 } from "../../imagepath";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState({});
    const studentId = localStorage.getItem("studentId");

    useEffect(() => {
        if (!studentId) {
            console.error("Student ID không tồn tại trong localStorage.");
            return;
        }

        const fetchData = async () => {
            try {
                const data = await fetchStudentDashboardData(studentId);
                setDashboardData(data || {});
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        };

        fetchData();
    }, [studentId]);

    return (
        <div className="main-wrapper">
            <StudentHeader activeMenu={"Dashboard"} />
            <div className="breadcrumb-bar breadcrumb-bar-info">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-12">
                            <div className="breadcrumb-list">
                                <h2 className="breadcrumb-title">Dashboard</h2>
                                <nav aria-label="breadcrumb" className="page-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/home">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Dashboard
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
                            {/* Thông tin chung */}
                            <div className="row g-3 justify-content-center">
                                <div className="col-lg-4 col-md-6 d-flex">
                                    <div className="card dash-info flex-fill">
                                        <div className="card-body">
                                            <h5>Total Enrolled Courses</h5>
                                            <h2>{dashboardData.totalCourses || 0}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 d-flex">
                                    <div className="card dash-info flex-fill">
                                        <div className="card-body">
                                            <h5>Completed Courses</h5>
                                            <h2>{dashboardData.completedCourses || 0}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 d-flex">
                                    <div className="card dash-info flex-fill">
                                        <div className="card-body">
                                            <h5>Total Payments</h5>
                                            <h2>${dashboardData.totalPaid ? dashboardData.totalPaid.toLocaleString() : "0"}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Khóa học gần đây */}
                            <div className="dashboard-title mt-4">
                                <h4>Recently Enrolled Courses</h4>
                            </div>
                            <div className="row g-3">
                                {dashboardData.recentCourses && dashboardData.recentCourses.length > 0 ? (
                                    dashboardData.recentCourses.map((course, index) => (
                                        <div className="col-xxl-4 col-md-6 d-flex" key={index}>
                                            <div className="course-box flex-fill shadow-sm p-3">
                                                <div className="product">
                                                    <div className="product-img">
                                                        <Link to={`/course-details/${course.id}`}>
                                                            <img
                                                                className="img-fluid rounded"
                                                                alt={course.titleCourse || "Course"}
                                                                src={course.imageCover || course02}
                                                            />
                                                        </Link>
                                                        <div className="price mt-2">
                                                            <h3>
                                                                ${course.price || "FREE"}
                                                                {course.discountedPrice && (
                                                                    <span className="ms-2 text-muted text-decoration-line-through">
                                                                        ${course.discountedPrice}
                                                                    </span>
                                                                )}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="product-content">
                                                        <div className="course-group d-flex">
                                                            <div className="course-group-img d-flex">
                                                                <Link to={course.instructorProfileUrl || "/instructor/instructor-profile"}>
                                                                    <img
                                                                        src={course.instructorPhoto || User2}
                                                                        alt={course.instructorFirstName || "Instructor"}
                                                                        className="img-fluid"
                                                                    />
                                                                </Link>
                                                                <div className="course-name">
                                                                    <h4>
                                                                        <Link to={course.instructorProfileUrl || "/instructor/instructor-profile"}>
                                                                            {`${course.instructorFirstName || "Unknown"} ${course.instructorLastName || ""}`}
                                                                        </Link>
                                                                    </h4>
                                                                    <p>Instructor</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <h3 className="title instructor-text mb-3">
                                                            <Link to={`/course-details/${course.id}`}>
                                                                {course.titleCourse || "Untitled Course"}
                                                            </Link>
                                                        </h3>
                                                        <div className="course-info d-flex align-items-center justify-content-between">
                                                            <div className="rating-img d-flex align-items-center">
                                                                <img src={Icon1} alt="Lesson Icon" className="me-2" />
                                                                <p className="mb-0">{course.lessonCount || "0"}+ Lessons</p>
                                                            </div>
                                                            <div className="course-view d-flex align-items-center">
                                                                <img src={Icon2} alt="Duration Icon" className="me-2" />
                                                                <p className="mb-0">{course.duration || "0hr"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="rating mt-3">
                                                            {[...Array(5)].map((_, i) => (
                                                                <i
                                                                    key={i}
                                                                    className={`fas fa-star ${i < (course.rating || 0) ? "filled" : ""} me-1`}
                                                                />
                                                            ))}
                                                            <span className="d-inline-block average-rating">
                                                                <span>{course.rating || "0.0"}</span> ({course.ratingCount || "0"})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No recent courses!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
