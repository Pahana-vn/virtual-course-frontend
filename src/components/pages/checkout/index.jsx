import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Footer from "../../footer";
import PageHeader from "../../student/header/index";

const Checkout = () => {

  const [value3] = useState(null);
  const [value4] = useState(null);

  const options3 = [
    { label: "Month", value3: "" },
    { label: "Jun", value3: "Jun" },
    { label: "Feb", value3: "Feb" },
    { label: "March", value3: "March" }
  ];

  const options4 = [
    { label: "Year", value4: "" },
    { label: "2024", value4: "2024" },
    { label: "2021", value4: "2021" },
    { label: "2020", value4: "2020" },
  ];


  return (
    <>
      <div className="main-wrapper">
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
              <div className="col-lg-8">

                <div className="student-widget">
                  <div className="student-widget-group add-course-info">
                    <div className="cart-head">
                      <h4>Payment Method</h4>
                    </div>
                    <div className="checkout-form">
                      <form action="cart">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="wallet-method">
                              <label className="radio-inline custom_radio me-4">
                                <input
                                  type="radio"
                                  name="optradio"
                                  defaultChecked="true"
                                />
                                <span className="checkmark" /> VNPay

                              </label>
                              <label className="radio-inline custom_radio">
                                <input type="radio" name="optradio" />
                                <span className="checkmark" /> PayPal
                              </label>
                            </div>
                            <div className="input-block">
                              <label className="form-control-label">
                                Card Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="XXXX XXXX XXXX XXXX"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-block">
                              <label className="form-label">Month</label>
                              <Select
                                options={options3}
                                defaultValue={value3}
                                placeholder="Month"
                              ></Select>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-block">
                              <label className="form-label">Year</label>
                              <Select
                                options={options4}
                                defaultValue={value4}
                                placeholder="Year"
                              ></Select>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="input-block">
                              <label className="form-control-label">
                                CVV Code{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="XXXX"
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="input-block">
                              <label className="form-control-label">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Address"
                              />
                            </div>
                          </div>
                          <div className="col-md-12 col-lg-10">
                            <div className="input-block ship-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="remember"
                              />{" "}
                              Remember this card
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
                {/* /Payment Method */}

              </div>

              <div className="col-lg-4 theiaStickySidebar">
                <div className="stickysidebar">
                  <div className="student-widget select-plan-group">
                    <div className="student-widget-group">
                      <div className="plan-header">
                        <h4>Course Details</h4>
                      </div>
                      <div className="course-plan">
                        <h3>UX/UI Design Mastery</h3>
                        <p>
                          Comprehensive training to become a professional UX/UI designer with
                          practical projects.
                        </p>
                        <p>Duration: 20 hours of on-demand video</p>
                        <h2>
                          <span>$</span>49
                        </h2>
                      </div>
                      <div className="benifits-feature">
                        <h3>What you will get:</h3>
                        <ul>
                          <li>
                            <i className="fas fa-circle" /> 11 hours of on-demand video
                          </li>
                          <li>
                            <i className="fas fa-circle" /> 69 downloadable resources
                          </li>
                          <li>
                            <i className="fas fa-circle" /> Full lifetime access
                          </li>
                          <li>
                            <i className="fas fa-circle" /> Access on mobile and TV
                          </li>
                          <li>
                            <i className="fas fa-circle" /> Certificate of Completion
                          </li>
                        </ul>
                      </div>
                      <div className="benifits-feature">
                        <h3>Key Features:</h3>
                        <ul>
                          <li>
                            <i className="fas fa-circle" /> Beginner-friendly curriculum
                          </li>
                          <li>
                            <i className="fas fa-circle" /> Practical hands-on projects
                          </li>
                          <li>
                            <i className="fas fa-circle" /> Learn Adobe XD essentials
                          </li>
                          <li>
                            <i className="fas fa-circle" /> Step-by-step guidance for
                            wireframing
                          </li>
                        </ul>
                      </div>
                      <div className="plan-change">
                        <Link to="/checkout" className="btn btn-primary">
                          Enroll Now
                        </Link>
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

export default Checkout;
