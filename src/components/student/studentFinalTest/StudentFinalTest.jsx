import React, { useEffect, useState } from "react";
import { FaClock } from 'react-icons/fa';
import { useParams } from "react-router-dom";
import api from "../../../untils/api";
import Footer from "../../footer";
import StudentHeader from "../header";

const StudentFinalTest = () => {
    const { testId } = useParams();
    const studentId = 1;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 phút
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await api.get(`/tests/${testId}/questions`);
            setQuestions(response.data);
        };
        fetchQuestions();
    }, [testId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(t => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOptionChange = (qId, optId, checked, type) => {
        setAnswers(prev => {
            const prevSelected = prev[qId] || [];
            let newSelected;
            if (type === 'SINGLE') {
                // Câu chọn 1 đáp án
                newSelected = [optId];
            } else {
                // Câu chọn nhiều đáp án (MULTIPLE)
                if (checked) {
                    // Thêm đáp án được chọn
                    newSelected = [...prevSelected, optId];
                } else {
                    // Bỏ đáp án khỏi danh sách
                    newSelected = prevSelected.filter(id => id !== optId);
                }
            }
            return { ...prev, [qId]: newSelected };
        });
    };

    const handleSubmit = async () => {
        const submission = {
            studentId: studentId,
            testId: parseInt(testId),
            answers: Object.keys(answers).map(qId => ({
                questionId: parseInt(qId),
                selectedOptionIds: answers[qId]
            }))
        };
        await api.post("/tests/submit", submission);
        window.location.href = "/student/student-quiz";
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const currentQuestion = questions[currentQuestionIndex];

    const goPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

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
                    {/* Top Black Bar */}
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
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>TIME LEFT IN 40m</div>
                    </div>

                    {/* Question Navigation Bar */}
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
                                    }}
                                >
                                    {idx + 1}
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

                    {/* Main Content */}
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

                        <div style={{ marginTop: '20px', textAlign: 'right', marginBottom: '20px' }}>
                            <button
                                onClick={handleSubmit}
                                disabled={timeLeft === 0}
                                style={{
                                    backgroundColor: timeLeft === 0 ? '#6c757d' : '#007bff',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: timeLeft === 0 ? 'not-allowed' : 'pointer',
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
        </div>
    );
};

export default StudentFinalTest;
