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
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get("paymentId");
        const payerId = queryParams.get("PayerID");

        if (paymentId && payerId) {
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
            setStatus("fail");
        }
    }, [location.search]);

    const handleGoHome = () => {
        navigate("/home");
    };

    return (
        <div style={styles.pageWrapper}>
            <PageHeader activeMenu="Success" />
            <div style={styles.contentWrapper}>
                {status === "loading" && <p>Processing your payment, please wait...</p>}
                {status === "success" && (
                    <div style={styles.messageContainer}>
                        <h2 style={styles.successTitle}>Payment Successful!</h2>
                        {paymentData && (
                            <div style={styles.paymentInfo}>
                                <p>Payment ID: {paymentData.paypalPaymentId}</p>
                                <p>Status: {paymentData.status}</p>
                                <p>Amount: ${paymentData.amount}</p>
                            </div>
                        )}
                        <button style={styles.button} onClick={handleGoHome}>
                            Go to Home
                        </button>
                    </div>
                )}
                {status === "fail" && (
                    <div style={styles.messageContainer}>
                        <h2 style={styles.failTitle}>Payment Failed</h2>
                        <p>There was a problem completing your payment.</p>
                        <button style={styles.button} onClick={handleGoHome}>
                            Go to Home
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
    contentWrapper: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f4f4f9",
    },
    messageContainer: {
        textAlign: "center",
        backgroundColor: "#ffffff",
        padding: "30px 20px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        width: "100%",
    },
    successTitle: {
        fontSize: "1.8rem",
        color: "#28a745",
        marginBottom: "20px",
    },
    failTitle: {
        fontSize: "1.8rem",
        color: "#dc3545",
        marginBottom: "20px",
    },
    paymentInfo: {
        marginTop: "20px",
        fontSize: "1rem",
        color: "#333",
    },
    button: {
        display: "inline-block",
        padding: "10px 15px",
        fontSize: "1rem",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px",
        textDecoration: "none",
    },
};

export default Success;