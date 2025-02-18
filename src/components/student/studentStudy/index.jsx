// components/student/StudentStudy.js

import React, { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchStudentCourses } from "../../../services/studentService";
import Footer from "../../footer";
import { Course10 } from "../../imagepath";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentStudy = () => {
  const mobileSidebar = useSelector((state) => state.sidebarSlice.expandMenu);
  const [courses, setCourses] = useState({
    active: [],
    completed: [],
    enrolled: [],
  });
  const [setValue] = useState(null);

  const options = [
    { label: "Newly Published", value: "new" },
    { label: "Angular", value: "1" },
    { label: "React", value: "2" },
    { label: "Node", value: "3" },
  ];

  const studentId = localStorage.getItem("studentId");

  const style = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: mobileSidebar === "disabled" ? "white" : "#131022",
      width: "100%",
      height: "40px",
      color: "black",
      minHeight: "40px",
      border: "1px solid #e9ecef",
      paddingLeft: "5px",
      boxShadow: state.isFocused ? 0 : 0,
      borderRadius: state.isSelected ? "0" : "10px",
      fontSize: "14px",
      "&:hover": {
        cursor: "pointer",
      },
      outline: "none",
    }),
    menu: (base) => ({ ...base, marginTop: "0px" }),
    menuList: (base) => ({ ...base, padding: "0" }),
    option: (provided) => ({
      ...provided,
      backgroundColor: mobileSidebar === "disabled" ? "#fff" : "#000",
      color: mobileSidebar === "disabled" ? "#000" : "#fff",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: mobileSidebar === "disabled" ? "#FFDEDA" : "#2b2838",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "black",
      transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
      transition: "250ms",
    }),
  };

  useEffect(() => {
    const fetchCoursesForStudent = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (studentId) {
          const response = await fetchStudentCourses(studentId);
          setCourses({
            active: response.active || [],
            completed: response.completed || [],
            enrolled: response.enrolled || [],
          });
        }
      } catch (error) {
        console.error("Error fetching student courses:", error);
      }
    };

    fetchCoursesForStudent();
  }, []);

  const renderCourses = (coursesList) => {
    return coursesList.map((course) => (
      <div key={course.id} className="col-xl-4 col-lg-4 col-md-6 d-flex">
        <div className="course-box course-design d-flex">
          <div className="product">
            <div className="product-img">
              <Link to={`/course-details/${course.id}`}>
                <img
                  className="img-fluid"
                  alt={course.titleCourse}
                  src={course.imageCover || Course10}
                />
              </Link>
            </div>
            <div className="product-content">
              <h3
                className="title"
                style={{
                  fontSize: "20px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={course.titleCourse} // Hiển thị đầy đủ khi hover
              >
                <Link
                  to={`/course-details/${course.id}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  {course.titleCourse}
                </Link>
              </h3>
              <div className="rating-student">
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fas fa-star ${index < course.rating ? "filled" : ""
                        }`}
                    ></i>
                  ))}
                  <span className="d-inline-block average-rating">
                    <span>{course.rating}</span>
                  </span>
                </div>
                <div className="edit-rate">
                  <Link to="#">Deadline</Link>
                </div>
              </div>
              <div className="progress-stip">
                <div
                  className="progress-bar bg-success progress-bar-striped active-stip"
                  role="progressbar"
                  style={{ width: `${course.progress || 0}%` }}
                  aria-valuenow={course.progress || 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="student-percent">
                <p>{course.progress || 0}% Completed</p>
              </div>

              <div className="start-leason hoverBlue d-flex align-items-center">
                <Link to={`/course-lesson/${course.id}?studentId=${studentId}`} className="btn btn-primary">
                  Start Lesson
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Studys"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Studys</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Studys
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <StudentSidebar />
            <div className="col-xl-9 col-lg-9">
              <div className="container">
                <div className="student-widget">
                  <div className="student-widget-group">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="showing-list">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="show-filter choose-search-blk">
                                <form action="#">
                                  <div className="mycourse-student align-items-center">
                                    <div className="student-search">
                                      <div className="search-group">
                                        <Search className="searchFeather" size={16} />
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search our courses"
                                        />
                                      </div>
                                    </div>
                                    <div className="student-filter">
                                      <div className="input-block select-form mb-0">
                                        <Select
                                          className="select country-select"
                                          name="sellist1"
                                          options={options}
                                          defaultValue={options[0]}
                                          placeholder="Choose"
                                          onChange={setValue}
                                          styles={style}
                                        ></Select>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enrolled Courses */}
                        <div className="row">
                          <h3>Studying</h3>
                          {renderCourses(courses.enrolled)}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dash-pagination">
                <div className="row align-items-center">
                  <div className="col-6">
                    <p>Page 1 of 2</p>
                  </div>
                  <div className="col-6">
                    <ul className="pagination">
                      <li className="active">
                        <Link to="#">1</Link>
                      </li>
                      <li>
                        <Link to="#">2</Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="bx bx-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentStudy;
