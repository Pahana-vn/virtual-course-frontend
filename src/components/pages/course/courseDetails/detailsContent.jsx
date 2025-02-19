<<<<<<< HEAD
import FeatherIcon from "feather-icons-react";
import React, { useState } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import {
  Chapter,
  Chart,
  Cloud,
  Icon1,
  Icon2,
  Import,
  Key,
  Mobile,
  People,
  Play,
  Teacher,
  Timer2,
  User1,
  Users,
  Video2,
} from "../../../imagepath";
import Rating from "./rating"
import { useInstructorDetailsQuery } from "../../../../redux/slices/instructor/instructorApiSlice";
import useLectureDurations from "../../../../hooks/useLectureDurations";

const DetailsContent = ({ courseDetails }) => {
  const [openStates, setOpenStates] = useState([]);

  const durations = useLectureDurations(
    courseDetails.sections.flatMap((section) => section.lectures || [])
  );

  const instructorIdNumber = Number(courseDetails.instructorId);
  const {
    data: instructorDetails,
    isLoading,
    isError,
  } = useInstructorDetailsQuery({ id: instructorIdNumber });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading instructor details.</p>;

  const sanitizedCourseDescription = DOMPurify.sanitize(courseDetails.description);

  const sanitizedInstructorDescription = DOMPurify.sanitize(instructorDetails.bio);
=======
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
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c

  return (
    <>
      <section className="page-content course-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
<<<<<<< HEAD
              {/* Overview */}
              <div className="card overview-sec">
                <div className="card-body">
                  <h5 className="subs-title">Overview</h5>
                  <h6>Course Description</h6>
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedCourseDescription }}
                  ></div>
                  {courseDetails.sections &&
                    courseDetails.sections.length > 0 && (
                      <div>
                        <h6>What you&apos;ll learn</h6>
                        <ul>
                          {courseDetails.sections.map((section, index) => (
                            <li key={index}>{section.titleSection}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  <h6>Requirements</h6>
                  <ul className="mb-0">
                    <li>
                      You will need a copy of Adobe XD 2019 or above. A free
                      trial can be downloaded from Adobe.
                    </li>
                    <li>No previous design experience is needed.</li>
                    <li className="mb-0">
                      No previous Adobe XD skills are needed.
                    </li>
                  </ul>
                </div>
              </div>
              {/* /Overview */}
              {/* Course Content */}
              <div className="card content-sec">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <h5 className="subs-title">Course Content</h5>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                      <h6>{courseDetails.sections?.length || 0} Sections</h6>
                    </div>
                  </div>
                  {courseDetails.sections &&
                  courseDetails.sections.length > 0 ? (
                    courseDetails.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="course-card">
                        <h6 className="cou-title">
                          <Link
                            className="collapsed"
                            data-bs-toggle="collapse"
                            to={`#section-${sectionIndex}`}
                            aria-expanded={!!openStates[sectionIndex]}
                            onClick={() => {
                              const newStates = [...openStates];
                              newStates[sectionIndex] =
                                !newStates[sectionIndex];
                              setOpenStates(newStates);
                            }}
                            aria-controls={`section-${sectionIndex}`}
                          >
                            {`Section ${sectionIndex + 1}: ${section.titleSection}`}
                          </Link>
                        </h6>
                        <div
                          id={`section-${sectionIndex}`}
                          className={`card-collapse collapse ${
                            openStates[sectionIndex] ? "show" : ""
                          }`}
                        >
                          <ul>
                            {section.lectures && section.lectures.length > 0 ? (
                              section.lectures.map((lecture) => (
                                <li key={lecture.id}>
                                  <p>
                                    <img src={Play} alt="" className="me-2" />
                                    {lecture.titleLecture}
                                  </p>
                                  <div>
                                    <Link to={lecture.lectureVideo || "#"}>
                                      Preview
                                    </Link>
                                    <span>
                                    Duration: {durations[lecture.id] || "N/A"}
                                    </span>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <p>No lectures available in this section.</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No sections available for this course.</p>
                  )}
                </div>
              </div>
              {/* /Course Content */}
              {/* Instructor */}
              <div className="card instructor-sec">
                <div className="card-body">
                  <h5 className="subs-title">About the instructor</h5>
                  <div className="instructor-wrap">
                    <div className="about-instructor">
                      <div className="abt-instructor-img">
                        <Link to="/instructor/instructor-profile">
                          <img
                            src={instructorDetails.photo}
                            alt="img"
                            className="img-fluid"
                          />
                        </Link>
                      </div>
                      <div className="instructor-detail">
                        <h5>
                          <Link to="/instructor/instructor-profile">
                            {`${instructorDetails.firstName} ${instructorDetails.lastName}`}
                          </Link>
                        </h5>
                        <p>{instructorDetails.title}</p>
                      </div>
                    </div>
                    <Rating averageRating={instructorDetails.averageRating} />
                  </div>
                  <div className="course-info d-flex align-items-center">
                    <div className="cou-info">
                      <img src={Play} alt="" />
                      <p>{instructorDetails.totalCourses} Courses</p>
                    </div>
                    <div className="cou-info">
                      <img src={Icon1} alt="" />
                      <p>{instructorDetails.totalSections} Lectures</p>
                    </div>
                    <div className="cou-info">
                      <img src={Icon2} alt="" />
                      <p>{courseDetails.duration} minutes</p>
                    </div>
                    <div className="cou-info">
                      <img src={People} alt="" />
                      <p>{instructorDetails.totalStudents} students enrolled</p>
                    </div>
                  </div>
                  <p>{instructorDetails.title}</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedInstructorDescription }}
                  ></div>
                </div>
              </div>
              {/* /Instructor */}
              {/* Reviews */}
              <div className="card review-sec">
                <div className="card-body">
                  <h5 className="subs-title">Reviews</h5>
                  <div className="instructor-wrap">
                    <div className="about-instructor">
                      <div className="abt-instructor-img">
                        <Link to="instructor-profile">
                          <img src={User1} alt="img" className="img-fluid" />
                        </Link>
                      </div>
                      <div className="instructor-detail">
                        <h5>
                          <Link to="/instructor/instructor-profile">
                            Nicole Brown
                          </Link>
                        </h5>
                        <p>UX/UI Designer</p>
                      </div>
                    </div>
                    <div className="rating">
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star me-1" />
                      <span className="d-inline-block average-rating">
                        4.5 Instructor Rating
                      </span>
                    </div>
                  </div>
                  <p className="rev-info">
                    “ This is the second Photoshop course I have completed with
                    Cristian. Worth every penny and recommend it highly. To get
                    the most out of this course, its best to to take the
                    Beginner to Advanced course first. The sound and video
                    quality is of a good standard. Thank you Cristian. “
                  </p>
                  <Link to="#" className=" btn-reply">
                    {/* <i className="feather-corner-up-left" /> */}
                    <FeatherIcon icon="corner-up-left" />
                    Reply
                  </Link>
                </div>
              </div>
              {/* /Reviews */}
              {/* Comment */}
              <div className="card comment-sec">
                <div className="card-body">
                  <h5 className="subs-title">Post A comment</h5>
                  <form action="#">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-block">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-block">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="input-block">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="input-block">
                      <textarea
                        rows={4}
                        className="form-control"
                        placeholder="Your Comments"
                        defaultValue={""}
                      />
                    </div>
                    <div className="submit-section">
                      <button className=" submit-btn" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* /Comment */}
=======
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
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
            </div>

            <div className="col-lg-4">
              <div className="sidebar-sec">
                <div className="video-sec vid-bg">
                  <div className="card">
                    <div className="card-body">
<<<<<<< HEAD
                      <Link
                        to={courseDetails.urlVideo}
                        className="video-thumbnail"
                        data-fancybox=""
                      >
                        <div className="play-icon">
                          <i className="fa-solid fa-play" />
                        </div>
                        <img
                          className=""
                          src={courseDetails.imageCover}
                          alt=""
                        />
=======
                      <Link to={course.urlVideo || "#"} className="video-thumbnail">
                        <div className="play-icon">
                          <i className="fa-solid fa-play" />
                        </div>
                        <img className="" src={Video} alt="Video Preview" />
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
                      </Link>

                      <div className="video-details">
                        <div className="course-fee">
<<<<<<< HEAD
                          <h2>FREE</h2>
                          <p>
                            <span>${courseDetails.basePrice}</span> 50% off
                          </p>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <Link to="/cart" className="btn btn-wish w-100">
                              <i className="feather icon-share-2 me-2" />
                              Add Cart
                            </Link>
=======
                          <h2>{course.basePrice ? `$${course.basePrice}` : "Updating.."}</h2>
                        </div>
                        <div className="row gx-2">
                          <div className="col-md-6 addHeart">
                            <button className="btn btn-wish w-100" onClick={handleAddToCart} disabled={cartLoading}>
                              {cartLoading ? "Adding to cart..." : "Add to cart"}
                            </button>
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
                          </div>

                          <div className="col-md-6 addHeart">
                            <button className="btn btn-wish w-100" onClick={handleAddToWishlist} disabled={loading}>
                              {loading ? "Adding..." : "Add to favorites"}
                            </button>
                          </div>
                        </div>
<<<<<<< HEAD
                        <Link to="/checkout" className="btn btn-enroll w-100">
                          Enroll Now
=======

                        <Link to="/checkout" className="btn btn-enroll w-100">
                          Buy now
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
<<<<<<< HEAD
                {/* /Video */}
                {/* Include */}
                <div className="card include-sec">
                  <div className="card-body">
                    <div className="cat-title">
                      <h4>Includes</h4>
                    </div>
                    <ul>
                      <li>
                        <img src={Import} className="me-2" alt="" /> 11 hours
                        on-demand video
                      </li>
                      <li>
                        <img src={Play} className="me-2" alt="" /> 69
                        downloadable resources
                      </li>
                      <li>
                        <img src={Key} className="me-2" alt="" /> Full lifetime
                        access
                      </li>
                      <li>
                        <img src={Mobile} className="me-2" alt="" /> Access on
                        mobile and TV
                      </li>
                      <li>
                        <img src={Cloud} className="me-2" alt="" /> Assignments
                      </li>
                      <li>
                        <img src={Teacher} className="me-2" alt="" />{" "}
                        Certificate of Completion
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /Include */}
                {/* Features */}
                <div className="card feature-sec">
                  <div className="card-body">
                    <div className="cat-title">
                      <h4>Includes</h4>
                    </div>
                    <ul>
                      <li>
                        <img src={Users} className="me-2" alt="" /> Enrolled:{" "}
                        <span>32 students</span>
                      </li>
                      <li>
                        <img src={Timer2} className="me-2" alt="" /> Duration:{" "}
                        <span>20 hours</span>
                      </li>
                      <li>
                        <img src={Chapter} className="me-2" alt="" /> Chapters:{" "}
                        <span>15</span>
                      </li>
                      <li>
                        <img src={Video2} className="me-2" alt="" /> Video:
                        <span> 12 hours</span>
                      </li>
                      <li>
                        <img src={Chart} className="me-2" alt="" /> Level:{" "}
                        <span>Beginner</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /Features */}
=======
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

DetailsContent.propTypes = {
<<<<<<< HEAD
  courseDetails: PropTypes.shape({
    description: PropTypes.string,
    urlVideo: PropTypes.string,
    imageCover: PropTypes.string,
    basePrice: PropTypes.number,
    duration: PropTypes.number,
    instructorId: PropTypes.string,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        titleSection: PropTypes.string,
      })
    ),
=======
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titleCourse: PropTypes.string,
    description: PropTypes.string,
    basePrice: PropTypes.number,
    learn: PropTypes.arrayOf(PropTypes.string),
    requirements: PropTypes.arrayOf(PropTypes.string),
    urlVideo: PropTypes.string,
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c
  }).isRequired,
};

export default DetailsContent;
