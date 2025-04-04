import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCourseById } from "../../../services/courseService";
import { createPaypalPayment, createPaypalPaymentForCart, createVnpayPayment, createVnpayPaymentForCart } from "../../../services/paymentService";
import { fetchCartItems } from "../../../services/studentService";
import Footer from "../../footer";
import PageHeader from "../../student/header/index";

const Checkout = () => {
  const { courseId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [singleCourse, setSingleCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const loadCheckoutData = async () => {
      if (courseId) {
        try {
          const course = await fetchCourseById(courseId);
          setSingleCourse(course);
        } catch (error) {
          console.error("Error fetching course details:", error);
          toast.error("Error fetching course details");
        }
      } else {
        try {
          const response = await fetchCartItems(studentId);
          setCartItems(response);
        } catch (error) {
          console.error("Error fetching cart items:", error);
          toast.error("Error fetching cart items");
        }
      }
      setLoading(false);
    };

    loadCheckoutData();
  }, [courseId, studentId]);

  const calculateTotal = () => {
    if (singleCourse) {
      return singleCourse.basePrice || 0;
    } else if (cartItems.length > 0) {
      return cartItems.reduce((total, item) => total + (item.course.basePrice || 0), 0);
    }
    return 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      if (paymentMethod === "PAYPAL") {
        if (courseId) {
          const approvalUrl = await createPaypalPayment(courseId);
          window.location.href = approvalUrl;
        } else {
          if (cartItems.length === 0) {
            toast.warning("No courses in cart.");
            return;
          }
          const courseIds = cartItems.map(item => item.course.id);
          const approvalUrl = await createPaypalPaymentForCart(courseIds);
          window.location.href = approvalUrl;
        }
      } else if (paymentMethod === "VNPAY") {
        if (courseId) {
          const paymentUrl = await createVnpayPayment(courseId);
          window.location.href = paymentUrl;
        } else {
          if (cartItems.length === 0) {
            toast.warning("No courses in cart.");
            return;
          }
          const courseIds = cartItems.map(item => item.course.id);
          const paymentUrl = await createVnpayPaymentForCart(courseIds);
          window.location.href = paymentUrl;
        }
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error creating payment");
      }
    }
  };

  return (
    <div className="main-wrapper">
      <style>
        {`
          .course-plan {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .course-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
          }
          .course-item img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .course-details {
            flex-grow: 1;
          }
          .course-details h3 {
            font-size: 1.1rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          .course-details p {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 5px;
          }
          .course-price {
            font-size: 1.2rem;
            font-weight: bold;
            color: #007bff;
          }
          .total-price {
            font-size: 1.4rem;
            font-weight: bold;
            color: #28a745;
            text-align: right;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        `}
      </style>

      <PageHeader activeMenu="Checkout" />
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
                      Pages
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="course-content checkout-widget">
        <div className="container">
          <div className="row">
            {/* Payment Method */}
            <div className="col-lg-7">
              <div className="student-widget">
                <div className="student-widget-group add-course-info">
                  <div className="cart-head">
                    <h4>Payment Method</h4>
                  </div>
                  <div className="checkout-form">
                    <form onSubmit={handlePayment}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="wallet-method">
                            <label className="radio-inline custom_radio me-4">
                              <input
                                type="radio"
                                name="optradio"
                                value="VNPAY"
                                checked={paymentMethod === "VNPAY"}
                                onChange={() => setPaymentMethod("VNPAY")}
                              />
                              <span className="checkmark" /> VNPay
                            </label>
                            <label className="radio-inline custom_radio">
                              <input
                                type="radio"
                                name="optradio"
                                value="PAYPAL"
                                checked={paymentMethod === "PAYPAL"}
                                onChange={() => setPaymentMethod("PAYPAL")}
                              />
                              <span className="checkmark" /> PayPal
                            </label>
                          </div>
                        </div>
                        <div className="payment-btn">
                          <button className="btn btn-primary" type="submit">
                            Make a Payment
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="col-lg-5 theiaStickySidebar">
              <div className="stickysidebar">
                <div className="student-widget select-plan-group">
                  <div className="student-widget-group">
                    <div className="plan-header">
                      <h4>Order Information</h4>
                    </div>
                    <div className="course-plan">
                      {loading ? (
                        <p>Loading...</p>
                      ) : singleCourse ? (
                        <div className="course-item">
                          <img src={singleCourse.imageCover} alt={singleCourse.titleCourse} />
                          <div className="course-details">
                            <h3>{singleCourse.titleCourse}</h3>
                            <p>{singleCourse.description}</p>
                            <h2 className="course-price">
                              <span></span>{singleCourse.basePrice.toLocaleString()} VND
                            </h2>
                          </div>
                        </div>
                      ) : cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <div key={item.id} className="course-item">
                            <img src={item.course.imageCover} alt={item.course.titleCourse} />
                            <div className="course-details">
                              <h3>{item.course.titleCourse}</h3>
                              <p>{item.course.description}</p>
                              <h2 className="course-price">
                                <span></span>{item.course.basePrice.toLocaleString()} VND
                              </h2>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No courses selected.</p>
                      )}
                      <h3 className="total-price">Total: {calculateTotal().toLocaleString()} VND</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Checkout;