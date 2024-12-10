import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { executePaypalPayment } from "../../../services/paymentService";
import Footer from "../../footer";
import PageHeader from "../../student/header";

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, fail
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        // Lấy query param từ URL: paymentId, PayerID, token (token nếu cần)
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get("paymentId");
        const payerId = queryParams.get("PayerID");

        if (paymentId && payerId) {
            // Gọi API execute payment
            executePaypalPayment(paymentId, payerId)
                .then((data) => {
                    setPaymentData(data);
                    setStatus("success");
                })
                .catch((error) => {
                    console.error("Error executing payment:", error);
                    setStatus("fail");
                });
        } else {
            // Không có paymentId hoặc payerId, coi như fail
            setStatus("fail");
        }
    }, [location.search]);

    const handleGoHome = () => {
        navigate("/home");
    };

    return (
        <div className="main-wrapper">
            <PageHeader activeMenu="Success" />
            <div className="container" style={{ minHeight: "70vh", padding: "50px 0" }}>
                {status === "loading" && <p>Processing your payment, please wait...</p>}
                {status === "success" && (
                    <>
                        <h2>Payment Successful!</h2>
                        {paymentData && (
                            <div style={{ marginTop: "20px" }}>
                                <p>Payment ID: {paymentData.paypalPaymentId}</p>
                                <p>Status: {paymentData.status}</p>
                                <p>Amount: ${paymentData.amount}</p>
                            </div>
                        )}
                        <button className="btn btn-primary mt-3" onClick={handleGoHome}>
                            Go to Home
                        </button>
                    </>
                )}
                {status === "fail" && (
                    <>
                        <h2>Payment Failed</h2>
                        <p>There was a problem completing your payment.</p>
                        <button className="btn btn-primary mt-3" onClick={handleGoHome}>
                            Go to Home
                        </button>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Success;
