import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../footer";
import {
  Course10,
  Course11,
  Course12,
  Icon1,
  Icon2,
  User1,
  User2,
  User3
} from "../../imagepath";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentOrderHistory = () => {
  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Orders"} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Order History</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Order History
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}
      {/* Page Content */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* /Sidebar */}
            {/* Student Order History */}
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Order History</h3>
                  </div>
                  <div className="checkout-form">
                    {/* Order Tabs */}
                    <div className="wishlist-tab order-tab">
                      <ul className="nav">
                        <li className="nav-item">
                          <Link
                            to="#"
                            className="active"
                            data-bs-toggle="tab"
                            data-bs-target="#today"
                          >
                            Today
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#month"
                          >
                            Monthly
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#year"
                          >
                            Yearly
                          </Link>
                        </li>
                      </ul>
                    </div>
                    {/* /Order Tabs */}

                    {/* Tab Content */}
                    <div className="tab-content">
                      {/* Today */}
                      <div className="tab-pane show active" id="today">
                        <div className="table-responsive custom-table">

                          <div className="col-lg-12 col-md-12 d-flex">
                            <div className="course-box course-design list-course d-flex ">
                              <div className="product">
                                <div className="product-img">
                                  <Link to="/course-details">
                                    <img
                                      className="img-fluid"
                                      alt=""
                                      src={Course11}
                                    />
                                  </Link>
                                  <div className="price">
                                    <h3>
                                      $300 <span>$99.00</span>
                                    </h3>
                                  </div>
                                </div>
                                <div className="product-content">
                                  <div className="head-course-title">
                                    <h3 className="title">
                                      <Link to="/course-details">
                                        Wordpress for Beginners - Master Wordpress{" "}
                                        <br /> Quickly
                                      </Link>
                                    </h3>
                                    <div className="all-btn all-category d-flex align-items-center">
                                      <Link
                                        to="/view-invoice"
                                        className="btn btn-primary"
                                      >
                                        Invoice
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="course-info d-flex align-items-center border-bottom-0 pb-0">
                                    <div className="rating-img d-flex align-items-center">
                                      <img src={Icon1} alt="" />
                                      <p>10+ Lesson</p>
                                    </div>
                                    <div className="course-view d-flex align-items-center">
                                      <img src={Icon2} alt="" />
                                      <p>7hr 20min</p>
                                    </div>
                                  </div>
                                  <div className="rating">
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star"></i>
                                    <span className="d-inline-block average-rating">
                                      <span>4.2</span> (15)
                                    </span>
                                  </div>
                                  <div className="course-group d-flex mb-0">
                                    <div className="course-group-img d-flex">
                                      <Link to="/student/students-profile">
                                        <img
                                          src={User2}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </Link>
                                      <div className="course-name">
                                        <h4>
                                          <Link to="/student/students-profile">Jenis R.</Link>
                                        </h4>
                                        <p>Instructor</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      {/* /Today */}
                      {/* Month */}
                      <div className="tab-pane fade" id="month">
                        <div className="table-responsive custom-table">
                          <div className="col-lg-12 col-md-12 d-flex">
                            <div className="course-box course-design list-course d-flex mb-0">
                              <div className="product">
                                <div className="product-img">
                                  <Link to="/course-details">
                                    <img
                                      className="img-fluid"
                                      alt=""
                                      src={Course12}
                                    />
                                  </Link>
                                  <div className="price">
                                    <h3>
                                      $300 <span>$99.00</span>
                                    </h3>
                                  </div>
                                </div>
                                <div className="product-content">
                                  <div className="head-course-title">
                                    <h3 className="title">
                                      <Link to="/course-details">
                                        Sketch from A to Z (2024): Become an app
                                        <br /> designer
                                      </Link>
                                    </h3>
                                    <div className="all-btn all-category d-flex align-items-center">
                                      <Link
                                        to="/view-invoice"
                                        className="btn btn-primary"
                                      >
                                        Invoice
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="course-info d-flex align-items-center border-bottom-0 pb-0">
                                    <div className="rating-img d-flex align-items-center">
                                      <img src={Icon1} alt="" />
                                      <p>12+ Lesson</p>
                                    </div>
                                    <div className="course-view d-flex align-items-center">
                                      <img src="assets/img/icon/icon-02.svg" alt="" />
                                      <p>9hr 30min</p>
                                    </div>
                                  </div>
                                  <div className="rating">
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star"></i>
                                    <span className="d-inline-block average-rating">
                                      <span>4.0</span> (15)
                                    </span>
                                  </div>
                                  <div className="course-group d-flex mb-0">
                                    <div className="course-group-img d-flex">
                                      <Link to="/student/students-profile">
                                        <img
                                          src={User3}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </Link>
                                      <div className="course-name">
                                        <h4>
                                          <Link to="/student/students-profile">
                                            Jesse Stevens
                                          </Link>
                                        </h4>
                                        <p>Instructor</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* /Month */}
                      {/* Yearly */}
                      <div className="tab-pane fade" id="year">
                        <div className="table-responsive custom-table">
                          <div className="col-lg-12 col-md-12 d-flex">
                            <div className="course-box course-design list-course d-flex">
                              <div className="product">
                                <div className="product-img">
                                  <Link to="/course-details">
                                    <img
                                      className="img-fluid"
                                      alt=""
                                      src={Course10}
                                    />
                                  </Link>
                                  <div className="price">
                                    <h3 className="free-color">FREE</h3>
                                  </div>
                                </div>
                                <div className="product-content">
                                  <div className="head-course-title">
                                    <h3 className="title">
                                      <Link to="/course-details">
                                        Information About UI/UX
                                        <br /> Design Degree
                                      </Link>
                                    </h3>
                                    <div className="all-btn all-category d-flex align-items-center">
                                      <Link
                                        to="/view-invoice"
                                        className="btn btn-primary"
                                      >
                                        Invoice
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="course-info d-flex align-items-center border-bottom-0 pb-0">
                                    <div className="rating-img d-flex align-items-center">
                                      <img src={Icon1} alt="" />
                                      <p>12+ Lesson</p>
                                    </div>
                                    <div className="course-view d-flex align-items-center">
                                      <img src="assets/img/icon/icon-02.svg" alt="" />
                                      <p>9hr 30min</p>
                                    </div>
                                  </div>
                                  <div className="rating">
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star filled"></i>
                                    <i className="fas fa-star"></i>
                                    <span className="d-inline-block average-rating">
                                      <span>4.0</span> (15)
                                    </span>
                                  </div>
                                  <div className="course-group d-flex mb-0">
                                    <div className="course-group-img d-flex">
                                      <Link to="/student/students-profile">
                                        <img
                                          src={User1}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </Link>
                                      <div className="course-name">
                                        <h4>
                                          <Link to="/student/students-profile">Rolands R</Link>
                                        </h4>
                                        <p>Instructor</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      {/* /Yearly */}
                    </div>
                    {/* /Tab Content */}
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
            {/* /Student Order History */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <Footer />
    </div>
  );
};

export default StudentOrderHistory;
