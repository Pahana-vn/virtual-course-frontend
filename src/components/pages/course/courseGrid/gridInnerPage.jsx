import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCourses } from "../../../../services/courseService";
import { Icon1, Icon2 } from "../../../imagepath";

const GridInnerPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseData = await fetchCourses();
        setCourses(courseData);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      {courses.map((course) => (
        <div key={course.id} className="col-lg-4 col-md-6 d-flex">
          <div className="course-box course-design d-flex">
            <div className="product">
              <div className="product-img">
                <Link to={`/course-details/${course.id}`}>
                  <img
                    className="img-fluid"
                    alt={course.titleCourse}
                    src={course.imageCover}
                  />
                </Link>
                <div className="price">
                  <h3>
                    ${course.basePrice} <span>${course.basePrice * 0.7}</span>
                  </h3>
                </div>
              </div>
              <div className="product-content">
                <div className="course-group d-flex">
                  <div className="course-group-img d-flex">
                    <Link to={`/instructor/${course.instructorFirstName}-${course.instructorLastName}`}>
                      <img
                        src={course.instructorPhoto || "default-instructor.jpg"}
                        alt={course.instructorFirstName + " " + course.instructorLastName}
                        className="img-fluid"
                      />
                    </Link>
                    <div className="course-name">
                      <h4>
                        <Link to={`/instructor/${course.instructorFirstName}-${course.instructorLastName}`}>
                          {course.instructorFirstName} {course.instructorLastName}
                        </Link>
                      </h4>
                      <p>Instructor</p>
                    </div>
                  </div>
                  <div className="course-share d-flex align-items-center justify-content-center">
                    <Link to="#">
                      <i className="fa-regular fa-heart" />
                    </Link>
                  </div>
                </div>
                <h3 className="title">
                  <Link to={`/course-details/${course.id}`}>
                    {course.titleCourse}
                  </Link>
                </h3>
                <div className="course-info d-flex align-items-center">
                  <div className="rating-img d-flex align-items-center">
                    <img src={Icon1} alt="" />
                    <p>{course.duration}+ Lessons</p>
                  </div>
                  <div className="course-view d-flex align-items-center">
                    <img src={Icon2} alt="" />
                    <p>{course.duration} hrs</p>
                  </div>
                </div>
                <div className="rating">
                  <i className="fas fa-star filled me-1" />
                  <i className="fas fa-star filled me-1" />
                  <i className="fas fa-star filled me-1" />
                  <i className="fas fa-star filled me-1" />
                  <i className="fas fa-star me-1" />
                  <span className="d-inline-block average-rating">
                    <span>4.0</span> (15)
                  </span>
                </div>
                <div className="all-btn all-category d-flex align-items-center">
                  <Link
                    to={`/checkout/${course.id}`} // Pass courseId dynamically
                    className="btn btn-primary"
                  >
                    BUY NOW
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridInnerPage;
