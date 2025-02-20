import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { selectCurrentRoles } from "../../redux/slices/auth/authSlice";
import { fetchCourses } from "../../services/courseService";
import Footer from "../footer";
import Header from "../header";
import {
  bannerimg,
  Become1,
  Become2,
  CertificateIcon,
  CourseIcon,
  GratuateIcon,
  Icon01,
  Icon02,
  Icon03,
  Icon04,
  Icon1,
  Icon10,
  Icon12,
  Icon13,
  Icon14,
  Icon15,
  Icon16,
  Icon17,
  Icon18,
  Icon2,
  Icon7,
  Icon8,
  Icon9,
  Join,
  PencilIcon,
  Share,
} from "../imagepath";
import { InstructorHeader } from "../instructor/header";
import StudentHeader from "../student/header";
import Blog from "./slider/blog";
import Companies from "./slider/companies";
import Testimonial from "./slider/testimonial";
import TopCategory from "./slider/topCategory";
import TrendingCourse from "./slider/trendingCourse";

const options = [
  { label: "Category", value: "Category" },
  { label: "Angular", value: "Angular" },
  { label: "Node Js", value: "Node Js" },
  { label: "React", value: "React" },
  { label: "Python", value: "Python" },
];

export const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const mobileSidebar = useSelector((state) => state.sidebarSlice.expandMenu);

  const role = useSelector(selectCurrentRoles);
  const renderHeader = () => {
    if (role?.includes("ROLE_INSTRUCTOR")) {
      return <InstructorHeader />;
    }
    if (role?.includes("ROLE_STUDENT")) {
      console.log("Student role detected");
      return <StudentHeader />;
    }
    return <Header />;
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        // console.log("Courses data:", data); // Xem cấu trúc dữ liệu ở đây
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    // console.log(mobileSidebar, "gg");
  }, [mobileSidebar]);

  if (loading) return <p>Loading...</p>;
  if (courses.length === 0) return <p>No courses available</p>;

  const formatValue = (value) => `${Math.floor(value)}`;

  const style = {
    control: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#FFDEDA",
      border: 0,
      paddingLeft: "5px",
      paddingTop: "5px",
      paddingBottom: "5px",
      boxShadow: 0,
      borderRadius: "50px",
      fontSize: "14px",
    }),
    menu: (base) => ({ ...base, marginTop: "2px" }),
    option: (provided) => ({
      ...provided,
      backgroundColor: mobileSidebar === "disabled" ? "#fff" : "#000",
      color: mobileSidebar === "disabled" ? "#000" : "#fff",
      fontSize: "14px",
    }),
    indicatorSeparator: (base) => ({ ...base, display: "none" }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "black",
      transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
      transition: "250ms",
    }),
  };

  return (
    <>
      <div className="main-wrapper">
        {renderHeader()}
        {/* banner */}
        <section className="home-slide d-flex align-items-center">
          <div className="container">
            <div className="row ">
              <div className="col-md-7">
                <div className="home-slide-face aos" data-aos="fade-up">
                  <div className="home-slide-text ">
                    <h5>The Leader in Online Learning</h5>
                    <h1>Engaging &amp; Accessible Online Courses For All</h1>
                    <p>Own your future learning new skills online</p>
                  </div>
                  <div className="banner-content">
                    <form className="form" action="/course-list">
                      <div className="form-inner">
                        <div className="input-group homeSearch">
                          <i className="fa-solid fa-magnifying-glass search-icon" />
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Search Course, Name Instructor, Category etc"
                          />
                          <span className="drop-detail">
                            <Select
                              // className="select2-container"
                              options={options}
                              value={options.value}
                              defaultValue={options[0]}
                              placeholder="Category"
                              styles={style}
                            ></Select>
                          </span>
                          <button className="btn sub-btn" type="submit">
                            <i className="fas fa-arrow-right" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="trust-user">
                    <p>
                      Trusted by over 15K Users <br />
                      worldwide since 2024
                    </p>
                    <div className="trust-rating d-flex align-items-center">
                      <div className="rate-head">
                        <h2>
                          <span className="d-flex">
                            <CountUp
                              start={0}
                              end={1000}
                              delay={1}
                              format={formatValue}
                            />
                            +
                          </span>
                        </h2>
                      </div>
                      <div className="rating d-flex align-items-center">
                        <h2 className="d-inline-block average-rating">4.4</h2>
                        <i className="fas fa-star filled me-1" />
                        <i className="fas fa-star filled me-1" />
                        <i className="fas fa-star filled me-1" />
                        <i className="fas fa-star filled me-1" />
                        <i className="fas fa-star filled me-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 d-flex align-items-center">
                <div className="girl-slide-img aos" data-aos="fade-up">
                  <img src={bannerimg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /banner */}

        {/* Home banner bottom */}
        <section className="section student-course">
          <div className="container">
            <div className="course-widget">
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="course-full-width">
                    <div
                      className="blur-border course-radius align-items-center aos"
                      data-aos="fade-up"
                    >
                      <div className="online-course d-flex align-items-center">
                        <div className="course-img">
                          <img src={PencilIcon} alt="" />
                        </div>
                        <div className="course-inner-content">
                          <h4>
                            {/* <span>10</span>K */}
                            <span className="d-flex">
                              <CountUp
                                start={0}
                                end={10}
                                delay={1}
                                duration={4}
                              />
                              K
                            </span>
                          </h4>
                          <p>Online Courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="course-full-width">
                    <div
                      className="blur-border course-radius aos"
                      data-aos="fade-up"
                    >
                      <div className="online-course d-flex align-items-center">
                        <div className="course-img">
                          <img src={CourseIcon} alt="" />
                        </div>
                        <div className="course-inner-content">
                          <h4>
                            <span className="d-flex">
                              <CountUp start={0} end={200} delay={1} />+
                            </span>
                          </h4>
                          <p>Expert Tutors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="course-full-width">
                    <div
                      className="blur-border course-radius aos"
                      data-aos="fade-up"
                    >
                      <div className="online-course d-flex align-items-center">
                        <div className="course-img">
                          <img src={CertificateIcon} alt="" />
                        </div>
                        <div className="course-inner-content">
                          <h4>
                            <span className="d-flex">
                              <CountUp
                                start={0}
                                end={6}
                                delay={1}
                                duration={5}
                              />
                              K+
                            </span>
                          </h4>
                          <p>Ceritified Courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 d-flex">
                  <div className="course-full-width">
                    <div
                      className="blur-border course-radius aos"
                      data-aos="fade-up"
                    >
                      <div className="online-course d-flex align-items-center">
                        <div className="course-img">
                          <img src={GratuateIcon} alt="" />
                        </div>
                        <div className="course-inner-content">
                          <h4>
                            <span className="d-flex">
                              <CountUp
                                start={0}
                                end={60}
                                delay={1}
                                duration={2}
                              />
                              K +
                            </span>
                          </h4>
                          <p>Online Students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Home banner bottom */}

        {/* Top Category with Owl Carousel */}
        <TopCategory />
        {/* Top Category with Owl Carousel */}

        {/* What's new Featured Course */}
        <section className="section new-course">
          <div className="container">
            <div className="section-header">
              <div className="section-sub-head">
                <span>What’s New</span>
                <h2>Featured Courses</h2>
              </div>
              <div className="all-btn all-category d-flex align-items-center">
                <Link to="/course-list" className="btn btn-primary">
                  All Courses
                </Link>
              </div>
            </div>
            <div className="course-feature">
              <div className="row">
                {courses.map((course) => (
                  <div className="col-lg-4 col-md-6 d-flex" key={course.id}>
                    <div className="course-box d-flex">
                      <div className="product">
                        <div className="product-img">
                          <Link to={`/course/${course.id}/course-details`}>
                            <img
                              className="img-fluid"
                              alt={course.titleCourse || "Course"}
                              src={course.imageCover} // Đây là URL ảnh từ API
                            />
                          </Link>
                          <div className="price">
                            <h3>
                              ${course.price || "N/A"}{" "}
                              <span>
                                $
                                {course.discountedPrice ||
                                  course.price ||
                                  "N/A"}
                              </span>
                            </h3>
                          </div>
                        </div>
                        <div className="product-content">
                          <div className="course-group d-flex">
                            <div className="course-group-img d-flex">
                              {/* Nếu API không có instructor, hiển thị mặc định */}
                              <img
                                src={
                                  course.instructorPhoto ||
                                  "default-instructor.jpg"
                                }
                                alt="Unknown Instructor"
                                className="img-fluid"
                              />
                              <div className="course-name">
                                <h4>
                                  <Link>{course.instructorFirstName}</Link>
                                </h4>
                                <p>Instructor</p>
                              </div>
                            </div>
                            <div className="course-share d-flex align-items-center justify-content-center">
                              <Link to="#">
                                <i className="fa-regular fa-heart"></i>
                              </Link>
                            </div>
                          </div>
                          <h3 className="title instructor-text">
                            <Link to={`/course/${course.id}/course-details`}>
                              {course.titleCourse || "Untitled Course"}
                            </Link>
                          </h3>
                          <div className="course-info d-flex align-items-center">
                            <div className="rating-img d-flex align-items-center">
                              <img src={Icon1} alt="" />
                              <p>{course.lessons || "0"}+ Lesson</p>
                            </div>
                            <div className="course-view d-flex align-items-center">
                              <img src={Icon2} alt="" />
                              <p>{course.duration || "N/A"}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star ${i < course.rating ? "filled" : ""
                                    }`}
                                />
                              ))}
                              <span className="d-inline-block average-rating">
                                {course.rating || "0"}
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

        {/* What's new Featured Course */}

        {/* Master Skills */}
        <section className="section master-skill">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12">
                <div className="section-header aos" data-aos="fade-up">
                  <div className="section-sub-head">
                    <span>What’s New</span>
                    <h2>Master the skills to drive your career</h2>
                  </div>
                </div>
                <div className="section-text aos" data-aos="fade-up">
                  <p>
                    Get certified, master modern tech skills, and level up your
                    career — whether you’re starting out or a seasoned pro. 95%
                    of eLearning learners report our hands-on content directly
                    helped their careers.
                  </p>
                </div>
                <div className="career-group aos" data-aos="fade-up">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 d-flex">
                      <div className="certified-group blur-border d-flex">
                        <div className="get-certified d-flex align-items-center">
                          <div className="blur-box">
                            <div className="certified-img ">
                              <img src={Icon01} alt="" className="img-fluid" />
                            </div>
                          </div>
                          <p>Stay motivated with engaging instructors</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 d-flex">
                      <div className="certified-group blur-border d-flex">
                        <div className="get-certified d-flex align-items-center">
                          <div className="blur-box">
                            <div className="certified-img ">
                              <img src={Icon02} alt="" className="img-fluid" />
                            </div>
                          </div>
                          <p>Keep up with in the latest in cloud</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 d-flex">
                      <div className="certified-group blur-border d-flex">
                        <div className="get-certified d-flex align-items-center">
                          <div className="blur-box">
                            <div className="certified-img ">
                              <img src={Icon03} alt="" className="img-fluid" />
                            </div>
                          </div>
                          <p>Get certified with 100+ certification courses</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 d-flex">
                      <div className="certified-group blur-border d-flex">
                        <div className="get-certified d-flex align-items-center">
                          <div className="blur-box">
                            <div className="certified-img ">
                              <img src={Icon04} alt="" className="img-fluid" />
                            </div>
                          </div>
                          <p>Build skills your way, from labs to courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 d-flex align-items-end">
                <div className="career-img aos" data-aos="fade-up">
                  <img src={Join} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Master Skills */}

        {/* Trending Course */}
        <TrendingCourse />
        {/* Trending Course */}

        {/* Companies */}
        <section className="section lead-companies">
          <div className="container">
            <div className="section-header aos" data-aos="fade-up">
              <div className="section-sub-head feature-head text-center">
                <span>Trusted By</span>
                <h2>500+ Leading Universities And Companies</h2>
              </div>
            </div>
            <div className="lead-group aos" data-aos="fade-up">
              <Companies />
            </div>
          </div>
        </section>
        {/* Companies */}

        {/* Share knowledge */}
        <section className="section share-knowledge">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="knowledge-img aos" data-aos="fade-up">
                  <img src={Share} alt="" className="img-fluid" />
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <div className="join-mentor aos" data-aos="fade-up">
                  <h2>Want to share your knowledge? Join us a Mentor</h2>
                  <p>
                    High-definition video is video of higher resolution and
                    quality than standard-definition. While there is no
                    standardized meaning for high-definition, generally any
                    video.
                  </p>
                  <ul className="course-list">
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Best Courses
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" />
                      Top rated Instructors
                    </li>
                  </ul>
                  <div className="all-btn all-category d-flex align-items-center">
                    <Link
                      to="/instructor/instructor-list"
                      className="btn btn-primary"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Share knowledge */}

        <section className="section user-love">
          <div className="container">
            <div className="section-header white-header aos" data-aos="fade-up">
              <div className="section-sub-head feature-head text-center">
                <span>Check out these real reviews</span>
                <h2>Users-love-us Dont take it from us.</h2>
              </div>
            </div>
          </div>
        </section>
        {/* Testimonial Carousel */}
        <Testimonial />
        {/* Testimonial Carousel */}

        {/* Become a instructor */}
        <section className="section become-instructors aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 d-flex">
                <div className="student-mentor cube-instuctor ">
                  <h4>Become An Instructor</h4>
                  <div className="row">
                    <div className="col-lg-7 col-md-12">
                      <div className="top-instructors">
                        <p>
                          Top instructors from around the world teach millions
                          of students on Mentoring.
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-12">
                      <div className="mentor-img">
                        <img className="img-fluid" alt="" src={Become2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-flex">
                <div className="student-mentor yellow-mentor">
                  <h4>Transform Access To Education</h4>
                  <div className="row">
                    <div className="col-lg-8 col-md-12">
                      <div className="top-instructors">
                        <p>
                          Create an account to receive our newsletter, course
                          recommendations and promotions.
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="mentor-img">
                        <img className="img-fluid" alt="" src={Become1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Become a instructor */}

        {/* Blog */}
        <section className="section latest-blog">
          <div className="container">
            <div className="section-header aos" data-aos="fade-up">
              <div className="section-sub-head feature-head text-center mb-0">
                <h2>Latest Blogs</h2>
                <div className="section-text aos" data-aos="fade-up">
                  <p className="mb-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Eget aenean accumsan bibendum gravida maecenas augue
                    elementum et neque. Suspendisse imperdiet.
                  </p>
                </div>
              </div>
            </div>
            <Blog />
            <div className="enroll-group aos" data-aos="fade-up">
              <div className="row ">
                <div className="col-lg-4 col-md-6">
                  <div className="total-course d-flex align-items-center">
                    <div className="blur-border">
                      <div className="enroll-img ">
                        <img src={Icon7} alt="" className="img-fluid" />
                      </div>
                    </div>
                    <div className="course-count">
                      <h3>
                        <span className="counterUp">253,085</span>
                      </h3>
                      <p>STUDENTS ENROLLED</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="total-course d-flex align-items-center">
                    <div className="blur-border">
                      <div className="enroll-img ">
                        <img src={Icon8} alt="" className="img-fluid" />
                      </div>
                    </div>
                    <div className="course-count">
                      <h3>
                        <span className="counterUp">1,205</span>
                      </h3>
                      <p>TOTAL COURSES</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="total-course d-flex align-items-center">
                    <div className="blur-border">
                      <div className="enroll-img ">
                        <img src={Icon9} alt="" className="img-fluid" />
                      </div>
                    </div>
                    <div className="course-count">
                      <h3>
                        <span className="counterUp">127</span>
                      </h3>
                      <p>COUNTRIES</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lab-course">
              <div className="section-header aos" data-aos="fade-up">
                <div className="section-sub-head feature-head text-center">
                  <h2>
                    Unlimited access to 360+ courses <br />
                    and 1,600+ hands-on labs
                  </h2>
                </div>
              </div>
              <div className="icon-group aos" data-aos="fade-up">
                <div className="offset-lg-1 col-lg-12">
                  <div className="row">
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon9} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon10} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon16} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon12} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon13} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon14} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon15} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon16} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon17} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-1 col-3">
                      <div className="total-course d-flex align-items-center">
                        <div className="blur-border">
                          <div className="enroll-img ">
                            <img src={Icon18} alt="" className="img-fluid" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Blog */}

        {/* Footer */}
        <Footer />
        {/* /Footer */}
      </div>
    </>
  );
};

export default Home;
