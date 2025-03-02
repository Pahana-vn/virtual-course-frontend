import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWishlist } from "../../../services/studentService";
import Footer from "../../footer";
import { Icon01, Icon2, User2, course02 } from "../../imagepath";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentWishlist = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (studentId) {
          const data = await fetchWishlist(studentId);
          setWishlist(data);
        } else {
          setError("Student ID not found in localStorage.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStudentWishlist();
  }, []);

  const renderWishlist = () => {
    if (wishlist.length === 0) {
      return <p>No courses in your wishlist.</p>;
    }

    return wishlist.map((course, index) => (
      <div key={index} className="col-xxl-4 col-md-6 d-flex">
        <div className="course-box flex-fill">
          <div className="product">
            <div className="product-img">
              <Link to={`/course-details/${course.id}`}>
                <img
                  className="img-fluid"
                  alt={course.titleCourse}
                  src={course.imageCover || course02}
                />
              </Link>
              <div className="price">
                <h3>
                  {course.basePrice.toLocaleString()} VND{" "}
                </h3>
              </div>
            </div>
            <div className="product-content">
              <div className="course-group d-flex">
                <div className="course-group-img d-flex">
                  <Link to={`/instructor/instructor-profile/${course.instructorId}`}>
                    <img
                      src={course.instructorPhoto || User2}
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
                <div className="course-share d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-heart color-active" />
                </div>
              </div>

              <h3 className="title instructor-text" >
                <Link to={`/course-details/${course.id}`}>{course.titleCourse}</Link>
              </h3>

              <div className="course-info d-flex align-items-center">
                <div className="rating-img d-flex align-items-center">
                  <img src={Icon01} alt="Img" />
                  <p>{course.lessons} Lessons</p>
                </div>
                <div className="course-view d-flex align-items-center">
                  <img src={Icon2} alt="Img" />
                  <p>{course.duration} hours</p>
                </div>
              </div>
              <div className="rating mb-0">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${i < course.rating ? "filled" : ""} me-1`}
                  />
                ))}
                <span className="d-inline-block average-rating">
                  <span>{course.rating}</span> ({course.reviewsCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Wishlist"} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Wishlist</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Wishlist
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
            <StudentSidebar />
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-info">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Wishlist</h3>
                  </div>
                  <div className="checkout-form pb-0">
                    <div className="row">{renderWishlist()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <Footer />
    </div>
  );
};

export default StudentWishlist;
