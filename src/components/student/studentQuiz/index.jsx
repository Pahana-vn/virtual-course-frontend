import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudentQuizResults } from "../../../services/studentService";
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentQuiz = () => {
  const studentId = localStorage.getItem("studentId"); // Lấy studentId từ localStorage
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizAttempts = async () => {
      try {
        const data = await fetchStudentQuizResults(studentId);
        setQuizAttempts(data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách bài kiểm tra:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizAttempts();
  }, [studentId]);

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"My Quiz Attempts"} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">My Quiz Attempts</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      My Quiz Attempts
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Breadcrumb */}

      {/* Page Content */}
      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* /Sidebar */}

            {/* Student Quiz */}
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>My Quiz Attempts</h3>
                  </div>

                  {loading ? (
                    <p>Loading...</p>
                  ) : quizAttempts.length === 0 ? (
                    <p>No quiz attempts found.</p>
                  ) : (
                    <div className="checkout-form">
                      <div className="table-responsive custom-table">
                        <table className="table table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>Quiz Title</th>
                              <th>Questions</th>
                              <th>Total Marks</th>
                              <th>Earned Marks</th>
                              <th>Percentage</th>
                              <th>Result</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quizAttempts.map((quiz, index) => (
                              <tr key={index}>
                                <td>{quiz.testTitle}</td>
                                <td>{quiz.totalQuestions}</td>
                                <td>{quiz.totalMarks}</td>
                                <td>{quiz.earnedMarks}</td>
                                <td>{quiz.percentage}%</td>
                                <td>
                                  <span className={`resut-badge ${quiz.passed ? 'badge-light-success' : 'badge-light-danger'}`}>
                                    {quiz.passed ? "Pass" : "Fail"}
                                  </span>
                                </td>
                                <td>
                                  <Link to={`/student/student-quiz-details/${quiz.quizId}`} className="btn btn-light-danger quiz-view">
                                    Details
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* /Student Quiz */}
          </div>
        </div>
      </div>
      {/* /Page Content */}

      <Footer />
    </div>
  );
};

export default StudentQuiz;
