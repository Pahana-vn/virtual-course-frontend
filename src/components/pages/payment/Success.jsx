import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../footer";
import PageHeader from "../../student/header";

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, fail

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get("paymentId");
        const payerId = queryParams.get("PayerID");

        if (paymentId && payerId) {
            setStatus("success");
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
                {status === "loading" && (
                    <div style={styles.messageContainer}>
                        <p>Processing your payment, please wait...</p>
                    </div>
                )}
                {status === "success" && (
                    <div style={styles.messageContainer}>
                        <h2 style={styles.successTitle}>Payment Successful!</h2>
                        <p>Your transaction was completed successfully.</p>
                        <button style={styles.button} onClick={handleGoHome}>
                            Go to Home
                        </button>
                    </div>
                )}
                {status === "fail" && (
                    <div style={styles.messageContainer}>
                        <h2 style={styles.failTitle}>Payment Failed</h2>
                        <p>There was an issue completing your transaction. Please try again.</p>
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
        minHeight: "calc(100vh - 200px)",
    },
    messageContainer: {
        textAlign: "center",
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "500px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
    button: {
        padding: "12px 20px",
        fontSize: "1rem",
        color: "#fff",
        backgroundColor: "red",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "20px",
        textDecoration: "none",
    },
};


export default Success;
