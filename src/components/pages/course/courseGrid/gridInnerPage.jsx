import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Icon1, Icon2 } from "../../../imagepath";
import useCurrencyFormatter from "../../../../hooks/useCurrencyFormatter";

const GridInnerPage = ({ courses }) => {
  const formatCurrency = useCurrencyFormatter();
  return (
    <>
      <div className="row">
      {courses.map((course) => (
        <div key={course.id} className="col-lg-4 col-md-6 d-flex">
          <div className="course-box course-design d-flex ">
            <div className="product">
              <div className="product-img">
                <Link to={`/course-details/${course.id}`}>
                  <img
                    className="img-fluid"
                    style={{ objectFit: 'cover', height: '200px' }}
                    alt={course.titleCourse}
                    src={course.imageCover || "/default-image.png"}
                  />
                </Link>
                <div className="price">
                  <h3>
                  <small>{course.basePrice === 0 ? "Free" : formatCurrency(course.basePrice)}</small>
                  </h3>
                </div>
              </div>
              <div className="product-content">
                <div className="course-group d-flex">
                  <div className="course-group-img d-flex">
                    <Link to={`/instructor/${course.instructorId}/instructor-profile`}>
                      <img
                        src={course.instructorPhoto}
                        alt={course.instructorName}
                        className="img-fluid"
                      />
                    </Link>
                    <div className="course-name">
                      <h4>
                        <Link to={`/instructor/${course.instructorId}/instructor-profile`}>{course.instructorFirstName} {course.instructorLastName}</Link>
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
                <h3 className="course-title">
                  <Link to={`/course-details/${course.id}`}>
                  {course.titleCourse}
                  </Link>
                </h3>
                <div className="course-info d-flex align-items-center">
                  <div className="rating-img d-flex align-items-center">
                    <img src={Icon1} alt="" />
                    <p>{course.totalLectures}+ Lessons</p>
                  </div>
                  <div className="course-view d-flex align-items-center">
                    <img src={Icon2} alt="" />
                    <p>{course.duration} mins</p>
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
    </>
  );
};
GridInnerPage.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      titleCourse: PropTypes.string.isRequired,
      description: PropTypes.string,
      categoryId: PropTypes.number,
      categoryName: PropTypes.string,
      level: PropTypes.string,
      imageCover: PropTypes.string,
      basePrice: PropTypes.number,
      status: PropTypes.string,
      instructorId: PropTypes.number,
      instructorName: PropTypes.string,
      instructorPhoto: PropTypes.string,
    })
  ).isRequired,
};

export default GridInnerPage;
