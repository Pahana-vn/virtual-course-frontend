/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Home, LogOut, Moon, Star, User } from "react-feather";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import {
  addCourseToCart,
  fetchCartItems,
  fetchWishlist,
  removeCourseFromCart,
  removeCourseFromWishlist
} from "../../../services/studentService";
import DarkMode from "../../common/darkMode";
import {
  Cart,
  Course4,
  logo,
  Messages,
  Notification,
  User1,
  User16,
  User2,
  User3,
  Wish
} from "../../imagepath";
import "./StudentHeader1.css"; // Import CSS file

export default function StudentHeader() {
  const [cartCount, setCartCount] = useState(0); // State to store the cart count
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const [wishlistItems, setWishlistItems] = useState([]); // State to store wishlist items
  const [navbar, setNavbar] = useState(false);

  const [showCart, setShowCart] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mobile Menu toggle
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSubMenu4, setMobileSubMenu4] = useState(false);

  const navigate = useNavigate();

  // Refs for dropdowns to handle click outside
  const cartRef = useRef();
  const wishRef = useRef();
  const notificationRef = useRef();
  const profileRef = useRef();

  // Close dropdowns when clicking outside
  useOnClickOutside(cartRef, () => setShowCart(false));
  useOnClickOutside(wishRef, () => setShowWish(false));
  useOnClickOutside(notificationRef, () => setShowNotification(false));
  useOnClickOutside(profileRef, () => setShowProfile(false));

  const studentId = 1; // Temporary student ID since login is not available yet

  useEffect(() => {
    // Function to get cart items and wishlist items
    const getCartAndWishlistData = async () => {
      try {
        // Fetch Cart Items
        const cartResponse = await fetchCartItems(studentId);
        if (cartResponse && Array.isArray(cartResponse)) {
          setCartItems(cartResponse);
          setCartCount(cartResponse.length); // Update cart count
          console.log("Cart Items:", cartResponse);
        } else {
          console.error("Invalid cart data format received");
        }

        // Fetch Wishlist Items
        const wishlistResponse = await fetchWishlist(studentId);
        if (wishlistResponse && Array.isArray(wishlistResponse)) {
          setWishlistItems(wishlistResponse);
          console.log("Wishlist Items:", wishlistResponse);
        } else {
          console.error("Invalid wishlist data format received");
        }
      } catch (error) {
        console.error("Error fetching cart or wishlist items:", error);
        toast.error("Failed to fetch cart or wishlist items.");
      }
    };

    getCartAndWishlistData();
  }, [studentId]);

  // Event handler for scrolling to change navbar background
  useEffect(() => {
    const changeHeaderBackground = () => {
      if (window.scrollY >= 60) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    };
    window.addEventListener("scroll", changeHeaderBackground);
    return () => {
      window.removeEventListener("scroll", changeHeaderBackground);
    };
  }, []);

  // Event handlers for toggling dropdowns
  const cartClick = (e) => {
    e.preventDefault();
    setShowCart(!showCart);
    if (showWish) setShowWish(false);
  };

  const wishClick = (e) => {
    e.preventDefault();
    setShowWish(!showWish);
    if (showCart) setShowCart(false);
  };

  const notificationClick = (e) => {
    e.preventDefault();
    setShowNotification(!showNotification);
  };

  const profileClick = (e) => {
    e.preventDefault();
    setShowProfile(!showProfile);
  };

  // Mobile Menu Handlers
  const openMobileMenu = () => {
    document.body.classList.add("menu-opened");
    setMobileMenu(true);
  };
  const hideMobileMenu = () => {
    document.body.classList.remove("menu-opened");
    setMobileMenu(false);
  };

  const openMobileSubMenu4 = (e) => {
    e.preventDefault();
    setMobileSubMenu4(!mobileSubMenu4);
  };

  // Helper functions to calculate subtotal and total
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.course.discountPrice || item.course.basePrice), 0);
  };

  const calculateTotal = () => {
    // Add additional fees if necessary
    return calculateSubtotal();
  };

  // Event handlers for cart and wishlist actions
  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeCourseFromCart(studentId, cartItemId);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
      setCartCount((prevCount) => prevCount - 1);
      toast.success("Removed from cart successfully!");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const handleRemoveFromWishlist = async (courseId) => {
    try {
      await removeCourseFromWishlist(studentId, courseId);
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== courseId));
      toast.success("Removed from wishlist successfully!");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist.");
    }
  };

  const handleAddToCartFromWishlist = async (course) => {
    try {
      // Debugging: Log the course object
      console.log("Course object from wishlist:", course);

      // Check if the course is already in the cart
      if (isCourseInCart(course.id)) {
        toast.info("This course is already in your cart!");
        return;
      }

      // Construct the AddToCartDTO object
      const addToCartDTO = {
        id: course.id // Chỉ cần courseId
      };

      // Debugging: Log the constructed AddToCartDTO
      console.log("Constructed AddToCartDTO:", addToCartDTO);

      // Add to cart
      await addCourseToCart(studentId, addToCartDTO);
      toast.success("Added to cart successfully!");

      // Update the cart state
      setCartCount(prevCount => prevCount + 1);
      setCartItems(prevItems => [...prevItems, { id: Date.now(), course: course, quantity: 1 }]);

      // Remove the course from wishlist after adding to cart
      await removeCourseFromWishlist(studentId, course.id);
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== course.id));

    } catch (error) {
      console.error("Error adding item to cart from wishlist:", error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to add to cart.";
      toast.error(errorMessage);
    }
  };


  // Check if a course is already in the cart
  const isCourseInCart = (courseId) => {
    return cartItems.some(item => item.course && item.course.id === courseId);
  };

  // Navigation handlers
  const navigateToCart = () => {
    navigate(`/cart?studentId=${studentId}`);
    setShowCart(false);
  };

  const navigateToCheckout = () => {
    navigate(`/checkout?studentId=${studentId}`);
    setShowCart(false);
  };

  return (
    <>
      <ToastContainer /> {/* Container for Toastify */}
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
                <Link id="mobile_btn" to="#" onClick={openMobileMenu}>
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
                    <Link to="/home" className={mobileSubMenu4 ? "submenu" : ""}>
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
                    <Link to="/blog-modern">
                      Blog
                    </Link>
                  </li>
                  <li className="login-link">
                    <Link to="/login">Login / Signup</Link>
                  </li>
                </ul>
              </div>

              <ul className="nav header-navbar-rht">
                <DarkMode />
                <li className="nav-item">
                  <Link to="/student/student-messages">
                    <img src={Messages} alt="Messages" />
                  </Link>
                </li>

                {/* Cart Dropdown */}
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
                  <div className={`wishes-list dropdown-menu dropdown-end dropdown-menu-right modalPosition ${showCart ? 'show' : ''}`}>
                    <div className="wish-header d-flex justify-content-between align-items-center p-2 border-bottom">
                      <Link
                        to={`/cart?studentId=${studentId}`}
                        onClick={() => setShowCart(false)}
                      >
                        View Cart
                      </Link>

                      <Link
                        to={`/checkout?studentId=${studentId}`}
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
                                    <Link to={`/course-details/${item.course.id}`}>
                                      <img alt={item.course.titleCourse} src={item.course.imageCover || Course4} />
                                    </Link>
                                  </div>
                                  <div className="media-body">
                                    <h6>
                                      <Link to={`/course-details/${item.course.id}`}>{item.course.titleCourse}</Link>
                                    </h6>
                                    <p>By {item.course.instructorFirstName}</p>
                                    <h5>
                                      ${item.course.basePrice} <span>${item.course.discountPrice || item.course.basePrice}</span>
                                    </h5>
                                  </div>
                                </div>
                                <div className="remove-btn">
                                  <Link to="#" className="btn" onClick={() => handleRemoveFromCart(item.id)}>
                                    Remove
                                  </Link>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="text-center">Your cart is empty.</li>
                        )}
                      </ul>
                    </div>

                    <div className="wish-header flex-row-reverse">
                      <h5 >Total : $ {calculateTotal()}</h5>
                    </div>

                  </div>
                </li>

                {/* Wishlist Dropdown */}
                <li className="nav-item wish-nav" ref={wishRef}>
                  <Link
                    to="#"
                    className="dropdown-toggle"
                    onClick={wishClick}
                  >
                    <img src={Wish} alt="Wishlist" />
                    {wishlistItems.length > 0 && (
                      <span className="cart-count-badge">{wishlistItems.length}</span>
                    )}
                  </Link>
                  <div className={`wishes-list dropdown-menu dropdown-end dropdown-menu-right modalPosition ${showWish ? 'show' : ''}`}>
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
                                    <Link to={`/course-details/${course.id}`}>
                                      <img alt={course.titleCourse} src={course.imageCover || Course4} />
                                    </Link>
                                  </div>
                                  <div className="media-body">
                                    <h6>
                                      <Link to={`/course-details/${course.id}`}>{course.titleCourse}</Link>
                                    </h6>
                                    <p>By {course.instructorFirstName}</p>
                                    <h5>
                                      ${course.basePrice} <span>${course.discountPrice || course.basePrice}</span>
                                    </h5>
                                    <div className="remove-btn">
                                      <Link to="#" className="btn me-2" onClick={() => handleAddToCartFromWishlist(course)}>
                                        Add to cart
                                      </Link>
                                      <Link to="#" className="btn" onClick={() => handleRemoveFromWishlist(course.id)}>
                                        Remove
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="text-center">Your wishlist is empty.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </li>

                {/* Notification Dropdown */}
                <li className="nav-item noti-nav" ref={notificationRef}>
                  <Link to="#" className="dropdown-toggle" onClick={notificationClick}>
                    <img src={Notification} alt="Notifications" />
                  </Link>
                  <div className={`notifications dropdown-menu dropdown-end dropdown-menu-right modalPosition ${showNotification ? 'show' : ''}`}>
                    <div className="topnav-dropdown-header d-flex justify-content-between align-items-center p-2 border-bottom">
                      <span className="notification-title">
                        Notifications
                        <select className="ms-2">
                          <option>All</option>
                          <option>Unread</option>
                        </select>
                      </span>
                      <Link to="#" className="clear-noti">
                        Mark all as read <i className="fa-solid fa-circle-check"></i>
                      </Link>
                    </div>
                    <div className="noti-content p-2">
                      <ul className="notification-list">
                        <li className="notification-message">
                          <div className="media d-flex">
                            <div>
                              <Link to="/page-notification" className="avatar">
                                <img className="avatar-img" alt="User1" src={User1} />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h6>
                                <Link to="/page-notification">
                                  Lex Murphy requested <span>access to</span> UNIX directory tree hierarchy
                                </Link>
                              </h6>
                              <button className="btn btn-accept btn-sm me-2">Accept</button>
                              <button className="btn btn-reject btn-sm">Reject</button>
                              <p>Today at 9:42 AM</p>
                            </div>
                          </div>
                        </li>
                        <li className="notification-message">
                          <div className="media d-flex">
                            <div>
                              <Link to="/page-notification" className="avatar">
                                <img className="avatar-img" alt="User2" src={User2} />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h6>
                                <Link to="/page-notification">
                                  Ray Arnold left 6 <span>comments on</span> Isla Nublar SOC2 compliance report
                                </Link>
                              </h6>
                              <p>Yesterday at 11:42 PM</p>
                            </div>
                          </div>
                        </li>
                        <li className="notification-message">
                          <div className="media d-flex">
                            <div>
                              <Link to="/page-notification" className="avatar">
                                <img className="avatar-img" alt="User3" src={User3} />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h6>
                                <Link to="/page-notification">
                                  Dennis Nedry <span>commented on</span> Isla Nublar SOC2 compliance report
                                </Link>
                              </h6>
                              <p className="noti-details">
                                “Oh, I finished de-bugging the phones, but the system&apos;s compiling for eighteen minutes, or twenty. So, some minor systems may go on and off for a while.”
                              </p>
                              <p>Yesterday at 5:42 PM</p>
                            </div>
                          </div>
                        </li>
                        <li className="notification-message">
                          <div className="media d-flex">
                            <div>
                              <Link to="/notifications" className="avatar">
                                <img className="avatar-img" alt="User1" src={User1} />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h6>
                                <Link to="/notifications">
                                  John Hammond <span>created</span> Isla Nublar SOC2 compliance report
                                </Link>
                              </h6>
                              <p>Last Wednesday at 11:15 AM</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>

                {/* User Profile Dropdown */}
                <li className="nav-item user-nav" ref={profileRef}>
                  <Link
                    to="#"
                    className={showProfile ? "dropdown-toggle show" : "dropdown-toggle"}
                    onClick={profileClick}
                  >
                    <span className="user-img">
                      <img src={User16} alt="User" />
                      <span className="status online"></span>
                    </span>
                  </Link>
                  <div
                    className={`users dropdown-menu dropdown-menu-right modalPosition ${showProfile ? 'show' : ''}`}
                    data-popper-placement="bottom-end"
                  >
                    <div className="user-header d-flex align-items-center p-2 border-bottom">
                      <div className="avatar avatar-sm">
                        <img src={User16} alt="User Image" className="avatar-img rounded-circle" />
                      </div>
                      <div className="user-text ms-2">
                        <h6>Rolands R</h6>
                        <p className="text-muted mb-0">Student</p>
                      </div>
                    </div>
                    <Link
                      className="dropdown-item text"
                      to="/student/student-dashboard"
                      onClick={() => setShowProfile(false)}
                    >
                      <Home size={14} color={"#FF875A"} className="headerIcon me-2" />
                      Dashboard
                    </Link>
                    <Link
                      className="dropdown-item text"
                      to="/student/student-setting"
                      onClick={() => setShowProfile(false)}
                    >
                      <User size={14} color={"#FF875A"} className="headerIcon me-2" />
                      Profile
                    </Link>
                    <Link
                      className="dropdown-item text"
                      to="/student/setting-student-subscription"
                      onClick={() => setShowProfile(false)}
                    >
                      <Star size={14} color={"#FF875A"} className="headerIcon me-2" />
                      Subscription
                    </Link>
                    <div className="dropdown-item text night-mode d-flex justify-content-between align-items-center">
                      <span>
                        <Moon size={14} className="headerIcon me-2" />
                        Night Mode
                      </span>
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input focusShadow"
                          type="checkbox"
                          id="night-mode"
                        />
                      </div>
                    </div>
                    <Link className="dropdown-item text" to="/home" onClick={() => setShowProfile(false)}>
                      <LogOut
                        size={14}
                        color={"#FF875A"}
                        className="headerIcon me-2"
                      />
                      Logout
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
          <div
            className={mobileMenu ? "sidebar-overlay opened" : "sidebar-overlay"}
          ></div>
        </div>
      </header>
    </>
  );
}
