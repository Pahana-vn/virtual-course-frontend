import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../../../../services/courseService"; // Giả sử bạn có một API để lấy chi tiết khóa học
import Footer from "../../../footer";
import { Icon1, People, Timer, User1 } from "../../../imagepath";
import CourseHeader from "../../../student/header";
import DetailsContent from "./detailsContent";

const CourseDetails = () => {
  const { courseId } = useParams();  // Lấy ID khóa học từ URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin khóa học từ API

  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        console.log(data);  // Kiểm tra dữ liệu trả về
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [courseId]);



  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu khóa học
  }

  // Nếu không có khóa học, hiển thị thông báo lỗi
  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="main-wrapper">
      <CourseHeader activeMenu={"CourseDetails"} />

      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Courses
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      All Courses
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {course?.titleCourse || "Course Title"} {/* Hiển thị tên khóa học nếu có */}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="inner-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="instructor-wrap border-bottom-0 m-0">
                <div className="about-instructor align-items-center">
                  <div className="abt-instructor-img">
                    <Link to={`/instructor/${course?.instructorFirstName}-${course?.instructorLastName}`}>
                      <img
                        src={course?.instructorPhoto || User1} // Nếu không có ảnh giảng viên, sử dụng ảnh mặc định
                        alt={`${course?.instructorFirstName} ${course?.instructorLastName}`}
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="instructor-detail me-3">
                    <h5>
                      <Link to={`/instructor/${course?.instructorFirstName}-${course?.instructorLastName}`}>
                        {course?.instructorFirstName} {course?.instructorLastName || "Instructor Name"}
                      </Link>
                    </h5>
                    <p>{course?.instructorRole || "Instructor"}</p>
                  </div>
                  <div className="rating mb-0">
                    <i className="fas fa-star filled me-1" />
                    <i className="fas fa-star filled me-1" />
                    <i className="fas fa-star filled me-1" />
                    <i className="fas fa-star filled me-1" />
                    <i className="fas fa-star me-1" />
                    <span className="d-inline-block average-rating">
                      <span>{course?.rating || 4.5}</span> ({course?.reviewsCount || 15})
                    </span>
                  </div>
                </div>
                <span className="web-badge mb-3">{course?.category || "Category"}</span>
              </div>

              <h2>{course?.titleCourse || "Course Title"}</h2>
              <p>{course?.description || "Course Description"}</p>

              <div className="course-info d-flex align-items-center border-bottom-0 m-0 p-0">
                <div className="cou-info">
                  <img src={Icon1} alt="Lessons" />
                  <p>{course?.lessonsCount || "12+"} Lesson</p>
                </div>
                <div className="cou-info">
                  <img src={Timer} alt="Duration" />
                  <p>{course?.duration || "9hr 30min"}</p>
                </div>
                <div className="cou-info">
                  <img src={People} alt="Students Enrolled" />
                  <p>{course?.studentsEnrolled || "32"} students enrolled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị chi tiết khóa học */}
      <DetailsContent course={course} />

      <Footer />
    </div>
  );
};

export default CourseDetails;
