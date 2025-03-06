import FeatherIcon from "feather-icons-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import Footer from "../../../footer";
import GridInnerPage from "./gridInnerPage";
import { useGetFilteredCoursesQuery } from "../../../../redux/slices/course/courseApiSlice";
import { useGetCategoriesQuery } from "../../../../redux/slices/course/categoryApiSlice";
import { useGetAllInstructorsQuery } from "../../../../redux/slices/instructor/instructorApiSlice";
import RoleBasedHeader from "../../../header/RoleBasedHeader";

const option = [
  { label: "Newly published", value: "Newly published" },
  { label: "Featured", value: "Featured" },
  { label: "Trending", value: "Trending" },
  { label: "Hot Category", value: "Hot Category" },
];

const priceOptions = [
  { label: "All", min: 0, max: 10000000 },
  { label: "Free", min: 0, max: 0 },
  { label: "< 500,000 đ", min: 0, max: 500000 },
  { label: "< 1,000,000 đ", min: 0, max: 1000000 },
  { label: "< 2,000,000 đ", min: 0, max: 2000000 },
];

const CourseGrid = () => {
  const mobileSidebar = useSelector((state) => state.sidebarSlice.expandMenu);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [input, setInput] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedPrice, setSelectedPrice] = useState(priceOptions[0]);
  const [page, setPage] = useState(0);
  const size = 6;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const queryParams = {
    categoryId:
      selectedCategories.length > 0 ? selectedCategories.join(",") : null,
    instructorId:
      selectedInstructors.length > 0 ? selectedInstructors.join(",") : null,
    page,
    size,
    search: debouncedSearchTerm || null,
  };

  if (selectedPrice.label === "Free") {
    queryParams.minPrice = 0;
    queryParams.maxPrice = 1;
  } else if (selectedPrice.label !== "All") {
    queryParams.minPrice = priceRange[0];
    queryParams.maxPrice = priceRange[1];
  }
  // Fetch danh sách khóa học và danh mục
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useGetFilteredCoursesQuery(queryParams);
  const courses = coursesData?.content || [];
  const totalPages = coursesData?.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useGetCategoriesQuery();

  const sortedCategories = categories && Array.isArray(categories)
  ? [...categories].sort((a, b) => b.totalCourses - a.totalCourses)
  : [];

  const filteredCategories = sortedCategories.filter((category) => category.totalCourses > 0);

  const {
    data: instructors,
    isLoading: isLoadingInstructors,
    isError: isErrorInstructors,
  } = useGetAllInstructorsQuery();

  const sortedInstructors = instructors && Array.isArray(instructors)
  ? [...instructors].sort((a, b) => b.totalCourses - a.totalCourses)
  : [];

  const filteredInstructors = sortedInstructors.filter((instructor) => instructor.totalCourses > 0);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Xử lý khi chọn/bỏ chọn giảng viên
  const handleInstructorChange = (instructorId) => {
    setSelectedInstructors((prev) =>
      prev.includes(instructorId)
        ? prev.filter((id) => id !== instructorId)
        : [...prev, instructorId]
    );
  };

  // Xử lý thay đổi giá tối đa/tối thiểu
  const handlePriceChange = (option) => {
    setSelectedPrice(option);
    if (option.label === "All") {
      setPriceRange([undefined, undefined]); // Khi chọn All, không gửi minPrice & maxPrice
    } else if (option.label === "Free") {
      setPriceRange([0, 0]); // Chọn Free thì minPrice = 0, maxPrice = 0
    } else {
      setPriceRange([option.min, option.max]);
    }
  };

  if (isLoadingCourses || isLoadingCategories || isLoadingInstructors) {
    return <div>Loading...</div>;
  }

  if (isErrorCourses || isErrorCategories || isErrorInstructors) {
    return <div>Error loading data!</div>;
  }

  const customStyles = {
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
    dropdownIndicator: (base, state) => ({
      ...base,
      transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
      transition: "300ms",
    }),
  };

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
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        All Courses
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="course-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                {/* Filter */}
                <div className="showing-list">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="d-flex align-items-center">
                        <div className="view-icons">
                          <Link to="/course-grid" className="grid-view active">
                            {/* <i className="feather-grid" /> */}
                            <FeatherIcon icon="grid" />
                          </Link>
                          <Link to="/course-list" className="list-view">
                            {/* <i className="feather-list" /> */}
                            <FeatherIcon icon="list" />
                          </Link>
                        </div>
                        <div className="show-result">
                          <h4>
                            {coursesData?.totalElements > 0
                              ? `Showing ${page * size + 1} - ${Math.min(
                                  (page + 1) * size,
                                  coursesData.totalElements
                                )} of ${coursesData.totalElements} results`
                              : "No results found"}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="show-filter add-course-info">
                        <form action="#">
                          <div className="row gx-2 align-items-center">
                            <div className="col-md-6 col-item">
                              <div className=" search-group">
                                <i className="feather-search">
                                  <FeatherIcon icon="search" />
                                </i>
                                <input
                                  type="text"
                                  className="form-control mx-2"
                                  placeholder="Search our courses"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-item">
                              <div className="input-block select-form mb-0">
                                <Select
                                  options={option}
                                  defaultValue={input}
                                  onChange={setInput}
                                  placeholder="Newly Published"
                                  styles={customStyles}
                                ></Select>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Filter */}

                <GridInnerPage courses={courses} />

                {/* /pagination */}
                <div className="row">
                  <div className="col-md-12">
                    <ul className="pagination lms-page">
                      <li
                        className={`page-item ${page === 0 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page - 1)}
                        >
                          <FeatherIcon icon="chevron-left" />
                        </button>
                      </li>

                      {[...Array(totalPages).keys()].map((pageIndex) => (
                        <li
                          key={pageIndex}
                          className={`page-item ${
                            pageIndex === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageIndex)}
                          >
                            {pageIndex + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          page === totalPages - 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          <FeatherIcon icon="chevron-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /pagination */}
              </div>
              <div className="col-lg-3 theiaStickySidebar">
                <div className="stickysidebar">
                  <div className="filter-clear">
                    <div className="clear-filter d-flex align-items-center">
                      <h4>
                        {/* <i className="feather-filter" /> */}
                        <FeatherIcon icon="filter" />
                        Filters
                      </h4>
                      <div className="clear-text">
                        <p
                          onClick={() => {
                            setSelectedCategories([]);
                            setSelectedInstructors([]);
                            setSelectedPrice(priceOptions[0]); // Reset giá về "All"
                            setPriceRange([
                              priceOptions[0].min,
                              priceOptions[0].max,
                            ]);
                          }}
                        >
                          CLEAR
                        </p>
                      </div>
                    </div>
                    {/* Search Filter */}
                    <div className="card search-filter">
                      <div className="card-body">
                        <div className="filter-widget mb-0">
                          <div className="categories-head d-flex align-items-center">
                            <h4>Course categories</h4>
                            <i className="fas fa-angle-down" />
                          </div>
                          {filteredCategories &&
                            filteredCategories.map((category) => (
                              <div key={category.id}>
                                <label className="custom_check">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                      category.id
                                    )}
                                    onChange={() =>
                                      handleCategoryChange(category.id)
                                    }
                                  />
                                  <span className="checkmark" /> {category.name}{" "}
                                  ({category.totalCourses || 0})
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    {/* /Search Filter */}
                    {/* Search Filter */}
                    <div className="card search-filter">
                      <div className="card-body">
                        <div className="filter-widget mb-0">
                          <div className="categories-head d-flex align-items-center">
                            <h4>Instructors</h4>
                            <i className="fas fa-angle-down" />
                          </div>
                          {filteredInstructors &&
                            filteredInstructors.map((instructor) => (
                              <div key={instructor.id}>
                                <label className="custom_check">
                                  <input
                                    type="checkbox"
                                    checked={selectedInstructors.includes(
                                      instructor.id
                                    )}
                                    onChange={() =>
                                      handleInstructorChange(instructor.id)
                                    }
                                  />
                                  <span className="checkmark" />{" "}
                                  {instructor.firstName} {instructor.lastName} (
                                  {instructor.totalCourses || 0})
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    {/* /Search Filter */}
                    {/* Search Filter */}
                    <div className="card search-filter ">
                      <div className="card-body">
                        <div className="filter-widget mb-0">
                          <div className="categories-head d-flex align-items-center">
                            <h4>Price</h4>
                            <i className="fas fa-angle-down" />
                          </div>
                          {priceOptions.map((option, index) => (
                            <div key={index}>
                              <label className="custom_check custom_one">
                                <input
                                  type="radio"
                                  name="select_price"
                                  checked={selectedPrice.label === option.label}
                                  onChange={() => handlePriceChange(option)}
                                />
                                <span className="checkmark" /> {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* /Search Filter */}
                    {/* Latest Posts */}
                    {/* <div className="card post-widget ">
                      <div className="card-body">
                        <div className="latest-head">
                          <h4 className="card-title">Latest Courses</h4>
                        </div>
                        <ul className="latest-posts">
                          <li>
                            <div className="post-thumb">
                              <Link to="/course-details">
                                <img className="img-fluid" src={Blog1} alt="" />
                              </Link>
                            </div>
                            <div className="post-info free-color">
                              <h4>
                                <Link to="/course-details">
                                  Introduction LearnPress – LMS plugin
                                </Link>
                              </h4>
                              <p>FREE</p>
                            </div>
                          </li>
                          <li>
                            <div className="post-thumb">
                              <Link to="/course-details">
                                <img className="img-fluid" src={Blog2} alt="" />
                              </Link>
                            </div>
                            <div className="post-info">
                              <h4>
                                <Link to="/course-details">
                                  Become a PHP Master and Make Money
                                </Link>
                              </h4>
                              <p>$200</p>
                            </div>
                          </li>
                          <li>
                            <div className="post-thumb">
                              <Link to="/course-details">
                                <img className="img-fluid" src={Blog3} alt="" />
                              </Link>
                            </div>
                            <div className="post-info free-color">
                              <h4>
                                <Link to="/course-details">
                                  Learning jQuery Mobile for Beginners
                                </Link>
                              </h4>
                              <p>FREE</p>
                            </div>
                          </li>
                          <li>
                            <div className="post-thumb">
                              <Link to="/course-details">
                                <img className="img-fluid" src={Blog1} alt="" />
                              </Link>
                            </div>
                            <div className="post-info">
                              <h4>
                                <Link to="/course-details">
                                  Improve Your CSS Workflow with SASS
                                </Link>
                              </h4>
                              <p>$200</p>
                            </div>
                          </li>
                          <li>
                            <div className="post-thumb ">
                              <Link to="/course-details">
                                <img className="img-fluid" src={Blog2} alt="" />
                              </Link>
                            </div>
                            <div className="post-info free-color">
                              <h4>
                                <Link to="/course-details">
                                  HTML5/CSS3 Essentials in 4-Hours
                                </Link>
                              </h4>
                              <p>FREE</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                    {/* /Latest Posts */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CourseGrid;
