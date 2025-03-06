import React from "react";
import { Link, useParams } from "react-router-dom";
import DetailsContent from "./detailsContent";
import { Icon1, People, Timer } from "../../../imagepath";
import Footer from "../../../footer";
import { useGetCourseDetailsByIdQuery } from "../../../../redux/slices/course/courseApiSlice";
import RoleBasedHeader from "../../../header/RoleBasedHeader";
import useDurationFormatter from "../../../../hooks/useDurationFormatter";
const CourseDetails = () => {
  const { courseId } = useParams();
  const courseIdNumber = Number(courseId);
  const formatDuration = useDurationFormatter();
  
  const { data: courseDetails, isLoading, isError } = useGetCourseDetailsByIdQuery({ id: courseIdNumber });
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading course details.</p>;
  return (
    <>
      <div className="main-wrapper">
      <RoleBasedHeader />

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
                        <Link to="/course-grid">All Courses</Link>
                      </li>
                      <li className="breadcrumb-item" aria-current="page">
                        {courseDetails.titleCourse}
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="inner-banner"
          style={{
            backgroundImage: `url(${courseDetails.imageCover})`, // URL ảnh banner
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="instructor-wrap border-bottom-0 m-0">
                  <div className="about-instructor align-items-center">
                    <div className="abt-instructor-img">
                      <Link to={`/instructor/${courseDetails.instructorId}/instructor-profile`}>
                        <img
                          src={courseDetails.instructorPhoto}
                          alt="img"
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="instructor-detail me-3">
                      <h5>
                        <Link to={`/instructor/${courseDetails.instructorId}/instructor-profile`}>
                          {`${courseDetails.instructorFirstName} ${courseDetails.instructorLastName}`}</Link>
                      </h5>
                      <p>{courseDetails.instructorTitle}</p>
                    </div>
                    <div className="rating mb-0">
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star filled me-1" />
                      <i className="fas fa-star me-1" />
                      <span className="d-inline-block average-rating">
                        <span>4.5</span> (15)
                      </span>
                    </div>
                  </div>
                  <span className="web-badge mb-3">{courseDetails.categoryName}</span>
                </div>
                <h2>{courseDetails.titleCourse}</h2>
                <p>
                {courseDetails.hashtag}
                </p>
                <div className="course-info d-flex align-items-center border-bottom-0 m-0 p-0">
                  <div className="cou-info">
                    <img src={Icon1} alt="" />
                    <p>{courseDetails.totalLectures}+ Lesson</p>
                  </div>
                  <div className="cou-info">
                    <img src={Timer} alt="" />
                    <p>{formatDuration(courseDetails.duration)}</p>
                  </div>
                  <div className="cou-info">
                    <img src={People} alt="" />
                    <p>{courseDetails.totalPurchasedStudents} students enrolled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DetailsContent courseDetails={courseDetails} />

        <Footer/>

      </div>
    </>
  );
};

export default CourseDetails;
