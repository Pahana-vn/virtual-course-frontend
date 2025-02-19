import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Filter, Grid, List, Search } from "react-feather";

import useUser from "../../hooks/useUser";
import { fetchCategories } from "../../../redux/slices/course/categorySlice";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";

import { Icon1, Icon2 } from "../../imagepath";

export const InstructorList = () => {
  console.log("Rendering InstructorList");
  const userData = useUser();
  console.log("User data:", userData);
  const [instructorCourses, setInstructorCourses] = useState([]);
  console.log("Instructor Courses:", instructorCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect - Fetching dashboard data...");
    const fetchDashboardData = async () => {
      const id = userData.id;
      try {
        const [instructorCoursesResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/instructors/${id}/courses`),
        ]);
        if (!instructorCoursesResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const instructorCoursesData = await instructorCoursesResponse.json();
        console.log("Fetched courses data:", instructorCoursesData);
        setInstructorCourses(instructorCoursesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang fetch dữ liệu
  }

  if (error) {
    return <div>Error: {error}</div>; // Hiển thị lỗi nếu fetch thất bại
  }

  const mobileSidebar = useSelector((state) => state.sidebarSlice.expandMenu);
  console.log("Mobile Sidebar:", mobileSidebar);
  // Fetch danh sách categories từ Redux store
  const categories = useSelector((state) => state.categorySlice.categories); // categories từ API
  console.log("Categories from Redux:", categories);
  const dispatch = useDispatch();
  // Gọi API khi component mount
  useEffect(() => {
    console.log("useEffect - Dispatching fetchCategories...");
    dispatch(fetchCategories());
  }, [dispatch]);

  // Chuyển đổi categories thành options
  const options = categories
    ? categories.map((category) => ({
        label: category.name,
        value: category.id,
      }))
    : [];
  console.log("Categories options:", options);
  const style = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: mobileSidebar === "disabled" ? "white" : "#131022",
      width: "100%",
      height: "40px",
      color: "black",
      minHeight: "44px",
      paddingLeft: "5px",
      // This line disable the blue border
      boxShadow: state.isFocused ? 0 : 0,
      borderRadius: state.isSelected ? "0" : "5px",
      borderColor:
        mobileSidebar === "disabled" ? "#fff" : "rgba(199, 199, 199, 0.25)",
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
        // #dddddd
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: mobileSidebar === "disabled" ? "#131022" : "#fff",
      transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
      transition: "250ms",
    }),
  };
  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"List"} />
      {/* BreadcrumItem */}
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
                    <li className="breadcrumb-item">Pages</li>
                    <li className="breadcrumb-item">Instructors List</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BreadcrumItem */}
      {/* Page Wrapper */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              {/* Filter */}
              <div className="showing-list">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="d-flex align-items-center">
                      <div className="view-icons">
                        <Link
                          to="/instructor/instructor-grid"
                          className="grid-view "
                        >
                          <Grid />
                        </Link>
                        <Link
                          to="/instructor/instructor-list"
                          className="list-view active"
                        >
                          <List />
                        </Link>
                      </div>
                      <div className="show-result">
                        <h4>Showing 1-9 of 50 results</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="show-filter add-course-info">
                      <form action="#">
                        <div className="row gx-2 align-items-center">
                          <div className="col-md-6 col-item">
                            <div className=" search-group">
                              <Search
                                size={16}
                                style={{
                                  position: "absolute",
                                  left: "7px",
                                  color: "#F66962",
                                }}
                              />
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search our courses"
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-6 col-item">
                            <div className="input-block select-form mb-0">
                              <Select
                                className=" select"
                                name="sellist1"
                                options={options}
                                defaultValue={options[0]}
                                placeholder="Select Course"
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
              {/* Filter */}

              <div className="row">
                {Array.isArray(instructorCourses) &&
                instructorCourses.length > 0 ? (
                  instructorCourses.map((course) => (
                    <div className="col-lg-4 col-md-6 d-flex" key={course.id}>
                      <div className="course-box d-flex aos" data-aos="fade-up">
                        <div className="product">
                          <div className="product-img">
                            <Link to={`/course-details/${course.id}`}>
                              <img
                                className="img-fluid"
                                alt={course.titleCourse || "Default course"}
                                src={course.imageCover || "default-image.jpg"}
                              />
                            </Link>
                            <div className="price">
                              <h3>
                                ${course.basePrice} <span>$99.00</span>
                              </h3>
                            </div>
                          </div>
                          <div className="product-content">
                            <div className="course-group d-flex">
                              <div className="course-group-img d-flex">
                                <Link to="/instructor/instructor-profile">
                                  <img
                                    src={
                                      course.instructor?.photo ||
                                      "default-avatar.jpg"
                                    }
                                    alt="Instructor"
                                    className="img-fluid"
                                  />
                                </Link>
                                <div className="course-name">
                                  <h4>
                                    <Link to="/instructor/instructor-profile">
                                      {course.instructor?.firstName ||
                                        "Unknown"}
                                    </Link>
                                  </h4>
                                  <p>Instructor</p>
                                </div>
                              </div>
                              <div className="course-share d-flex align-items-center justify-content-center">
                                <Link to="#">
                                  <i className="fa-regular fa-heart" />
                                </Link>
                              </div>
                            </div>
                            <h3 className="title instructor-text">
                              <Link to={`/course-details/${course.id}`}>
                                {course.titleCourse}
                              </Link>
                            </h3>
                            <div className="course-info d-flex align-items-center">
                              <div className="rating-img d-flex align-items-center">
                                <img src={Icon1} alt="" />
                                <p>12+ Lesson</p>
                              </div>
                              <div className="course-view d-flex align-items-center">
                                <img src={Icon2} alt="" />
                                <p>{course.duration} min</p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="rating m-0">
                                <i className="fas fa-star filled me-1" />
                                <i className="fas fa-star filled me-1" />
                                <i className="fas fa-star filled me-1" />
                                <i className="fas fa-star filled me-1" />
                                <i className="fas fa-star" />
                                <span className="d-inline-block average-rating">
                                  <span>4.0</span> (15)
                                </span>
                              </div>
                              <div className="all-btn all-category d-flex align-items-center">
                                <Link
                                  to="/checkout"
                                  className="btn btn-primary"
                                >
                                  BUY NOW
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No courses available.</p>
                )}
              </div>

              {/* Pagination */}
              <div className="row">
                <div className="col-md-12">
                  <ul className="pagination lms-page lms-pagination">
                    <li className="page-item prev">
                      <Link className="page-link" to="#">
                        <i className="fas fa-angle-left"></i>
                      </Link>
                    </li>
                    <li className="page-item first-page active">
                      <Link className="page-link" to="#">
                        1
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        2
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        3
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        4
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        5
                      </Link>
                    </li>
                    <li className="page-item next">
                      <Link className="page-link" to="#">
                        <i className="fas fa-angle-right"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Pagination */}
            </div>

            <div className="col-lg-3">
              <div className="filter-clear">
                <div className="clear-filter d-flex align-items-center">
                  <h4>
                    <Filter size={18} />
                    Filters
                  </h4>
                  <div className="clear-text">
                    <p>CLEAR</p>
                  </div>
                </div>

                {/* Search Filter */}
                <div className="card search-filter">
                  <div className="card-body">
                    <div className="filter-widget mb-0">
                      <div className="categories-head d-flex align-items-center">
                        <h4>Course categories</h4>
                        <i className="fas fa-angle-down"></i>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Backend (3)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> CSS (2)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Frontend (2)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> General (2)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> IT & Software (2)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Photography (2)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Programming
                          Language (3)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check mb-0">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Technology (2)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Search Filter */}

                {/* Search Filter */}
                <div className="card search-filter">
                  <div className="card-body">
                    <div className="filter-widget mb-0">
                      <div className="categories-head d-flex align-items-center">
                        <h4>Instructors</h4>
                        <i className="fas fa-angle-down"></i>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Keny White (10)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Hinata Hyuga (5)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> John Doe (3)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check mb-0">
                          <input type="checkbox" name="select_specialist" />
                          <span className="checkmark"></span> Nicole Brown
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Search Filter */}

                {/* Search Filter */}
                <div className="card search-filter ">
                  <div className="card-body">
                    <div className="filter-widget mb-0">
                      <div className="categories-head d-flex align-items-center">
                        <h4>Price</h4>
                        <i className="fas fa-angle-down"></i>
                      </div>
                      <div>
                        <label className="custom_check custom_one">
                          <input type="radio" name="select_specialist" />
                          <span className="checkmark"></span> All (18)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check custom_one">
                          <input type="radio" name="select_specialist" />
                          <span className="checkmark"></span> Free (3)
                        </label>
                      </div>
                      <div>
                        <label className="custom_check custom_one mb-0">
                          <input type="radio" name="select_specialist" />
                          <span className="checkmark"></span> Paid (15)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Search Filter */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Wrapper */}
      <Footer />
    </div>
  );
};
