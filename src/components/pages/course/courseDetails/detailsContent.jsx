import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addCourseToCart, addCourseToWishlist, fetchCartItems } from "../../../../services/studentService";
import { Video } from "../../../imagepath";

const DetailsContent = ({ course }) => {
  const [studentId, setStudentId] = useState(() => {
    const storedId = localStorage.getItem("studentId");
    if (!storedId) {
      console.warn("StudentId not found in LocalStorage!");
    }
    return storedId;
  });

  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStudentId = localStorage.getItem("studentId");
      if (newStudentId !== studentId) {
        setStudentId(newStudentId);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [studentId]);

  useEffect(() => {
    const getCartItems = async () => {
      if (!studentId) {
        console.warn("StudentId not found, API call skipped");
        return;
      }

      try {
        console.log(`Send request to get shopping cart for studentId: ${studentId}`);
        const courses = await fetchCartItems(studentId);
        setCartCourses(courses);
      } catch (error) {
        console.error("Error getting shopping cart list:", error);
      }
    };

    if (studentId) {
      getCartItems();
    }
  }, [studentId]);

  const isCourseInCart = (courseId) => {
    return cartCourses.some((item) => item.course && item.course.id === courseId);
  };

  const handleAddToCart = async () => {
    if (!studentId) {
      toast.error("You need to login to add to cart.");
      return;
    }

    if (isCourseInCart(course.id)) {
      toast.info("This course is already in your cart!");
      return;
    }

    try {
      setCartLoading(true);
      const courseData = { id: course.id };
      await addCourseToCart(studentId, courseData);
      toast.success("Add to cart successfully!");
      setCartCourses([...cartCourses, { course: { id: course.id } }]);
    } catch (error) {
      toast.error("Add to cart failed.");
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const getWishlist = async () => {
      if (!studentId) return;
      try {
        const wishlistData = await addCourseToWishlist(studentId);
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error when getting wishlist:", error);
      }
    };

    getWishlist();
  }, [studentId]);

  const handleAddToWishlist = async () => {
    if (!studentId) {
      toast.error("You need to login to add to favorites list.");
      return;
    }

    try {
      setLoading(true);
      const result = await addCourseToWishlist(studentId, course.id);

      if (!result.success) {
        toast.info(result.message);
      } else {
        toast.success("Add to wishlist successfully!");
      }
    } catch (error) {
      toast.error("Add to favorites failed.");
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
                  <h3>You will learn</h3>
                  <ul>
                    {course.learn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <h3>Yêu cầu</h3>
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
                <div className="video-sec vid-bg">
                  <div className="card">
                    <div className="card-body">
                      <Link to={course.urlVideo || "#"} className="video-thumbnail">
                        <div className="play-icon">
                          <i className="fa-solid fa-play" />
                        </div>
                        <img className="" src={Video} alt="Video Preview" />
                      </Link>

                      <div className="video-details">
                        <div className="course-fee">
                          <h2>{course.basePrice ? `$${course.basePrice}` : "Updating.."}</h2>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <button className="btn btn-wish w-100" onClick={handleAddToCart} disabled={cartLoading}>
                              {cartLoading ? "Adding to cart..." : "Add to cart"}
                            </button>
                          </div>

                          <div className="col-md-6 addHeart">
                            <button className="btn btn-wish w-100" onClick={handleAddToWishlist} disabled={loading}>
                              {loading ? "Adding..." : "Add to favorites"}
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
    basePrice: PropTypes.number,
    learn: PropTypes.arrayOf(PropTypes.string),
    requirements: PropTypes.arrayOf(PropTypes.string),
    urlVideo: PropTypes.string,
  }).isRequired,
};

export default DetailsContent;
