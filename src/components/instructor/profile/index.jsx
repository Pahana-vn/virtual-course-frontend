import React from "react";
import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentInstructor,
} from "../../../redux/slices/auth/authSlice";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import {
  AddressIcon,
  CoursesIcon,
  EmailIcon,
  Icon1,
  Icon2,
  PhoneIcon,
  ReviewIcon,
  TtlStudIcon,
  User1,
} from "../../imagepath";
import { Link } from "react-router-dom";
import {
  useInstructorAvatarQuery,
  useInstructorDetailsQuery,
} from "../../../redux/slices/instructor/instructorApiSlice";
import { useGetInstructorCoursesQuery } from "../../../redux/slices/course/courseApiSlice";

export default function InstructorProfile() {
  const id = useSelector(selectCurrentInstructor);
  const user = useSelector(selectCurrentUser);
  const accountId = useSelector((state) => state.auth.user.accountId);
  const { data } = useInstructorAvatarQuery({ accountId });
  const avatarUrl = data?.url || "default-avatar.png";
  const {
    data: instructor,
    isLoading,
    isError,
  } = useInstructorDetailsQuery({ id: id });

  const { data: courses } = useGetInstructorCoursesQuery({ instructorId:id,
    status: "PUBLISHED",
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading instructor details.</p>;

  const sanitizedInstructorBio = DOMPurify.sanitize(instructor.bio);
  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Profile"} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Courses
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      All Courses
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      The Complete Web Developer Course 2.0
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb */}
      {/* Breadcrumb */}
      <div className="page-banner instructor-bg-blk">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="profile-info-blk">
                <Link to="#" className="profile-info-img">
                  <img
                    src={avatarUrl || "https://via.placeholder.com/150"}
                    alt=""
                    className="img-fluid"
                  />
                </Link>
                <h4>
                  <Link to="#">
                    {`${instructor.firstName} ${instructor.lastName}` ||
                      "Instructor Name"}
                  </Link>
                  <span>{instructor.title}</span>
                </h4>
                <p>Instructor</p>
                <ul className="list-unstyled inline-inline profile-info-social">
                  {/* Facebook */}
                  {instructor.social.facebookUrl && (
                    <li className="list-inline-item">
                      <Link to={instructor.social.facebookUrl} target="_blank">
                        <i className="fa-brands fa-facebook"></i>
                      </Link>
                    </li>
                  )}

                  {/* Google */}
                  {instructor.social.googleUrl && (
                    <li className="list-inline-item">
                      <Link to={instructor.social.googleUrl} target="_blank">
                        <i className="fa-brands fa-google"></i>
                      </Link>
                    </li>
                  )}

                  {/* Instagram */}
                  {instructor.social.instagramUrl && (
                    <li className="list-inline-item">
                      <Link to={instructor.social.instagramUrl} target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                  )}

                  {/* LinkedIn */}
                  {instructor.social.linkedinUrl && (
                    <li className="list-inline-item">
                      <Link to={instructor.social.linkedinUrl} target="_blank">
                        <i className="fa-brands fa-linkedin"></i>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb */}
      {/* Course Content */}
      <section className="page-content course-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Overview */}
              <div className="card overview-sec">
                <div className="card-body">
                  <h5 className="subs-title">About Me</h5>
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedInstructorBio }}
                  ></div>
                </div>
              </div>
              {/* Overview */}

              {/* Education Content */}
              <div className="card education-sec">
                <div className="card-body">
                  <h5 className="subs-title">Education</h5>
                  {instructor.education && instructor.education.length > 0 ? (
                    instructor.education.map((edu, index) => (
                      <div className="edu-wrap" key={index}>
                        <div className="edu-name">
                          <span>{edu.degree[0]}</span>
                        </div>
                        <div className="edu-detail">
                          <h6>{edu.degree}</h6>
                          <p className="edu-duration">
                            {edu.university} {(edu.startYear || edu.endYear) && (
                              <>
                                ({edu.startYear || "Past"} → {edu.endYear || "Present"})
                              </>
                            )}
                          </p>
                          <p>{edu.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No education information available.</p>
                  )}
                </div>
              </div>
              {/* Education Content */}

              {/* Experience Content */}
              <div className="card education-sec">
                <div className="card-body">
                  <h5 className="subs-title">Experience</h5>
                  {instructor.experiences &&
                  instructor.experiences.length > 0 ? (
                    instructor.experiences.map((exp, index) => (
                      <div className="edu-wrap" key={index}>
                        <div className="edu-name">
                          <span>{exp.position[0]}</span>
                        </div>
                        <div className="edu-detail">
                          <h6>{exp.position}</h6>
                          <p className="edu-duration">
                            {exp.company} ({exp.startYear || "Past"} -&gt;{" "}
                            {exp.endYear || "Present"})
                          </p>
                          <p>{exp.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No experience information available.</p>
                  )}
                </div>
              </div>
              {/* Experience Content */}

              {/* Courses Content */}
              <div className="card education-sec">
                <div className="card-body pb-0">
                  <h5 className="subs-title">Courses</h5>
                  <div className="row">
                    {courses && courses.length > 0 ? (
                      courses.map((course, index) => (
                        <div className="col-lg-6 col-md-6 d-flex" key={index}>
                          <div className="course-box course-design d-flex">
                            <div className="product">
                              <div className="product-img">
                                <Link
                                  to={`/course/${course.id}/course-details`}
                                >
                                  <img
                                    className="img-fluid"
                                    alt=""
                                    src={course.imageCover}
                                  />
                                </Link>
                                <div className="price">
                                  <h3>
                                    ${course.basePrice - 10}{" "}
                                    <span>
                                      {course.basePrice &&
                                        `$${course.basePrice}`}
                                    </span>
                                  </h3>
                                </div>
                              </div>
                              <div className="product-content">
                                <div className="course-group d-flex">
                                  <div className="course-group-img d-flex">
                                    <Link
                                      to={`/course/${course.id}/course-details`}
                                    >
                                      <img
                                        src={
                                          course.instructorPhoto ||
                                          "https://via.placeholder.com/150"
                                        }
                                        alt=""
                                        className="img-fluid"
                                      />
                                    </Link>
                                    <div className="course-name">
                                      <h4>
                                        <Link
                                          to={`/course/${course.id}/course-details`}
                                        >
                                          {course.instructorFirstName}{" "}
                                          {course.instructorLastName}
                                        </Link>
                                      </h4>
                                      <p>Instructor</p>
                                    </div>
                                  </div>
                                </div>
                                <h3 className="title instructor-text">
                                  <Link
                                    to={`/course/${course.id}/course-details`}
                                  >
                                    {course.titleCourse}
                                  </Link>
                                </h3>
                                <div className="course-info d-flex align-items-center border-0 m-0">
                                  <div className="rating-img d-flex align-items-center">
                                    <img src={Icon1} alt="" />
                                    <p>{course.lessons} Lessons</p>
                                  </div>
                                  <div className="course-view d-flex align-items-center">
                                    <img src={Icon2} alt="" />
                                    <p>{course.duration}</p>
                                  </div>
                                </div>
                                <div className="rating">
                                  <i className="fas fa-star filled"></i>
                                  <i className="fas fa-star filled"></i>
                                  <i className="fas fa-star filled"></i>
                                  <i className="fas fa-star filled"></i>
                                  <i className="fas fa-star"></i>
                                  <span className="d-inline-block average-rating">
                                    <span>{course.rating}</span> (
                                    {course.reviews} reviews)
                                  </span>
                                </div>
                                <div className="all-btn all-category d-flex align-items-center">
                                  <Link
                                    to={`/checkout/${course.id}`}
                                    className="btn btn-primary"
                                  >
                                    BUY NOW
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No courses available</p>
                    )}
                  </div>
                </div>
              </div>
              {/*Courses Content  */}

              {/* Reviews */}
              <div className="card review-sec">
                <div className="card-body">
                  <h5 className="subs-title">Reviews</h5>
                  <div className="review-item">
                    <div className="instructor-wrap border-0 m-0">
                      <div className="about-instructor">
                        <div className="abt-instructor-img">
                          <Link to="instructor-profile">
                            <img src={User1} alt="img" className="img-fluid" />
                          </Link>
                        </div>
                        <div className="instructor-detail">
                          <h5>
                            <Link to="instructor-profile">Nicole Brown</Link>
                          </h5>
                          <p>UX/UI Designer</p>
                        </div>
                      </div>
                      <div className="rating">
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <p className="rev-info">
                      “ This is the second Photoshop course I have completed
                      with Cristian. Worth every penny and recommend it highly.
                      To get the most out of this course, its best to to take
                      the Beginner to Advanced course first. The sound and video
                      quality is of a good standard. Thank you Cristian. “
                    </p>
                    <Link to="#" className="btn btn-reply">
                      <i className="feather-corner-up-left"></i> Reply
                    </Link>
                  </div>
                  <div className="review-item">
                    <div className="instructor-wrap border-0 m-0">
                      <div className="about-instructor">
                        <div className="abt-instructor-img">
                          <Link to="instructor-profile">
                            <img src={User1} alt="img" className="img-fluid" />
                          </Link>
                        </div>
                        <div className="instructor-detail">
                          <h5>
                            <Link to="instructor-profile">Nicole Brown</Link>
                          </h5>
                          <p>UX/UI Designer</p>
                        </div>
                      </div>
                      <div className="rating">
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <p className="rev-info">
                      “ This is the second Photoshop course I have completed
                      with Cristian. Worth every penny and recommend it highly.
                      To get the most out of this course, its best to to take
                      the Beginner to Advanced course first. The sound and video
                      quality is of a good standard. Thank you Cristian. “
                    </p>
                    <Link to="#" className="btn btn-reply">
                      <i className="feather-corner-up-left"></i> Reply
                    </Link>
                  </div>
                  <div className="review-item">
                    <div className="instructor-wrap border-0 m-0">
                      <div className="about-instructor">
                        <div className="abt-instructor-img">
                          <Link to="instructor-profile">
                            <img src={User1} alt="img" className="img-fluid" />
                          </Link>
                        </div>
                        <div className="instructor-detail">
                          <h5>
                            <Link to="instructor-profile">Nicole Brown</Link>
                          </h5>
                          <p>UX/UI Designer</p>
                        </div>
                      </div>
                      <div className="rating">
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <p className="rev-info">
                      “ This is the second Photoshop course I have completed
                      with Cristian. Worth every penny and recommend it highly.
                      To get the most out of this course, its best to to take
                      the Beginner to Advanced course first. The sound and video
                      quality is of a good standard. Thank you Cristian. “
                    </p>
                    <Link to="#" className="btn btn-reply">
                      <i className="feather-corner-up-left"></i> Reply
                    </Link>
                  </div>
                </div>
              </div>
              {/* Reviews */}

              {/* Comment */}
              <div className="card comment-sec">
                <div className="card-body">
                  <h5 className="subs-title">Add a review</h5>
                  <form>
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
                        rows="4"
                        className="form-control"
                        placeholder="Your Comments"
                      ></textarea>
                    </div>
                    <div className="submit-section">
                      <button className="btn submit-btn" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* comment */}
            </div>

            <div className="col-lg-4">
              {/* Right Sidebar Tags Label */}
              <div className="card overview-sec">
                <div className="card-body overview-sec-body">
                  <h5 className="subs-title">Professional Skills</h5>
                  <div className="sidebar-tag-labels">
                    <ul className="list-unstyled">
                      {instructor.skills && instructor.skills.length > 0 ? (
                        instructor.skills.map((skill) => (
                          <li key={skill.id}>
                            <Link to="#">{skill.skillName}</Link>
                          </li>
                        ))
                      ) : (
                        <li>No skills available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Right Sidebar Tags Label */}

              {/* Right Sidebar Profile Overview */}
              <div className="card overview-sec">
                <div className="card-body">
                  <h5 className="subs-title">Profile Overview</h5>

                  {/* Đánh giá trung bình */}
                  <div className="rating-grp">
                    <div className="rating">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fas fa-star ${
                            index < Math.round(instructor.averageRating)
                              ? "filled"
                              : ""
                          }`}
                        ></i>
                      ))}
                      <span className="d-inline-block average-rating">
                        <span>{instructor.averageRating.toFixed(1)}</span> (0)
                      </span>
                    </div>
                    <div className="course-share d-flex align-items-center justify-content-center">
                      <Link to="#rate">
                        <i className="fa-regular fa-heart"></i>
                      </Link>
                    </div>
                  </div>

                  {/* Thống kê hồ sơ */}
                  <div className="profile-overview-list">
                    <div className="list-grp-blk d-flex">
                      <div className="flex-shrink-0">
                        <img src={CoursesIcon} alt="Courses" />
                      </div>
                      <div className="list-content-blk flex-grow-1 ms-3">
                        <h5>{instructor.totalCourses}</h5>
                        <p>Courses</p>
                      </div>
                    </div>

                    <div className="list-grp-blk d-flex">
                      <div className="flex-shrink-0">
                        <img src={TtlStudIcon} alt="Total Students" />
                      </div>
                      <div className="list-content-blk flex-grow-1 ms-3">
                        <h5>{instructor.totalStudents}</h5>
                        <p>Total Students</p>
                      </div>
                    </div>

                    <div className="list-grp-blk d-flex">
                      <div className="flex-shrink-0">
                        <img src={ReviewIcon} alt="Reviews" />
                      </div>
                      <div className="list-content-blk flex-grow-1 ms-3">
                        <h5>12,230</h5>
                        <p>Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Sidebar Profile Overview */}

              {/* Right Contact Details */}
              <div className="card overview-sec">
                <div className="card-body">
                  <h5 className="subs-title">Contact Details</h5>
                  <div className="contact-info-list">
                    <div className="edu-wrap">
                      <div className="edu-name">
                        <span>
                          <img src={EmailIcon} alt="Address" />
                        </span>
                      </div>
                      <div className="edu-detail">
                        <h6>Email</h6>
                        <p>
                          <Link to="#">{user.email}</Link>
                        </p>
                      </div>
                    </div>
                    <div className="edu-wrap">
                      <div className="edu-name">
                        <span>
                          <img src={AddressIcon} alt="Address" />
                        </span>
                      </div>
                      <div className="edu-detail">
                        <h6>Address</h6>
                        <p>{instructor.address}</p>
                      </div>
                    </div>
                    <div className="edu-wrap">
                      <div className="edu-name">
                        <span>
                          <img src={PhoneIcon} alt="Address" />
                        </span>
                      </div>
                      <div className="edu-detail">
                        <h6>Phone</h6>
                        <p>
                          {" "}
                          <Link to="#">{instructor.phone}</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Contact Details */}
            </div>
          </div>
        </div>
      </section>
      {/* Course Content */}
      <Footer />
    </div>
  );
}
