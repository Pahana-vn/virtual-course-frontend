import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchCartItems, removeCourseFromCart } from "../../../services/studentService";
import Footer from "../../footer";
import { Course10, Icon1, Icon2 } from "../../imagepath";
import PageHeader from "../../student/header/index";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("studentId");
    if (id) {
      setStudentId(id);
    } else {
      const storedStudentId = localStorage.getItem("studentId");
      if (storedStudentId) {
        setStudentId(storedStudentId);
      }
    }
  }, [location]);

  useEffect(() => {
    if (studentId) {
      const getCartItems = async () => {
        try {
          setLoading(true);
          const response = await fetchCartItems(studentId);
          if (Array.isArray(response)) {
            setCartItems(response);
          } else {
            console.error("Invalid cart data format received");
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      };
      getCartItems();
    }
  }, [studentId]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.course.basePrice || 0) * item.quantity,
      0
    );
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeCourseFromCart(studentId, cartItemId);
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error("Error removing course from cart:", error);
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <PageHeader activeMenu="Cart" />

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
                        Cart
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="course-content cart-widget">
          <div className="container">
            <div className="student-widget">
              <div className="student-widget-group">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-head">
                      <h4>Your cart ({cartItems.length} items)</h4>
                    </div>
                    <div className="cart-group">
                      <div className="row">
                        {loading ? (
                          <div>Loading...</div>
                        ) : cartItems.length === 0 ? (
                          <div>Your cart is empty.</div>
                        ) : (
                          cartItems.map((item) => (
                            <div key={item.id} className="col-lg-12 col-md-12 d-flex">
                              <div className="course-box course-design list-course d-flex">
                                <div className="product">
                                  <div className="product-img">
                                    <Link to={`/course-details/${item.course.id}`}>
                                      <img
                                        className="img-fluid"
                                        alt=""
                                        src={item.course.imageCover || Course10}
                                      />
                                    </Link>
                                    <div className="price">
                                      <h3 className="free-color">
                                        {item.course.basePrice
                                          ? `$${item.course.basePrice}`
                                          : "FREE"}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="product-content">
                                    <div className="head-course-title">
                                      <h3 className="title">
                                        <Link to={`/course-details/${item.course.id}`}>
                                          {item.course.titleCourse}
                                        </Link>
                                      </h3>
                                    </div>
                                    <div className="course-info d-flex align-items-center border-bottom-0 pb-0">
                                      <div className="rating-img d-flex align-items-center">
                                        <img src={Icon1} alt="" />
                                        <p>{item.course.duration} Lessons</p>
                                      </div>
                                      <div className="course-view d-flex align-items-center">
                                        <img src={Icon2} alt="" />
                                        <p>{item.course.duration}hrs</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="cart-remove">
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleRemoveFromCart(item.id)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="cart-total">
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="cart-subtotal">
                            <p>
                              Subtotal <span>${calculateTotal().toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="check-outs">
                            <Link
                              to={{
                                pathname: `/checkout`,
                                state: { cartItems: cartItems },
                              }}
                              className="btn btn-primary"
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="condinue-shop">
                            <Link to="/course-grid" className="btn btn-primary">
                              Continue Shopping
                            </Link>
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

        <Footer />
      </div>
    </>
  );
};

export default Cart;
