import React, { useEffect, useState } from "react";
import { fetchStudentByAccountId } from "../../../services/studentService"; // Hàm API để lấy dữ liệu student
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentProfile = () => {
    const [studentData, setStudentData] = useState(null); // Dữ liệu student
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const accountId = 3; // Đặt accountId cứng, hoặc lấy từ context/auth nếu cần

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const data = await fetchStudentByAccountId(accountId); // Lấy thông tin từ API
                setStudentData(data); // Lưu dữ liệu vào state
                setLoading(false);
            } catch (error) {
                console.error("Error fetching student data:", error);
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [accountId]);

    if (loading) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    if (!studentData) {
        return <div>Không tìm thấy thông tin sinh viên!</div>; // Hiển thị khi không có dữ liệu
    }

    return (
        <>
            <div className="main-wrapper">
                <StudentHeader activeMenu={"My Profile"} />
                <div className="breadcrumb-bar breadcrumb-bar-info">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 col-12">
                                <div className="breadcrumb-list">
                                    <h2 className="breadcrumb-title">My Profile</h2>
                                    <nav aria-label="breadcrumb" className="page-breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/home">Home</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                My Profile
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="container">
                        <div className="row">
                            <StudentSidebar />
                            <div className="col-xl-9 col-lg-9">
                                <div className="settings-widget card-details mb-0">
                                    <div className="settings-menu p-0">
                                        <div className="profile-heading">
                                            <h3>My Profile</h3>
                                        </div>
                                        <div className="checkout-form personal-address">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>First Name</h6>
                                                        <p>{studentData.firstName}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>Last Name</h6>
                                                        <p>{studentData.lastName}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>User Name</h6>
                                                        <p>{studentData.username}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>Email</h6>
                                                        <p>{studentData.email || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>Phone Number</h6>
                                                        <p>{studentData.phone || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>Address</h6>
                                                        <p>{studentData.address || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>Date of Birth</h6>
                                                        <p>{studentData.dob ? new Date(studentData.dob).toLocaleDateString() : "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="contact-info">
                                                        <h6>Gender</h6>
                                                        <p>{studentData.gender || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div className="contact-info mb-0">
                                                        <h6>Bio</h6>
                                                        <p>{studentData.bio || "No bio provided."}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default StudentProfile;
