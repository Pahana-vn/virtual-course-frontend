import React, { useEffect, useState } from "react";
import { FaCheck, FaClock } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import Footer from "../../footer";
import StudentHeader from "../header";

const StudentFinalTest = () => {
    const { testId } = useParams();
    const studentId = localStorage.getItem('studentId');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 phút
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Biến để kiểm tra bài đã nộp chưa

    // Fetch danh sách câu hỏi
    useEffect(() => {
        if (!testId) return;

        const fetchQuestions = async () => {
            try {
                const response = await api.get(`/questions/test/${testId}`);
                setQuestions(response.data);
            } catch (error) {
                console.error("Error when getting list of questions:", error);
            }
        };

        fetchQuestions();
    }, [testId]);

    // Đếm ngược thời gian
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(t => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Tự động nộp bài khi hết thời gian
    useEffect(() => {
        if (timeLeft === 0 && !isSubmitted) {
            handleSubmit(); // Gọi hàm nộp bài
        }
    }, [timeLeft, isSubmitted]);

    // Xử lý thay đổi lựa chọn câu trả lời
    const handleOptionChange = (qId, optId, checked, type) => {
        setAnswers(prev => {
            const prevSelected = prev[qId] || [];
            let newSelected;
            if (type === 'SINGLE') {
                newSelected = [optId];
            } else {
                if (checked) {
                    newSelected = [...prevSelected, optId];
                } else {
                    newSelected = prevSelected.filter(id => id !== optId);
                }
            }
            return { ...prev, [qId]: newSelected };
        });
    };

    // Hàm nộp bài
    const handleSubmit = async () => {
        if (isSubmitted) return; // Nếu đã nộp rồi thì không làm gì cả
        setIsSubmitted(true); // Đánh dấu là đã nộp

        const submission = {
            studentId: parseInt(studentId),
            testId: parseInt(testId),
            answers: Object.keys(answers).map(qId => ({
                questionId: parseInt(qId),
                selectedOptionIds: answers[qId] || []
            }))
        };

        console.log("Data sent up:", submission);

        try {
            await api.post("/tests/submit", submission);
            navigate(`/student/test-result/${testId}`);
        } catch (error) {
            console.error("Error when submitting assignment:", error.response?.data || error);
        }
    };

    // Tính toán thời gian còn lại
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const currentQuestion = questions[currentQuestionIndex];

    // Điều hướng câu hỏi trước đó
    const goPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Điều hướng câu hỏi tiếp theo
    const goNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    return (
        <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <StudentHeader activeMenu={"Final Test"} />
            <div
                style={{
                    fontFamily: 'Arial, sans-serif',
                    backgroundColor: '#f8f9fa',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '80px',
                }}
            >
                <div style={{ width: '80%' }}>
                    {/* Thanh thời gian */}
                    <div
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '1rem',
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ALL PROBLEMS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaClock size={20} style={{ color: 'white' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#fff' }}>
                                {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
                            </span>
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>TIME LEFT IN 60m</div>
                    </div>

                    {/* Thanh điều hướng câu hỏi */}
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #dee2e6',
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <button
                            onClick={goPrev}
                            disabled={currentQuestionIndex === 0}
                            style={{
                                backgroundColor: currentQuestionIndex === 0 ? '#ccc' : '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            PREV
                        </button>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '50%',
                                        backgroundColor: idx === currentQuestionIndex ? '#007bff' : '#e9ecef',
                                        color: idx === currentQuestionIndex ? '#fff' : '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        position: 'relative',
                                    }}
                                >
                                    {idx + 1}
                                    {answers[questions[idx].id]?.length > 0 && (
                                        <FaCheck
                                            style={{
                                                position: 'absolute',
                                                bottom: '0',
                                                right: '0',
                                                color: 'green',
                                                fontSize: '0.8rem',
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={goNext}
                            disabled={currentQuestionIndex === questions.length - 1 || questions.length === 0}
                            style={{
                                backgroundColor: currentQuestionIndex === questions.length - 1 || questions.length === 0 ? '#ccc' : '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                cursor: currentQuestionIndex === questions.length - 1 || questions.length === 0 ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            NEXT
                        </button>
                    </div>

                    {/* Nội dung câu hỏi */}
                    <div style={{ flex: '1', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        {currentQuestion ? (
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    flex: '1',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '40px',
                                }}
                            >
                                <div style={{ flex: '1', borderRight: '1px solid #dee2e6', paddingRight: '20px' }}>
                                    <h5 style={{ color: '#495057', marginBottom: '10px', fontWeight: 'bold' }}>DESCRIPTION</h5>
                                    <p style={{ color: '#343a40', fontSize: '1.1rem', lineHeight: '1.5' }}>{currentQuestion.content}</p>
                                </div>

                                <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                                    <h5 style={{ marginBottom: '15px', color: '#495057', fontWeight: 'bold' }}>Answer choices</h5>
                                    {currentQuestion.answerOptions.map(opt => (
                                        <label
                                            key={opt.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#f8f9fa',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                marginBottom: '10px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <input
                                                type={currentQuestion.type === 'SINGLE' ? 'radio' : 'checkbox'}
                                                name={`q-${currentQuestion.id}`}
                                                checked={answers[currentQuestion.id]?.includes(opt.id) || false}
                                                onChange={(e) => handleOptionChange(currentQuestion.id, opt.id, e.target.checked, currentQuestion.type)}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <span style={{ fontSize: '1rem', color: '#343a40' }}>{opt.content}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '50px' }}>No questions available.</div>
                        )}

                        {/* Nút nộp bài */}
                        <div style={{ marginTop: '20px', textAlign: 'right', marginBottom: '20px' }}>
                            <button
                                onClick={() => setShowConfirmationModal(true)}
                                disabled={timeLeft === 0 || isSubmitted}
                                style={{
                                    backgroundColor: timeLeft === 0 || isSubmitted ? '#6c757d' : '#007bff',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: timeLeft === 0 || isSubmitted ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                }}
                            >
                                Complete submission
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Modal xác nhận nộp bài */}
            {showConfirmationModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            width: '400px',
                            textAlign: 'center',
                        }}
                    >
                        <h3 style={{ marginBottom: '20px', color: '#495057' }}>Are you sure you want to submit?</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmationModal(false);
                                    handleSubmit();
                                }}
                                style={{
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFinalTest;