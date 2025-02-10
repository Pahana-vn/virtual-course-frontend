import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addCourseToCart, addCourseToWishlist, fetchCartItems } from "../../../../services/studentService";
import { Video } from "../../../imagepath";

const DetailsContent = ({ course }) => {
  // Lấy studentId từ LocalStorage
  const [studentId, setStudentId] = useState(() => {
    const storedId = localStorage.getItem("studentId");
    if (!storedId) {
      console.warn("⚠️ Không tìm thấy studentId trong LocalStorage!");
    }
    return storedId;
  });

  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(false);
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
        console.warn("⚠️ Không tìm thấy studentId, bỏ qua API call");
        return;
      }

      try {
        console.log(`📌 Gửi request lấy giỏ hàng cho studentId: ${studentId}`);
        const courses = await fetchCartItems(studentId);
        setCartCourses(courses);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách giỏ hàng:", error);
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
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    if (isCourseInCart(course.id)) {
      toast.info("Khóa học này đã có trong giỏ hàng!");
      return;
    }

    try {
      setCartLoading(true);
      const courseData = { id: course.id };
      await addCourseToCart(studentId, courseData);
      toast.success("Thêm vào giỏ hàng thành công!");
      setCartCourses([...cartCourses, { course: { id: course.id } }]);
    } catch (error) {
      toast.error("Thêm vào giỏ hàng thất bại.");
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!studentId) {
      toast.error("Bạn cần đăng nhập để thêm vào danh sách yêu thích.");
      return;
    }

    try {
      setLoading(true);
      const result = await addCourseToWishlist(studentId, course.id);

      if (result && !result.success) {
        toast.info(result.message);
      } else {
        toast.success("Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      toast.error("Thêm vào danh sách yêu thích thất bại.");
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
                  <h3>Bạn sẽ học được</h3>
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
                          <h2>{course.price ? `$${course.price}` : "Đang cập nhật.."}</h2>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <button className="btn btn-wish w-100" onClick={handleAddToCart} disabled={cartLoading}>
                              {cartLoading ? "Đang thêm vào giỏ hàng..." : "Thêm vào giỏ hàng"}
                            </button>
                          </div>

                          <div className="col-md-6 addHeart">
                            <button className="btn btn-wish w-100" onClick={handleAddToWishlist} disabled={loading}>
                              {loading ? "Đang thêm..." : "Thêm vào yêu thích"}
                            </button>
                          </div>
                        </div>

                        <Link to="/checkout" className="btn btn-enroll w-100">
                          Mua ngay
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
    price: PropTypes.number,
    learn: PropTypes.arrayOf(PropTypes.string),
    requirements: PropTypes.arrayOf(PropTypes.string),
    urlVideo: PropTypes.string,
  }).isRequired,
};

export default DetailsContent;
