/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addCourseToCart, addCourseToWishlist, fetchCartItems } from "../../../../services/studentService";
import { Video } from "../../../imagepath";

const DetailsContent = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartCourses, setCartCourses] = useState([]);

  const studentId = 1;

  useEffect(() => {
    const getCartAndWishlistData = async () => {
      try {
        const courses = await fetchCartItems(studentId);
        setCartCourses(courses);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
        toast.error("Unable to get cart information.");
      }
    };

    getCartAndWishlistData();
  }, [studentId]);

  const isCourseInCart = (courseId) => {
    return cartCourses.some(item => item.course && item.course.id === courseId);
  };

  const handleAddToCart = async () => {
    console.log("Course ID: ", course.id);
    if (isCourseInCart(course.id)) {
      toast.info("This course is already in your cart!");
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
      toast.success("Added to cart successfully!");
    } catch (error) {
      const errorMessage = error.response && error.response.data
        ? error.response.data
        : error.message;
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setLoading(true);
      await addCourseToWishlist(studentId, course.id);
      toast.success("Added to favorites successfully!");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.info("This course is already in your wishlist!");
        } else {
          toast.error(`ErrorError: ${error.response.data || "Cannot add to favorites"}`);
        }
      } else {
        toast.error("Network error, please try again later.");
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
              <h1>{course.titleCourse}</h1>
              <p>{course.description}</p>
              {course.learn && course.learn.length > 0 && (
                <div>
                  <h3>What You Will Learn</h3>
                  <ul>
                    {course.learn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <h3>Requirements</h3>
                  <ul>
                    {course.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                        <img className="" src={Video} alt="Video Preview" />
                      </Link>
                      <div className="video-details">
                        <div className="course-fee">
                          <h2>{course.price ? `$${course.price}` : 'Loading..'}</h2>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <button
                              className="btn btn-wish w-100"
                              onClick={handleAddToCart}
                              disabled={cartLoading}
                            >
                              {cartLoading ? "Adding to cart..." : "Add to cart"}
                            </button>
                          </div>

                          <div className="col-md-6 addHeart">
                            <button
                              className="btn btn-wish w-100"
                              onClick={handleAddToWishlist}
                              disabled={loading}
                            >
                              {loading ? "Adding..." : "Add to Favorites"}
                            </button>
                          </div>
                        </div>

                        <Link to="/checkout" className="btn btn-enroll w-100">
                          Buy now
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
