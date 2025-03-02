import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../footer";
import PageHeader from "../../student/header";

const Failure = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/home");
    };

    return (
        <div style={styles.pageWrapper}>
            <PageHeader activeMenu="Failure" />
            <div style={styles.contentWrapper}>
                <div style={styles.messageContainer}>
                    <h2 style={styles.failTitle}>Payment Cancelled or Failed</h2>
                    <p style={styles.messageText}>You have cancelled the payment or an error occurred.</p>
                    <button style={styles.button} onClick={handleGoHome}>
                        Go to Home
                    </button>
                </div>
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
    failTitle: {
        fontSize: "1.8rem",
        color: "#dc3545",
        marginBottom: "20px",
    },
    messageText: {
        fontSize: "1rem",
        color: "#333",
        marginBottom: "20px",
    },
    button: {
        display: "inline-block",
        padding: "10px 15px",
        fontSize: "1rem",
        color: "#fff",
        backgroundColor: "red",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        textDecoration: "none",
    },
};

export default Failure;
