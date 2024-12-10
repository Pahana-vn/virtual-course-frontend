import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/student/header";
import { fetchCartItems, removeCourseFromCart } from "../../../services/studentService";
import Footer from "../../footer";
import { Course10, Icon1, Icon2 } from "../../imagepath";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả lập studentId = 1 khi chưa có đăng nhập
  const studentId = 1; // Thay đổi sau khi có tính năng đăng nhập

  // Lấy giỏ hàng từ API khi trang được tải
  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetchCartItems(studentId);
        if (response && Array.isArray(response)) {
          setCartItems(response); // Cập nhật trạng thái giỏ hàng nếu dữ liệu hợp lệ
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, [studentId]);

  // Tính tổng giá trị giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.course.basePrice || 0) * item.quantity,
      0
    );
  };

  // Hàm xóa khóa học khỏi giỏ hàng
  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeCourseFromCart(studentId, cartItemId);
      // Sau khi xóa thành công, cập nhật lại danh sách giỏ hàng
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
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

                            {/* <Link to="/checkout" className="btn btn-primary">
                              Checkout
                            </Link> */}

                            <Link
                              to={{
                                pathname: `/checkout`,
                                state: { cartItems: cartItems }, // Pass all cart items as state
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
