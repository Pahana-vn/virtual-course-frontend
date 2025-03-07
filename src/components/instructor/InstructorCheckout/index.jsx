import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import { useRequestWithdrawalMutation } from "../../../redux/slices/instructor/instructorTransactionApiSlice";

const InstructorCheckout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("PAYPAL");
  const [amount, setAmount] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [requestWithdrawal] = useRequestWithdrawalMutation();

  const handlePayment = async (e) => {
    e.preventDefault();
  
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid withdrawal amount.", {
        position: "top-right",
      });
      return;
    }

    if (!amount || amount < 10) {
      toast.error("Please enter amount from 10 or more.", {
        position: "top-right",
      });
      return;
    }
  
    if (!recipientEmail) {
      toast.error("Please enter a valid recipient email.", {
        position: "top-right",
      });
      return;
    }
  
    try {
      setIsLoading(true);
      
      if (paymentMethod === "PAYPAL") {
        const response = await requestWithdrawal({
          amount: parseFloat(amount),
          recipientEmail,
          paymentMethod: paymentMethod.toUpperCase(),
        }).unwrap();
  
        toast.success("Withdrawal request successful! Transaction is being processed.", {
          position: "top-right",
        });
        
        // Nếu có URL xác nhận của PayPal, chuyển hướng người dùng
        if (response.approvalUrl) {
          window.location.href = response.approvalUrl;
        } else {
          navigate("/instructor/deposit-instructor-dashboard");
        }
      } else if (paymentMethod === "VNPAY") {
        toast.error("VNPay withdrawal is not implemented yet.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Withdrawal failed. Please try again.", {
        position: "top-right",
      });
    }finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
    <ToastContainer autoClose={3000} />
    <div className="main-wrapper">
      <style>
        {`
          .transaction-info {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .transaction-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .transaction-item h3 {
            font-size: 1.2rem;
            color: #333;
          }
          .transaction-item p {
            font-size: 1rem;
            color: #666;
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

      <InstructorHeader activeMenu="Checkout" />
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

      <section className="checkout-widget">
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
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input
                              type="number"
                              className="form-control"
                              id="amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              disabled={isLoading}
                              placeholder="Enter amount to withdraw"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label htmlFor="recipientEmail">Recipient Email</label>
                            <input
                              type="email"
                              className="form-control"
                              id="recipientEmail"
                              value={recipientEmail}
                              onChange={(e) => setRecipientEmail(e.target.value)}
                              disabled={isLoading}
                              placeholder="Enter recipient's email"
                            />
                          </div>
                        </div>
                        <div className="payment-btn pt-3">
                          <button className="btn btn-primary w-100" type="submit"
                          disabled={isLoading}
                          >
                            {isLoading ? "Processing..." : "Make a Payment"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Information */}
            <div className="col-lg-5 theiaStickySidebar">
              <div className="student-widget select-plan-group">
                <div className="student-widget-group">
                  <div className="plan-header">
                    <h4>Transaction Information</h4>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-item">
                      <h3>Amount</h3>
                      <p>{formatCurrency(amount)}</p>
                    </div>
                    <div className="transaction-item">
                      <h3>Payment Method</h3>
                      <p>{paymentMethod}</p>
                    </div>
                    <div className="transaction-item">
                      <h3>Recipient Email</h3>
                      <p>{recipientEmail}</p>
                    </div>
                    <h3 className="total-price">Total: {formatCurrency(amount)}</h3>
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

export default InstructorCheckout;
