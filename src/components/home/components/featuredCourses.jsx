import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {  Icon1, Icon2 } from "../../../components/imagepath";
const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);

  // Gọi API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/courses");
        setCourses(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
      }
    };

    fetchCourses();
  }, []);

  const toggleClass = () => {
    // Thêm logic toggleClass ở đây nếu cần
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    // What's new Featured Course
    <section className="section new-course">
      <div className="container">
        <div className="section-header aos" data-aos="fade-up">
          <div className="section-sub-head">
            <span>What’s New</span>
            <h2>Featured Courses</h2>
          </div>
          <div className="all-btn all-category d-flex align-items-center">
            <Link to="/course-grid" className="btn btn-primary">
              All Courses
            </Link>
          </div>
        </div>
        <div className="section-text aos" data-aos="fade-up">
          <p className="mb-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget
            aenean accumsan bibendum gravida maecenas augue elementum et neque.
            Suspendisse imperdiet.
          </p>
        </div>
        <div className="course-feature">
          <div className="row">
            {courses.map((course) => (
              <div className="col-lg-4 col-md-6 d-flex" key={course.id}>
                <div className="course-box d-flex aos" data-aos="fade-up">
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
                        <h3>
                          {formatCurrency(course.basePrice)}
                        </h3>
                      </div>
                    </div>
                    <div className="product-content">
                      <div className="course-group d-flex">
                        <div className="course-group-img d-flex">
                          <Link to={`/instructor/${course.instructorId}/instructor-profile`}>
                            <img
                              src={course.instructorPhoto || "default-avatar.jpg"}
                              alt=""
                              className="img-fluid"
                            />
                          </Link>
                          <div className="course-name">
                            <h4>
                              <Link to={`/instructor/${course.instructorId}/instructor-profile`}>
                                {course.instructorFirstName} {course.instructorLastName}
                              </Link>
                            </h4>
                            <p>Instructor</p>
                          </div>
                        </div>
                        <div className="course-share d-flex align-items-center justify-content-center">
                          <Link to="#">
                            <i
                              onClick={toggleClass}
                              className="fa-regular fa-heart"
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
                          <img src={ Icon1} alt="" />
                          <p>12+ Lesson</p>
                        </div>
                        <div className="course-view d-flex align-items-center">
                          <img src={ Icon2} alt="" />
                          <p>{course.duration} min</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="rating m-0">
                          <i className="fas fa-star filled me-1" />
                          <i className="fas fa-star filled me-1" />
                          <i className="fas fa-star filled me-1" />
                          <i className="fas fa-star filled me-1" />
                          <i className="fas fa-star" />
                          <span className="d-inline-block average-rating">
                            <span>4.0</span> (15)
                          </span>
                        </div>
                        <div className="all-btn all-category d-flex align-items-center">
                          <Link to="/checkout" className="btn btn-primary">
                            BUY NOW
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
