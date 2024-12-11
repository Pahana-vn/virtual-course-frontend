import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { addCourseToCart, addCourseToWishlist, fetchCartItems } from "../../../../services/studentService";
import { Video } from "../../../imagepath";

const DetailsContent = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartCourses, setCartCourses] = useState([]);

  const studentId = 1;

  useEffect(() => {
    const getCartCourses = async () => {
      try {
        // Thay vì fetchStudentCourses, dùng fetchCartItems
        const courses = await fetchCartItems(studentId);
        setCartCourses(courses);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    getCartCourses();
  }, [studentId]);

  const isCourseInCart = (courseId) => {
    return cartCourses.some(item => item.course && item.course.id === courseId);
  };

  const handleAddToCart = async () => {
    console.log("Course ID: ", course.id);
    if (isCourseInCart(course.id)) {
      alert("This course is already in your cart!");
      return;
    }

    try {
      setCartLoading(true);
      const courseData = {
        id: course.id,
        name: course.titleCourse,
        price: course.price,
      };
      console.log("Course data to send: ", courseData);

      await addCourseToCart(studentId, courseData);
      alert("Added to cart successfully!");
    } catch (error) {
      alert((error.response ? error.response.data : error.message));
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setLoading(true);
      await addCourseToWishlist(studentId, course.id);
      alert("Added to wishlist successfully!");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("This course is already in your wishlist!");
        } else {
          alert("Error: " + (error.response.data || "Failed to add to wishlist"));
        }
      } else {
        alert("Network error, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-content course-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Course details and content can go here */}
            </div>

            <div className="col-lg-4">
              <div className="sidebar-sec">
                {/* Video */}
                <div className="video-sec vid-bg">
                  <div className="card">
                    <div className="card-body">
                      <Link
                        to="https://www.youtube.com/embed/1trvO6dqQUI"
                        className="video-thumbnail"
                        data-fancybox=""
                      >
                        <div className="play-icon">
                          <i className="fa-solid fa-play" />
                        </div>
                        <img className="" src={Video} alt="" />
                      </Link>
                      <div className="video-details">
                        <div className="course-fee">
                          <h2>{course.price ? `$${course.price}` : 'FREE'}</h2>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <button
                              className="btn btn-wish w-100"
                              onClick={handleAddToCart}
                              disabled={cartLoading}
                            >
                              {cartLoading ? "Adding to Cart..." : "Add Cart"}
                            </button>
                          </div>

                          <div className="col-md-6 addHeart">
                            <button
                              className="btn btn-wish w-100"
                              onClick={handleAddToWishlist}
                              disabled={loading}
                            >
                              {loading ? "Adding..." : "Add to Wishlist"}
                            </button>
                          </div>
                        </div>

                        <Link to="/checkout" className="btn btn-enroll w-100">
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Video */}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

DetailsContent.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titleCourse: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    learn: PropTypes.arrayOf(PropTypes.string),
    requirements: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default DetailsContent;
