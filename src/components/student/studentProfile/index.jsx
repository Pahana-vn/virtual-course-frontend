import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentByStudentId } from "../../../services/studentService";
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentProfile = () => {
    const { studentId: urlStudentId } = useParams();
    const [studentData, setStudentData] = useState({});

    const studentId = urlStudentId || localStorage.getItem("studentId");

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) {
                console.error("Student ID not found!");
                return;
            }
            try {
                const data = await fetchStudentByStudentId(studentId);
                setStudentData(data || {});
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };
        fetchStudentData();
    }, [studentId]);

    return (
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
                                            {studentId ? (
                                                <>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>First Name</h6>
                                                            <p>{studentData.firstName || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>Last Name</h6>
                                                            <p>{studentData.lastName || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>User Name</h6>
                                                            <p>{studentData.username || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>Email</h6>
                                                            <p>{studentData.email || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>Phone Number</h6>
                                                            <p>{studentData.phone || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>Address</h6>
                                                            <p>{studentData.address || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>Date of Birth</h6>
                                                            <p>{studentData.dob ? new Date(studentData.dob).toLocaleDateString() : "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="contact-info">
                                                            <h6>Gender</h6>
                                                            <p>{studentData.gender || "No information"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <div className="contact-info mb-0">
                                                            <h6>Bio</h6>
                                                            <p>{studentData.bio || "No bio provided."}</p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="col-sm-12">
                                                    <p>Student information not found!</p>
                                                </div>
                                            )}
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
    );
};

export default StudentProfile;
