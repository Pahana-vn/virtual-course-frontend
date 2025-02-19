import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import DarkMode from "../../../common/darkMode";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { Cart, Course14, Course15, Course4, Messages, Notification, User1, User11, User2, User3, Wish } from "../../../imagepath";


const HeadModule = () => {
  const [setShowCart] = useState(false);
  // const [showWish, setShowWish] = useState(false);
  // const [showNoti, setShowNoti] = useState(false);
  const [setShowProfile] = useState(false);

  // Cart Click
  // const cartClick = (e) => {
  //   e.preventDefault();
  //   // if (showWish) {
  //   //   setShowWish(false);
  //   // }
  //   setShowCart(!showCart);
  //   console.log(showCart);
  // };

  // const wishClick = (e) => {
  //   e.preventDefault();
  //   // if (showCart) {
  //   //   setShowCart(false);
  //   // }
  //   setShowWish(!showWish);
  // };

  // const notiClick = (e) => {
  //   e.preventDefault();
  //   // if (showCart) {
  //   //   setShowCart(false);
  //   // }
  //   setShowNoti(!showNoti);
  // };

  // const profileClick = (e) => {
  //   e.preventDefault();
  //   setShowProfile(!showProfile);
  // };

  // Refs
  const cart = useRef();
  useOnClickOutside(cart, () => setShowCart(false));

  const wish = useRef();
  useOnClickOutside(wish, () => setShowCart(false));
  const noti = useRef();
  useOnClickOutside(noti, () => setShowCart(false));

  const profile = useRef();
  useOnClickOutside(profile, () => setShowProfile(false));

  return (

    <>
      <ul className="nav header-navbar-rht">
        <DarkMode />
        <li className="nav-item">
          <Link to="/course-message">
            <img src={Messages} alt="img" />
          </Link>
        </li>
        <li className="nav-item cart-nav">
          <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
            <img src={Cart} alt="img" />
          </Link>
          <div className="wishes-list dropdown-menu dropdown-end dropdown-menu-right modalPosition">
            <div className="wish-header">
              <Link to="#">View Cart</Link>
              <Link to="#" className="float-end">
                Checkout
              </Link>
            </div>
            <div className="wish-content">
              <ul>
                <li>
                  <div className="media">
                    <div className="d-flex media-wide">
                      <div className="avatar">
                        <Link to="/course-details">
                          <img alt="" src={Course4} />
                        </Link>
                      </div>
                      <div className="media-body">
                        <h6>
                          <Link to="/course-details">Learn Angular...</Link>
                        </h6>
                        <p>By Dave Franco</p>
                        <h5>
                          $200 <span>$99.00</span>
                        </h5>
                      </div>
                    </div>
                    <div className="remove-btn">
                      <Link to="#" className="btn">
                        Remove
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="media">
                    <div className="d-flex media-wide">
                      <div className="avatar">
                        <Link to="/course-details">
                          <img alt="" src={Course14} />
                        </Link>
                      </div>
                      <div className="media-body">
                        <h6>
                          <Link to="/course-details">Build Responsive Real...</Link>
                        </h6>
                        <p>Jenis R.</p>
                        <h5>
                          $200 <span>$99.00</span>
                        </h5>
                      </div>
                    </div>
                    <div className="remove-btn">
                      <Link to="#" className="btn">
                        Remove
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="media">
                    <div className="d-flex media-wide">
                      <div className="avatar">
                        <Link to="/course-details">
                          <img alt="" src={Course15} />
                        </Link>
                      </div>
                      <div className="media-body">
                        <h6>
                          <Link to="/course-details">C# Developers Double ...</Link>
                        </h6>
                        <p>Jesse Stevens</p>
                        <h5>
                          $200 <span>$99.00</span>
                        </h5>
                      </div>
                    </div>
                    <div className="remove-btn">
                      <Link to="#" className="btn">
                        Remove
                      </Link>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="total-item">
                <h6>Subtotal : $ 600</h6>
                <h5>Total : $ 600</h5>
              </div>
            </div>
          </div>
        </li>
        <li className="nav-item wish-nav">
          <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
            <img src={Wish} alt="img" />
          </Link>
          <div className="wishes-list dropdown-menu dropdown-end dropdown-menu-right">
            <div className="wish-content">
              <ul>
                <li>
                  <div className="media">
                    <div className="d-flex media-wide">
                      <div className="avatar">
                        <Link to="/course-details">
                          <img alt="" src={Course4} />
                        </Link>
                      </div>
                      <div className="media-body">
                        <h6>
                          <Link to="/course-details">Learn Angular...</Link>
                        </h6>
                        <p>By Dave Franco</p>
                        <h5>
                          $200 <span>$99.00</span>
                        </h5>
                        <div className="remove-btn">
                          <Link to="#" className="btn">
                            Add to cart
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="media">
                    <div className="d-flex media-wide">
                      <div className="avatar">
                        <Link to="/course-details">
                          <img alt="" src={Course14} />
                        </Link>
                      </div>
                      <div className="media-body">
                        <h6>
                          <Link to="/course-details">Build Responsive Real...</Link>
                        </h6>
                        <p>Jenis R.</p>
                        <h5>
                          $200 <span>$99.00</span>
                        </h5>
                        <div className="remove-btn">
                          <Link to="#" className="btn">
                            Add to cart
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="media">
                    <div className="d-flex media-wide">
                      <div className="avatar">
                        <Link to="/course-details">
                          <img alt="" src={Course15} />
                        </Link>
                      </div>
                      <div className="media-body">
                        <h6>
                          <Link to="/course-details">C# Developers Double ...</Link>
                        </h6>
                        <p>Jesse Stevens</p>
                        <h5>
                          $200 <span>$99.00</span>
                        </h5>
                        <div className="remove-btn">
                          <Link to="#" className="btn">
                            Remove
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li className="nav-item noti-nav">
          <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
            <img src={Notification} alt="img" />
          </Link>
          <div className="notifications dropdown-menu dropdown-end dropdown-menu-right">
            <div className="topnav-dropdown-header">
              <span className="notification-title">
                Notifications
                <select>
                  <option>All</option>
                  <option>Unread</option>
                </select>
              </span>
              <Link to="#" className="clear-noti">
                Mark all as read <i className="fa-solid fa-circle-check" />
              </Link>
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                <li className="notification-message">
                  <div className="media d-flex">
                    <div>
                      <Link to="/page-notification" className="avatar">
                        <img
                          className="avatar-img"
                          alt=""
                          src={User1}
                        />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h6>
                        <Link to="/page-notification">
                          Lex Murphy requested <span>access to</span> UNIX directory
                          tree hierarchy{" "}
                        </Link>
                      </h6>
                      <button className="btn btn-accept">Accept</button>
                      <button className="btn btn-reject">Reject</button>
                      <p>Today at 9:42 AM</p>
                    </div>
                  </div>
                </li>
                <li className="notification-message">
                  <div className="media d-flex">
                    <div>
                      <Link to="/page-notification" className="avatar">
                        <img
                          className="avatar-img"
                          alt=""
                          src={User2}
                        />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h6>
                        <Link to="/page-notification">
                          Ray Arnold left 6 <span>comments on</span> Isla Nublar SOC2
                          compliance report
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
                        <img
                          className="avatar-img"
                          alt=""
                          src={User3}
                        />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h6>
                        <Link to="/page-notification">
                          Dennis Nedry <span>commented on</span> Isla Nublar SOC2
                          compliance report
                        </Link>
                      </h6>
                      <p className="noti-details">
                        “Oh, I finished de-bugging the phones, but the system&apos;s
                        compiling for eighteen minutes, or twenty. So, some minor
                        systems may go on and off for a while.”
                      </p>
                      <p>Yesterday at 5:42 PM</p>
                    </div>
                  </div>
                </li>
                <li className="notification-message">
                  <div className="media d-flex">
                    <div>
                      <Link to="/page-notification" className="avatar">
                        <img
                          className="avatar-img"
                          alt=""
                          src={User1}
                        />
                      </Link>
                    </div>
                    <div className="media-body">
                      <h6>
                        <Link to="/notifications">
                          John Hammond <span>created</span> Isla Nublar SOC2
                          compliance report{" "}
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
        <li className="nav-item user-nav">
          <Link to="#" className="dropdown-toggle" data-bs-toggle="dropdown">
            <span className="user-img">
              <img src={User11} alt="" />
              <span className="status online" />
            </span>
          </Link>
          <div
            className="users dropdown-menu dropdown-end dropdown-menu-right"
            data-popper-placement="bottom-end"
          >
            <div className="user-header">
              <div className="avatar avatar-sm">
                <img
                  src={User11}
                  alt="User Image"
                  className="avatar-img rounded-circle"
                />
              </div>
              <div className="user-text">
                <h6>Rolands R</h6>
                <p className="text-muted mb-0">Student</p>
              </div>
            </div>
            <Link className="dropdown-item" to="/setting-edit-profile">
              <FeatherIcon icon="user" className="me-1" /> Profile
            </Link>
            <Link className="dropdown-item" to="/student/setting-student-subscription">
              <FeatherIcon icon="star" className="me-1" /> Subscription
            </Link>

            <Link className="dropdown-item" to="/home">
              <FeatherIcon icon="log-out" className="me-1" /> Logout
            </Link>
          </div>
        </li>
      </ul>

    </>
  );
};

export default HeadModule;
