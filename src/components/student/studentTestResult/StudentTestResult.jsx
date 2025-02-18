import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
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
                console.error('❌ Lỗi khi lấy kết quả kiểm tra:', error);
                setError("Không thể lấy kết quả. Vui lòng thử lại!");
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [testId, studentId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    const { testTitle, marksObtained, percentage, passed, questions } = result;
    const statusIcon = passed ? <FaCheckCircle size={24} color="green" /> : <FaTimesCircle size={24} color="red" />;
    const statusText = passed ? "Passed" : "Failed";

    return (
        <div className="main-wrapper" style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <StudentHeader activeMenu={"Test Results"} />
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
                <div style={{ width: '80%', backgroundColor: 'white', borderRadius: '10px', padding: '40px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#333' }}>Test Results</h1>

                    {/* Thông tin tổng quan */}
                    <div style={{ marginTop: '30px' }}>
                        <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <p><strong>Test Name:</strong> {testTitle}</p>
                            <p><strong>Student ID:</strong> {studentId}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ fontSize: '1.2rem', color: '#333' }}>
                                <p><strong>Total Marks:</strong> {marksObtained}</p>
                                <p><strong>Percentage:</strong> {percentage}%</p>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '1.5rem', color: passed ? 'green' : 'red' }}>
                                <p>{statusIcon} {statusText}</p>
                            </div>
                        </div>

                        {/* Thanh tiến trình */}

                    </div>

                    {/* Danh sách chi tiết câu hỏi */}
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', color: '#333' }}>Question Details</h2>
                        <table className="table table-bordered mt-3">
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
                                {questions.map((question, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{question.type}</td>
                                        <td>{question.content}</td>
                                        <td>
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
                                        <td>
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

                    {/* Nút quay lại */}
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
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
                            }}
                        >
                            Back to Quiz
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StudentTestResult;
