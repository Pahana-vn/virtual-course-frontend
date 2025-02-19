import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudentOrders } from "../../../services/studentService";
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const studentId = localStorage.getItem("studentId"); // Lấy studentId từ localStorage

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!studentId) return;
        const data = await fetchStudentOrders(studentId);
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      }
    };
    loadOrders();
  }, [studentId]);

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Orders"} />
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

      <div className="page-content">
        <div className="container">
          <div className="row">
            <StudentSidebar />
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Order History</h3>
                  </div>
<<<<<<< HEAD
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
=======
>>>>>>> 5d54b7a15301b628ba74c5d864b81c250b37221c

                  {orders.length === 0 ? (
                    <div className="checkout-form pb-0">
                      <div className="row"><p>No orders found.</p></div>
                    </div>
                  ) : (
                    <div className="table-responsive custom-table">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.amount.toLocaleString()} VND</td>
                              <td>{new Date(order.paymentDate).toLocaleString()}</td>
                              <td>{order.paymentMethod}</td>
                              <td>
                                <span
                                  className={`badge ${order.status === "Completed"
                                      ? "badge-success"
                                      : "badge-warning"
                                    }`}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/view-invoice/${order.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  View Invoice
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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

export default StudentOrderHistory;