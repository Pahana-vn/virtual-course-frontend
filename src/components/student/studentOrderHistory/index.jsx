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

                  {orders.length === 0 ? (
                    <div className="checkout-form pb-0">
                      <div className="row"><p>No orders found.</p></div>
                    </div>

                  ) : (
                    <div className="table-responsive custom-table">
                      <table className="table">
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
                                <span className={`badge ${order.status === "Completed" ? "bg-success" : "bg-warning"}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <Link to={`/view-invoice/${order.id}`} className="btn btn-primary btn-sm">
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
