import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudentCourses } from "../../../services/studentService";
import Footer from "../../footer";
import { Course10, Icon1, Icon2 } from "../../imagepath";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentStudy = () => {

  const [courses, setCourses] = useState({
    active: [],
    completed: [],
    enrolled: [],
  });

  const [hoursPerDayForCourse, setHoursPerDayForCourse] = useState({});

  const [deadlineForCourse, setDeadlineForCourse] = useState({});

  const [timeLeftForCourse, setTimeLeftForCourse] = useState({});

  const studentId = localStorage.getItem("studentId");

  const calculateDeadline = (duration, hoursPerDay) => {
    if (hoursPerDay < 1 || hoursPerDay > duration) return null;

    const totalDays = Math.ceil(duration / hoursPerDay);
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + totalDays);
    return deadlineDate;
  };

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const difference = deadline - now;
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const renderCountdown = (timeLeft) => {
    if (!timeLeft) return "Deadline passed!";
    return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
  };

  const saveDeadlineToLocalStorage = (courseId, deadline) => {
    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || {};
    deadlines[courseId] = deadline ? deadline.toISOString() : null;
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  };

  const getDeadlineFromLocalStorage = (courseId) => {
    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || {};
    return deadlines[courseId] ? new Date(deadlines[courseId]) : null;
  };

  const saveHoursToLocalStorage = (courseId, hours) => {
    const hoursData = JSON.parse(localStorage.getItem("hoursPerDayCourses")) || {};
    hoursData[courseId] = hours;
    localStorage.setItem("hoursPerDayCourses", JSON.stringify(hoursData));
  };

  const getHoursFromLocalStorage = (courseId) => {
    const hoursData = JSON.parse(localStorage.getItem("hoursPerDayCourses")) || {};
    return typeof hoursData[courseId] === "number" ? hoursData[courseId] : 0;
  };


  const handleReset = (courseId) => {
    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || {};
    const hoursData = JSON.parse(localStorage.getItem("hoursPerDayCourses")) || {};

    delete deadlines[courseId];
    hoursData[courseId] = 0;
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
    localStorage.setItem("hoursPerDayCourses", JSON.stringify(hoursData));

    setDeadlineForCourse((prev) => {
      const newDeadlines = { ...prev };
      delete newDeadlines[courseId];
      return newDeadlines;
    });

    setHoursPerDayForCourse((prev) => {
      const newHoursObj = { ...prev, [courseId]: 0 };
      return newHoursObj;
    });

    setTimeLeftForCourse((prev) => {
      const newTimeLeft = { ...prev };
      delete newTimeLeft[courseId];
      return newTimeLeft;
    });
  };

  useEffect(() => {
    const deadlines = JSON.parse(localStorage.getItem("deadlines")) || {};
    const hoursData = JSON.parse(localStorage.getItem("hoursPerDayCourses")) || {};

    const newDeadlineObj = {};
    Object.keys(deadlines).forEach((courseId) => {
      if (deadlines[courseId]) {
        newDeadlineObj[courseId] = new Date(deadlines[courseId]);
      }
    });
    setDeadlineForCourse(newDeadlineObj);

    const newHoursObj = {};
    Object.keys(hoursData).forEach((courseId) => {
      newHoursObj[courseId] = hoursData[courseId];
    });
    setHoursPerDayForCourse(newHoursObj);
  }, []);

  const handleHoursPerDayChange = (courseId, duration, hours) => {
    if (isNaN(hours) || hours < 0 || hours > duration) {
      hours = 0;
    }
    saveHoursToLocalStorage(courseId, hours);
    setHoursPerDayForCourse((prev) => ({ ...prev, [courseId]: hours }));

    if (hours === 0) {
      saveDeadlineToLocalStorage(courseId, null);
      setDeadlineForCourse((prev) => {
        const newDeadlines = { ...prev };
        delete newDeadlines[courseId];
        return newDeadlines;
      });
      return;
    }

    const newDeadline = calculateDeadline(duration, hours);
    if (newDeadline) {
      setDeadlineForCourse((prev) => {
        const newDeadlinesState = { ...prev, [courseId]: newDeadline };
        return newDeadlinesState;
      });
      saveDeadlineToLocalStorage(courseId, newDeadline);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftForCourse((prev) => {
        const newTimeLeftObj = { ...prev };
        Object.keys(deadlineForCourse).forEach((courseId) => {
          const dl = deadlineForCourse[courseId];
          if (dl) {
            newTimeLeftObj[courseId] = calculateTimeLeft(dl);
          }
        });
        return newTimeLeftObj;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineForCourse]);

  useEffect(() => {
    const fetchCoursesForStudent = async () => {
      try {
        if (studentId) {
          const response = await fetchStudentCourses(studentId);
          setCourses({
            active: response.active || [],
            completed: response.completed || [],
            enrolled: response.enrolled || [],
          });
        }
      } catch (error) {
        console.error("Error fetching student courses:", error);
      }
    };
    fetchCoursesForStudent();
  }, [studentId]);

  const renderCourses = (coursesList) => {
    return coursesList.map((course) => {
      const hoursValue =
        typeof hoursPerDayForCourse[course.id] === "number"
          ? hoursPerDayForCourse[course.id]
          : getHoursFromLocalStorage(course.id);

      let deadlineValue = deadlineForCourse[course.id];
      if (!deadlineValue) {
        const savedDeadline = getDeadlineFromLocalStorage(course.id);
        if (savedDeadline) {
          deadlineValue = savedDeadline;
        }
      }

      const timeLeftForThisCourse =
        deadlineValue && timeLeftForCourse[course.id] !== undefined
          ? timeLeftForCourse[course.id]
          : null;

      let deadlineElement = <p>No deadline set</p>;
      if (deadlineValue) {
        deadlineElement = (
          <p>
            Deadline: {renderCountdown(timeLeftForThisCourse)}
          </p>
        );
      }

      return (
        <div key={course.id} className="col-xl-4 col-lg-4 col-md-6 d-flex">
          <div className="course-box course-design d-flex">
            <div className="product">
              {/* Ảnh khoá học */}
              <div className="product-img">
                <Link to={`/course-details/${course.id}`}>
                  <img
                    className="img-fluid"
                    alt={course.titleCourse}
                    src={course.imageCover || Course10}
                  />
                </Link>
              </div>

              {/* Nội dung khóa học */}
              <div className="product-content">
                <h3 className="title instructor-text" title={course.titleCourse}>
                  <Link
                    to={`/course-details/${course.id}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    {course.titleCourse}
                  </Link>
                </h3>
                <div className="course-info d-flex align-items-center">
                  <div className="rating-img d-flex align-items-center">
                    <img src={Icon1} alt="" />
                    <p>{course.duration}+ Lessons</p>
                  </div>
                  <div className="course-view d-flex align-items-center">
                    <img src={Icon2} alt="" />
                    <p>{course.duration} hrs</p>
                  </div>
                </div>

                <div className="hours-day d-flex align-items-center">
                  <label style={{ marginRight: "5px" }}>Hours/Day:</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={hoursValue}
                    style={{ width: "60px" }}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "ArrowUp",
                        "ArrowDown",
                        "Tab",
                        "Backspace",
                        "Delete",
                      ];
                      if (!allowedKeys.includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      let newHours = parseInt(e.target.value, 10);
                      if (isNaN(newHours) || newHours < 0) {
                        newHours = 0;
                      }
                      handleHoursPerDayChange(course.id, course.duration, newHours);
                    }}
                  />
                  <button
                    onClick={() => handleReset(course.id)}
                    className="btn"
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#F04261",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Reset
                  </button>
                </div>

                {/* Thanh progress */}
                <div className="progress-stip mt-3">
                  <div
                    className="progress-bar bg-success progress-bar-striped active-stip"
                    role="progressbar"
                    style={{ width: `${course.progress || 0}%` }}
                    aria-valuenow={course.progress || 0}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <div className="student-percent">
                  <p>{course.progress || 0}% Completed</p>
                </div>

                {/* Nút Start Lesson */}
                <div className="start-leason hoverBlue d-flex align-items-center">
                  <Link
                    to={`/course-lesson/${course.id}?studentId=${studentId}`}
                    className="btn btn-primary"
                  >
                    Start Lesson
                  </Link>
                </div>

                {/* Deadline countdown (hoặc No deadline set) */}
                <div className="deadline-countdown mt-2">
                  {deadlineElement}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="main-wrapper">
      <StudentHeader activeMenu={"Studys"} />

      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Studys</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Studys
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
              <div className="container">
                <div className="student-widget">
                  <div className="student-widget-group">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="showing-list">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="show-filter choose-search-blk">
                                <form action="#">
                                  <div className="mycourse-student align-items-center">
                                    <div className="student-search">

                                    </div>
                                    <div className="student-filter">

                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ENROLLED COURSES */}
                        <div className="row">
                          <h3>Studying</h3>
                          {renderCourses(courses.enrolled)}
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
  );
};

export default StudentStudy;
