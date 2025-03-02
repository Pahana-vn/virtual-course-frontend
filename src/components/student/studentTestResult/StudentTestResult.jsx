import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import Footer from '../../footer';
import StudentHeader from '../header';

const StudentTestResult = () => {
    const { testId } = useParams();
    const studentId = localStorage.getItem('studentId');
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await api.get(`/tests/result/${testId}/student/${studentId}`);
                setResult(response.data);
            } catch (error) {
                console.error('Error getting test results:', error);
                setError("Unable to get results. Please try again!");
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [testId, studentId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    const { testTitle, studentLastname, studentFirstname, marksObtained, percentage, passed, questions } = result;
    const statusIcon = passed ? <FaCheckCircle size={48} color="green" /> : <FaTimesCircle size={48} color="red" />;
    const statusText = passed ? "Passed" : "Failed";

    return (
        <div className="main-wrapper" style={{
            fontFamily: 'Arial, sans-serif',
            minHeight: '100vh',
            backgroundImage: 'url(/path/to/your/background-image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            paddingTop: '50px',
            paddingBottom: '60px',
            boxSizing: 'border-box',
        }}>
            <StudentHeader activeMenu={"Test Results"} />
            <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}>
                <div style={{
                    width: '80%',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '40px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                }}>
                    <button
                        onClick={() => navigate("/student/student-quiz")}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                        }}
                    >
                        <FaArrowLeft /> Back to Quiz
                    </button>

                    <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#333', marginBottom: '20px' }}>Test Results</h1>

                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <p><strong>Test Name:</strong> {testTitle}</p>
                            <p><strong>Student:</strong> {studentLastname} {studentFirstname}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                backgroundColor: passed ? '#28a745' : '#dc3545',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                            }}>
                                {marksObtained}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '2rem', color: passed ? 'green' : 'red', fontWeight: 'bold' }}>
                            <p>{statusIcon} {statusText}</p>
                        </div>

                        {/* Thanh tiến trình */}
                        <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                            <div style={{
                                width: `${percentage}%`,
                                backgroundColor: passed ? '#28a745' : '#dc3545',
                                height: '20px',
                                borderRadius: '10px',
                                transition: 'width 0.5s ease',
                            }}></div>
                        </div>
                    </div>

                    {/* Danh sách chi tiết câu hỏi */}
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', color: '#333', marginBottom: '20px' }}>Question Details</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table table-bordered mt-3" style={{ minWidth: '600px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '50px' }}>No</th>
                                        <th style={{ minWidth: '100px' }}>Type</th>
                                        <th style={{ minWidth: '200px' }}>Question</th>
                                        <th style={{ minWidth: '200px' }}>Given Answer</th>
                                        <th style={{ minWidth: '200px' }}>Correct Answer</th>
                                        <th style={{ minWidth: '100px' }}>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map((question, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{question.type}</td>
                                            <td>{question.content}</td>
                                            <td style={{ maxWidth: '200px', overflowX: 'auto' }}>
                                                {question.givenAnswers.length > 0 ? (
                                                    question.givenAnswers.map((ans, idx) => (
                                                        <span key={idx} className={ans.isCorrect ? "text-success" : "text-danger"}>
                                                            {ans.content}{idx < question.givenAnswers.length - 1 ? ", " : ""}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-warning">⚠ No Answer</span>
                                                )}
                                            </td>
                                            <td style={{ maxWidth: '200px', overflowX: 'auto' }}>
                                                {question.correctAnswers.length > 0 ? (
                                                    question.correctAnswers.map((ans, idx) => (
                                                        <span key={idx} className="text-primary">
                                                            {ans.content}{idx < question.correctAnswers.length - 1 ? ", " : ""}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-warning">⚠ N/A</span>
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
            <Footer />
        </div>
    );
};

export default StudentTestResult;