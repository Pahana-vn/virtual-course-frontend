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
        <div className="main-wrapper">
            <PageHeader activeMenu="Failure" />
            <div className="container" style={{ minHeight: "70vh", padding: "50px 0" }}>
                <h2>Payment Cancelled or Failed</h2>
                <p>You have cancelled the payment or an error occurred.</p>
                <button className="btn btn-primary mt-3" onClick={handleGoHome}>
                    Go to Home
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default Failure;
