/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Home, LogOut, Star, User } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logOut, selectCurrentUser } from "../../../redux/slices/auth/authSlice";
import { useStudentAvatarQuery } from "../../../redux/slices/student/studentApiSlice";
import {
  addCourseToCart,
  fetchCartItems,
  fetchWishlist,
  removeCourseFromCart,
  removeCourseFromWishlist,
} from "../../../services/studentService";
import DarkMode from "../../common/darkMode";
import { Cart, logo, Messages, User16, Wish } from "../../imagepath";
import "./StudentHeader1.css";

export default function StudentHeader() {
  const dispatch = useDispatch();

  const [navbar, setNavbar] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const user = useSelector(selectCurrentUser);

  const accountId = useSelector((state) => state.auth.user?.accountId);
  const { data } = useStudentAvatarQuery({ accountId });
  const avatarUrl = data?.url || "default-avatar.png";

  const handleLogout = () => {
    dispatch(logOut());
  };

  // Mobile Menu toggle
  const [setMobileMenu] = useState(false);
  const [mobileSubMenu4, setMobileSubMenu4] = useState(false);

  const cartRef = useRef();
  const wishRef = useRef();
  const notificationRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  useOnClickOutside(cartRef, () => setShowCart(false));
  useOnClickOutside(wishRef, () => setShowWish(false));
  useOnClickOutside(notificationRef, () => setShowNotification(false));
  useOnClickOutside(profileRef, () => setShowProfile(false));

  // Check login status and fetch data from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");

    if (token && studentId) {
      setIsLoggedIn(true);
      fetchCartAndWishlistData(studentId);
    }
  }, []);

  // Fetch Cart and Wishlist data after login
  const fetchCartAndWishlistData = async (studentId) => {
    if (!studentId) return;

    try {
      console.log(`📌 Fetching cart & wishlist for studentId: ${studentId}`);
      const cartResponse = await fetchCartItems(studentId);
      setCartItems(cartResponse);
      setCartCount(cartResponse.length);

      const wishlistResponse = await fetchWishlist(studentId);
      setWishlistItems(wishlistResponse);
    } catch (error) {
      console.error("❌ Lỗi khi lấy giỏ hàng hoặc wishlist:", error);
    }
  };

  // Handle cart click
  const cartClick = (e) => {
    e.preventDefault();
    setShowCart(!showCart);
    if (showWish) setShowWish(false);
  };

  // Handle wishlist click
  const wishClick = (e) => {
    e.preventDefault();
    setShowWish(!showWish);
    if (showCart) setShowCart(false);
  };

  const profileClick = (e) => {
    e.preventDefault();
    setShowProfile(!showProfile);
  };

  // Event handler for toggling navbar background on scroll
  useEffect(() => {
    const changeHeaderBackground = () => {
      setNavbar(window.scrollY >= 60);
    };
    window.addEventListener("scroll", changeHeaderBackground);
    return () => {
      window.removeEventListener("scroll", changeHeaderBackground);
    };
  }, []);

  // Helper function to calculate the total of cart items
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item.course.discountPrice || item.course.basePrice),
      0
    );
  };

  // Handle course removal from cart
  const handleRemoveFromCart = async (cartItemId) => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    try {
      await removeCourseFromCart(studentId, cartItemId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      setCartCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("❌ Lỗi khi xóa khỏi giỏ hàng:", error);
    }
  };

  // Handle course removal from wishlist
  const handleRemoveFromWishlist = async (courseId) => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    try {
      await removeCourseFromWishlist(studentId, courseId);
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== courseId)
      );
    } catch (error) {
      console.error("❌ Lỗi khi xóa khỏi Wishlist:", error);
    }
  };

  // Add course from wishlist to cart
  const handleAddToCartFromWishlist = async (course) => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return;

    try {
      const addToCartDTO = { id: course.id };
      await addCourseToCart(studentId, addToCartDTO);

      setCartCount((prevCount) => prevCount + 1);
      setCartItems((prevItems) => [
        ...prevItems,
        { id: Date.now(), course: course, quantity: 1 },
      ]);

      await handleRemoveFromWishlist(course.id);
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
    }
  };
  // Mobile Menu Handlers

  const hideMobileMenu = () => {
    document.body.classList.remove("menu-opened");
    setMobileMenu(false);
  };

  const openMobileSubMenu4 = (e) => {
    e.preventDefault();
    setMobileSubMenu4(!mobileSubMenu4);
  };

  return (
    <>
      <ToastContainer />
      <header className="header header-page">
        <div className="header-fixed">
          <nav
            className={
              navbar
                ? "navbar navbar-expand-lg header-nav scroll-sticky add-header-bg"
                : "navbar navbar-expand-lg header-nav scroll-sticky"
            }
          >
            <div className="container">
              <div className="navbar-header">
                <Link to="#" id="mobile_btn">
                  <span className="bar-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </Link>
                <Link to="/home" className="navbar-brand logo">
                  <img src={logo} className="img-fluid" alt="Logo" />
                </Link>
              </div>

              <div className="main-menu-wrapper">
                <div className="menu-header">
                  <Link to="/home" className="menu-logo">
                    <img src={logo} className="img-fluid" alt="Logo" />
                  </Link>
                  <Link
                    id="menu_close"
                    className="menu-close"
                    to="#"
                    onClick={hideMobileMenu}
                  >
                    <i className="fas fa-times"></i>
                  </Link>
                </div>
                <ul className="main-nav">
                  <li className="has-submenu">
                    <Link
                      to="/home"
                      className={mobileSubMenu4 ? "submenu" : ""}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/course-grid" onClick={hideMobileMenu}>
                      Course
                    </Link>
                  </li>

                  <li className="has-submenu">
                    <Link to="#">
                      Pages
                      <i
                        className="fas fa-chevron-down"
                        onClick={openMobileSubMenu4}
                      ></i>
                    </Link>
                    <ul
                      className={
                        mobileSubMenu4 ? "submenu submenuShow" : "submenu"
                      }
                    >
                      <li>
                        <Link to="/job-category">Category</Link>
                      </li>
                      <li>
                        <Link to="/faq">FAQ</Link>
                      </li>
                      <li>
                        <Link to="/support">Support</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/support">About us</Link>
                  </li>
                  <li className="has-submenu">
                    <Link to="/blog-modern">Blog</Link>
                  </li>
                </ul>
              </div>

              <ul className="nav header-navbar-rht">
                <DarkMode />
                {isLoggedIn ? (
                  <>
                    <li className="nav-item">
                      <Link to="/student/dashboard">
                        <img src={Messages} alt="Messages" />
                      </Link>
                    </li>

                    <li className="nav-item cart-nav" ref={cartRef}>
                      <Link
                        to="#"
                        className="dropdown-toggle"
                        onClick={cartClick}
                      >
                        <img src={Cart} alt="Cart" />
                        {cartCount > 0 && (
                          <span className="cart-count-badge">{cartCount}</span>
                        )}
                      </Link>
                      <div
                        className={`wishes-list dropdown-menu dropdown-end dropdown-menu-right modalPosition ${showCart ? "show" : ""
                          }`}
                      >
                        <div className="wish-header d-flex justify-content-between align-items-center p-2 border-bottom">
                          <Link
                            to={`/cart?studentId=${localStorage.getItem(
                              "studentId"
                            )}`}
                            onClick={() => setShowCart(false)}
                          >
                            View Cart
                          </Link>
                          <Link
                            to={`/checkout?studentId=${localStorage.getItem(
                              "studentId"
                            )}`}
                            className="float-end"
                            onClick={() => setShowCart(false)}
                          >
                            Checkout
                          </Link>
                        </div>
                        <div className="wish-content p-2">
                          <ul>
                            {cartItems.length > 0 ? (
                              cartItems.map((item) => (
                                <li key={item.id}>
                                  <div className="media">
                                    <div className="d-flex media-wide">
                                      <div className="avatar">
                                        <Link
                                          to={`/course-details/${item.course.id}`}
                                        >
                                          <img
                                            alt={item.course.titleCourse}
                                            src={item.course.imageCover || Cart}
                                          />
                                        </Link>
                                      </div>
                                      <div className="media-body">
                                        <h6>
                                          <Link
                                            to={`/course-details/${item.course.id}`}
                                          >
                                            {item.course.titleCourse}
                                          </Link>
                                        </h6>
                                        <p>
                                          By {item.course.instructorFirstName}
                                        </p>
                                        <h5>
                                          ${item.course.basePrice}{" "}
                                          <span>
                                            $
                                            {item.course.discountPrice ||
                                              item.course.basePrice}
                                          </span>
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="remove-btn">
                                      <Link
                                        to="#"
                                        className="btn"
                                        onClick={() =>
                                          handleRemoveFromCart(item.id)
                                        }
                                      >
                                        Remove
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="text-center">
                                Your cart is empty.
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="wish-header flex-row-reverse">
                          <h5>Total: $ {calculateTotal()}</h5>
                        </div>
                      </div>
                    </li>

                    <li className="nav-item wish-nav" ref={wishRef}>
                      <Link
                        to="#"
                        className="dropdown-toggle"
                        onClick={wishClick}
                      >
                        <img src={Wish} alt="Wishlist" />
                        {wishlistItems.length > 0 && (
                          <span className="cart-count-badge">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                      <div
                        className={`wishes-list dropdown-menu dropdown-end dropdown-menu-right modalPosition ${showWish ? "show" : ""
                          }`}
                      >
                        <div className="wish-header d-flex justify-content-between align-items-center p-2 border-bottom">
                          <h5>Wishlist</h5>
                          <Link to="#" onClick={() => setShowWish(false)}>
                            <i className="fas fa-times"></i>
                          </Link>
                        </div>
                        <div className="wish-content p-2">
                          <ul>
                            {wishlistItems.length > 0 ? (
                              wishlistItems.map((course) => (
                                <li key={course.id}>
                                  <div className="media">
                                    <div className="d-flex media-wide">
                                      <div className="avatar">
                                        <Link
                                          to={`/course-details/${course.id}`}
                                        >
                                          <img
                                            alt={course.titleCourse}
                                            src={course.imageCover || Cart}
                                          />
                                        </Link>
                                      </div>
                                      <div className="media-body">
                                        <h6>
                                          <Link
                                            to={`/course-details/${course.id}`}
                                          >
                                            {course.titleCourse}
                                          </Link>
                                        </h6>
                                        <p>By {course.instructorFirstName}</p>
                                        <h5>
                                          ${course.basePrice}{" "}
                                          <span>
                                            $
                                            {course.discountPrice ||
                                              course.basePrice}
                                          </span>
                                        </h5>
                                        <div className="remove-btn">
                                          <Link
                                            to="#"
                                            className="btn me-2"
                                            onClick={() =>
                                              handleAddToCartFromWishlist(
                                                course
                                              )
                                            }
                                          >
                                            Add to cart
                                          </Link>
                                          <Link
                                            to="#"
                                            className="btn"
                                            onClick={() =>
                                              handleRemoveFromWishlist(
                                                course.id
                                              )
                                            }
                                          >
                                            Remove
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <li className="text-center">
                                Your wishlist is empty.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </li>

                    {/* Logout Button */}

                    <li className="nav-item user-nav" ref={profileRef}>
                      <Link
                        to="#"
                        className={
                          showProfile
                            ? "dropdown-toggle show"
                            : "dropdown-toggle"
                        }
                        onClick={profileClick}
                      >
                        <span className="user-img">
                          <img src={User16} alt="User" />
                          <span className="status online"></span>
                        </span>
                      </Link>
                      <div
                        className={`users dropdown-menu dropdown-menu-right modalPosition ${showProfile ? "show" : ""
                          }`}
                      >
                        <div className="user-header d-flex align-items-center p-2 border-bottom">
                          <div className="avatar avatar-sm">
                            <img
                              src={User16}
                              alt="User Image"
                              className="avatar-img rounded-circle"
                            />
                          </div>
                          <div className="user-text ms-2">
                            <h6>Student</h6>
                            <p className="text-muted mb-0"></p>
                          </div>
                        </div>
                        <Link
                          className="dropdown-item text"
                          to={`/student/student-dashboard/${localStorage.getItem(
                            "studentId"
                          )}`}
                          onClick={() => setShowProfile(false)}
                        >
                          <Home
                            size={14}
                            color={"#FF875A"}
                            className="headerIcon me-2"
                          />
                          Dashboard
                        </Link>

                        <Link
                          className="dropdown-item text"
                          to={`/student/student-profile/${localStorage.getItem(
                            "studentId"
                          )}`}
                          onClick={() => setShowProfile(false)}
                        >
                          <User
                            size={14}
                            color={"#FF875A"}
                            className="headerIcon me-2"
                          />
                          Profile
                        </Link>

                        <Link
                          className="dropdown-item text"
                          to="/student/setting-student-subscription"
                          onClick={() => setShowProfile(false)}
                        >
                          <Star
                            size={14}
                            color={"#FF875A"}
                            className="headerIcon me-2"
                          />
                          Subscription
                        </Link>

                        <Link
                          to="#"
                          onClick={handleLogout}
                          className="dropdown-item text"
                        >
                          <LogOut
                            size={14}
                            color={"#FF875A"}
                            className="headerIcon me-2"
                          />
                          Logout
                        </Link>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link header-sign" to="/login">
                        Sign In
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link header-login" to="/register">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
