import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentLearningSchedule = () => {
    const purchasedCourses = [
        { courseId: 101, name: "React Basics" },
        { courseId: 102, name: "Advanced Angular" },
        { courseId: 103, name: "JavaScript Essentials" },
    ];

    const [schedule, setSchedule] = useState(
        JSON.parse(localStorage.getItem("schedule")) || [
            {
                id: 1,
                courseId: 101,
                dailyHours: 2,
                preferredStartTime: "10:00 AM",
                preferredEndTime: "12:00 PM",
                targetCompletionDate: "2024-12-31",
                timeSpent: 0,
            },
            {
                id: 2,
                courseId: 102,
                dailyHours: 3,
                preferredStartTime: "01:00 PM",
                preferredEndTime: "04:00 PM",
                targetCompletionDate: "2025-01-15",
                timeSpent: 0,
            },
        ]
    );

    const [newSession, setNewSession] = useState({
        courseId: "",
        dailyHours: "",
        preferredStartTime: "",
        preferredEndTime: "",
        targetCompletionDate: "",
    });

    const [activeSession, setActiveSession] = useState(
        JSON.parse(localStorage.getItem("activeSession")) || null
    );
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let timer;
        if (activeSession) {
            const remainingTime = new Date(activeSession.endTime) - new Date();
            if (remainingTime > 0) {
                setTimeLeft(Math.floor(remainingTime / 1000));
                timer = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            completeSession();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                completeSession();
            }
        }
        return () => clearInterval(timer);
    }, [activeSession]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSession({ ...newSession, [name]: value });
    };

    const addSession = () => {
        if (!newSession.courseId) return alert("Please select a course!");
        const newId = schedule.length + 1;
        const updatedSchedule = [
            ...schedule,
            {
                id: newId,
                timeSpent: 0,
                ...newSession,
            },
        ];
        setSchedule(updatedSchedule);
        localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
        setNewSession({
            courseId: "",
            dailyHours: "",
            preferredStartTime: "",
            preferredEndTime: "",
            targetCompletionDate: "",
        });
    };

    const startSession = (session) => {
        const totalTime = session.dailyHours * 3600; // Convert hours to seconds
        const endTime = new Date(Date.now() + totalTime * 1000).toISOString();
        const active = { ...session, endTime };
        setActiveSession(active);
        setTimeLeft(totalTime);
        localStorage.setItem("activeSession", JSON.stringify(active));
    };

    const stopSession = () => {
        const elapsedTime = activeSession.dailyHours * 3600 - timeLeft;
        const updatedSchedule = schedule.map((session) =>
            session.id === activeSession.id
                ? { ...session, timeSpent: session.timeSpent + elapsedTime }
                : session
        );
        setSchedule(updatedSchedule);
        localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
        setActiveSession(null);
        localStorage.removeItem("activeSession");
        setTimeLeft(0);
    };

    const deleteSession = (id) => {
        const updatedSchedule = schedule.filter((session) => session.id !== id);
        setSchedule(updatedSchedule);
        localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
    };

    const completeSession = () => {
        alert(`You have completed your session for the course: ${activeSession.courseId}!`);
        stopSession();
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="main-wrapper">
            <StudentHeader activeMenu={"Learning Schedule"} />
            <div className="breadcrumb-bar breadcrumb-bar-info">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-12">
                            <div className="breadcrumb-list">
                                <h2 className="breadcrumb-title">Your Learning Schedule</h2>
                                <nav aria-label="breadcrumb" className="page-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/home">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Learning Schedule
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
                            <div className="settings-widget card-details">
                                <div className="settings-menu p-0">
                                    <div className="profile-heading">
                                        <h3>Your Learning Schedule</h3>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Daily Study Hours</th>
                                                    <th>Preferred Time</th>
                                                    <th>Target Completion Date</th>
                                                    <th>Time Spent</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {schedule.map((session) => (
                                                    <tr key={session.id}>
                                                        <td>
                                                            {
                                                                purchasedCourses.find(
                                                                    (c) => c.courseId === session.courseId
                                                                )?.name
                                                            }
                                                        </td>
                                                        <td>{session.dailyHours} hours</td>
                                                        <td>
                                                            {session.preferredStartTime} - {session.preferredEndTime}
                                                        </td>
                                                        <td>{session.targetCompletionDate}</td>
                                                        <td>{(session.timeSpent / 3600).toFixed(2)} hrs</td>
                                                        <td>
                                                            {activeSession?.id === session.id ? (
                                                                <button
                                                                    className="btn btn-danger btn-sm m-1"
                                                                    onClick={stopSession}
                                                                >
                                                                    Stop Session
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-warning btn-sm m-1"
                                                                    onClick={() => startSession(session)}
                                                                >
                                                                    Start Session
                                                                </button>
                                                            )}
                                                            <button
                                                                className="btn btn-danger btn-sm ml-2 m-1"
                                                                onClick={() => deleteSession(session.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4">
                                        <h5>Add a New Session</h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <select
                                                    className="form-control mb-2"
                                                    name="courseId"
                                                    value={newSession.courseId}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Select Course</option>
                                                    {purchasedCourses.map((course) => (
                                                        <option key={course.courseId} value={course.courseId}>
                                                            {course.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="number"
                                                    className="form-control mb-2"
                                                    placeholder="Daily Study Hours"
                                                    name="dailyHours"
                                                    value={newSession.dailyHours}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="time"
                                                    className="form-control mb-2"
                                                    name="preferredStartTime"
                                                    value={newSession.preferredStartTime}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="time"
                                                    className="form-control mb-2"
                                                    name="preferredEndTime"
                                                    value={newSession.preferredEndTime}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="date"
                                                    className="form-control mb-2"
                                                    name="targetCompletionDate"
                                                    value={newSession.targetCompletionDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={addSession}
                                                >
                                                    Add Session
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {activeSession && (
                                    <div className="mt-4 text-center">
                                        <h5>Active Session: {activeSession.courseId}</h5>
                                        <h3>
                                            Time Left: {formatTime(timeLeft)}
                                        </h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};
export default StudentLearningSchedule;