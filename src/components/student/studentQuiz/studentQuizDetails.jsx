import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchStudentQuizDetails } from '../../../services/studentService';
import Footer from '../../footer';
import StudentSidebar from "../../student/sidebar";
import StudentHeader from '../header';

const StudentQuizDetails = () => {
  const { quizId } = useParams(); // Lấy quizId từ URL
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuizDetails = async () => {
      try {
        const data = await fetchStudentQuizDetails(quizId);
        console.log("📌 API Response:", data); // Debug dữ liệu API
        setQuizDetails(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết bài kiểm tra:", err);
        setError("Không thể tải chi tiết bài kiểm tra. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    loadQuizDetails();
  }, [quizId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <div className="main-wrapper">
        <StudentHeader activeMenu={"My Quiz Attempts"} />

        {/* Breadcrumb */}
        <div className="breadcrumb-bar breadcrumb-bar-info">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="breadcrumb-list">
                  <h2 className="breadcrumb-title">Quiz Details</h2>
                  <nav aria-label="breadcrumb" className="page-breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                      <li className="breadcrumb-item"><Link to="/student/student-quiz">My Quiz Attempts</Link></li>
                      <li className="breadcrumb-item active" aria-current="page">Quiz Details</li>
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
                      <h3>Quiz Details</h3>
                    </div>

                    <div className="checkout-form">
                      <div className="quiz-details">
                        <Link to="/student/student-quiz" className="back-link">
                          <i className="bx bx-left-arrow-alt" /> Back
                        </Link>
                        <p><strong>Course:</strong> {quizDetails.courseName}</p>
                        <h6><strong>Quiz Title:</strong> {quizDetails.testTitle}</h6>
                        <ul>
                          <li><strong>Quiz Time:</strong> {quizDetails.duration} Minutes</li>
                          <li><strong>Submitted At:</strong> {quizDetails.date}</li>
                        </ul>
                      </div>

                      {/* Quiz Results Summary */}
                      <div className="table-quiz">
                        <div className="table-responsive custom-table">
                          <table className="table table-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>Total Marks</th>
                                <th>Pass Marks</th>
                                <th>Earned Marks</th>
                                <th>Percentage</th>
                                <th>Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{quizDetails.totalMarks}</td>
                                <td>{(quizDetails.totalMarks * 0.6).toFixed(2)} (60%)</td>
                                <td>{quizDetails.earnedMarks}</td>
                                <td>{quizDetails.percentage}%</td>
                                <td>
                                  <span className={`resut-badge ${quizDetails.passed ? 'badge-light-success' : 'badge-light-danger'}`}>
                                    {quizDetails.passed ? "Pass" : "Fail"}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Quiz Overview */}
                      <div className="quiz-overview">
                        <h6>Quiz Overview</h6>
                        <div className="table-responsive custom-table">
                          <table className="table table-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Type</th>
                                <th>Question</th>
                                <th>Given Answer</th>
                                <th>Correct Answer</th>
                                <th>Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quizDetails.questions.map((question, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{question.type}</td>
                                  <td>{question.content}</td>
                                  <td>
                                    {question.givenAnswers && question.givenAnswers.length > 0 ? (
                                      question.givenAnswers.map((ans, idx) => (
                                        <span key={idx} className={ans.isCorrect ? "text-success" : "text-danger"}>
                                          {ans.content}{idx < question.givenAnswers.length - 1 ? ", " : ""}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-warning">No Answer</span>
                                    )}
                                  </td>
                                  <td>
                                    {question.correctAnswers && question.correctAnswers.length > 0 ? (
                                      question.correctAnswers.map((ans, idx) => (
                                        <span key={idx} className="text-primary">
                                          {ans.content}{idx < question.correctAnswers.length - 1 ? ", " : ""}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-warning">N/A</span>
                                    )}
                                  </td>
                                  <td>
                                    <span className={`resut-badge ${question.correct ? 'badge-light-success' : 'badge-light-danger'}`}>
                                      {question.correct ? "Correct" : "Incorrect"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

export default StudentQuizDetails;
