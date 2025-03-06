import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import AvailableQuestions from "./availableQuestions";
import {
  useManageTestsMutation,
  useUpdateFinalTestStatusMutation,
} from "../../../redux/slices/test/testApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import { useGetInstructorCourseTestsQuery } from "../../../redux/slices/test/testApiSlice";

export const InstructorCourseTests = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const instructorId = useSelector(selectCurrentInstructor);
  const { courseId } = useParams();
  const {
    data: tests,
    isLoading,
    isError,
    refetch,
  } = useGetInstructorCourseTestsQuery({
    id: instructorId,
    courseId: courseId,
  });
  const [updateFinalTestStatus] = useUpdateFinalTestStatusMutation();
  const [manageTests] = useManageTestsMutation();

  const [currentTest, setCurrentTest] = useState({
    title: "",
    description: "",
    totalMarks: 0,
    passPercentage: 0,
    duration: 0,
    statusTest: "ACTIVE",
    isFinalTest: false,
    questions: [],
  });

  const getQuestionRequirementMessage = () => {
    if (currentTest.totalMarks === 50) {
      return (
        <p className="text-danger">
          You have selected a 100 point question set. You need to select 4
          questions of 6 points, 2 questions of 8 points, and 1 question of 10
          points.
        </p>
      );
    } else if (currentTest.totalMarks === 100) {
      return (
        <p className="text-danger">
          You have selected a 50 point question set. You need to select 6
          questions of 6 points, 3 questions of 8 points, and 4 questions of 10
          points.
        </p>
      );
    } else {
      return (
        <p className="text-danger">Please select a valid total marks value.</p>
      );
    }
  };

  useEffect(() => {
    if (tests) {
      setCurrentTest({
        title: "",
        description: "",
        totalMarks: 0,
        passPercentage: 0,
        duration: 0,
        statusTest: "ACTIVE",
        isFinalTest: false,
        questions: [],
      });
    }
  }, [tests]);

  const handleAddQuestion = (question) => {
    if (!selectedQuestions.find((q) => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question]);
      setCurrentTest({
        ...currentTest,
        questions: [...currentTest.questions, question],
      });
    }
  };

  const handleRemoveQuestion = (questionId) => {
    const updatedQuestions = currentTest.questions.filter(
      (q) => q.id !== questionId
    );
    setCurrentTest({
      ...currentTest,
      questions: updatedQuestions,
    });

    // Cập nhật danh sách câu hỏi đã chọn
    setSelectedQuestions(updatedQuestions);
  };

  const handleSaveTest = async () => {
    if (!currentTest.title.trim()) {
      alert("Test title is required.");
      return;
    }

    if (currentTest.totalMarks === 0) {
      alert("Total Marks cannot be 0.");
      return;
    }
    if (currentTest.passPercentage === 0) {
      alert("Pass percentage is required.");
      return;
    }

    if (currentTest.passPercentage < 20 || currentTest.passPercentage > 100) {
      alert("Pass percentage must be between 20% and 100%.");
      return;
    }

    if (currentTest.duration === 0) {
      alert("Duration is required.");
      return;
    }

    if (currentTest.duration < 5 || currentTest.duration > 120) {
      alert("Duration must be between 5 and 120 minutes.");
      return;
    }

    if (currentTest.questions.length === 0) {
      alert("Please select questions.");
      return;
    }

    // Đếm số lượng câu hỏi theo điểm số
    const questionCounts = { 6: 0, 8: 0, 10: 0 };
    currentTest.questions.forEach((q) => {
      if (q.marks in questionCounts) {
        questionCounts[q.marks] += 1;
      }
    });

    // Kiểm tra số câu hỏi hợp lệ dựa trên tổng điểm
    if (currentTest.totalMarks === 50) {
      if (
        questionCounts[6] !== 4 ||
        questionCounts[8] !== 2 ||
        questionCounts[10] !== 1
      ) {
        alert(
          "For 50 total marks, you must select 4 questions of 6 marks, 2 questions of 8 marks, and 1 question of 10 marks."
        );
        return;
      }
    } else if (currentTest.totalMarks === 100) {
      if (
        questionCounts[6] !== 6 ||
        questionCounts[8] !== 3 ||
        questionCounts[10] !== 4
      ) {
        alert(
          "For 100 total marks, you must select 6 questions of 6 marks, 3 questions of 8 marks, and 4 questions of 10 marks."
        );
        return;
      }
    }

    try {
      const payload = {
        ...currentTest,
        courseId,
        duration: currentTest.duration,
        statusTest: currentTest.statusTest,
      };
      if (currentTest.id) {
        await manageTests({
          courseId,
          testId: currentTest.id,
          test: payload,
          method: "PUT",
        }).unwrap();
        alert("Test updated successfully!");
      } else {
        await manageTests({ courseId, test: payload, method: "POST" }).unwrap();
        alert("Test created successfully!");
        refetch();
      }
      setCurrentTest({
        title: "",
        description: "",
        totalMarks: 0,
        passPercentage: 0,
        duration: 0,
        isFinalTest: false,
        questions: [],
      });
    } catch (error) {
      console.error("Failed to save test:", error);
      alert("Failed to save test. Please try again.");
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      await manageTests({ courseId, testId, method: "DELETE" }).unwrap();
      alert("Test deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete test:", error);
      alert("Failed to delete test. Please try again.");
    }
  };

  const handleSelectTest = (test) => {
    setCurrentTest({
      ...test,
      duration: Math.floor(test.duration),
    });
  };

  const handleToggleFinalTest = async (testId, isFinal) => {
    try {
      await updateFinalTestStatus({ testId, isFinalTest: isFinal }).unwrap();

      alert(
        `Test ${isFinal ? "set as Final Test" : "removed from Final Test"}.`
      );
      refetch(); // Cập nhật danh sách bài kiểm tra
    } catch (error) {
      console.error("Failed to update Final Test status:", error);
      alert("Failed to update Final Test status. Please try again.");
    }
  };

  if (isLoading) return <p>Loading tests...</p>;
  if (isError) return <p>Error loading tests</p>;

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Manage Tests"} />

      <section className="page-content course-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="add-course-header">
                <h2>Manage Tests for Course {courseId}</h2>
                <div className="add-course-btns">
                  <Link
                    to="/instructor/instructor-dashboard"
                    className="btn btn-black"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Left Section: Available Tests */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5>Available Tests</h5>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      setCurrentTest({
                        title: "",
                        description: "",
                        totalMarks: 0,
                        passPercentage: 0,
                        duration: 0,
                        isFinalTest: false,
                        questions: [],
                      })
                    }
                  >
                    Add Test
                  </button>
                </div>
                <div className="card-body">
                {!tests.some((test) => test.isFinalTest) && (
    <div className="alert alert-warning" role="alert">
      ⚠️ You must select at least one Final Test.
    </div>
  )}
                  <ul className="list-group">
                    {tests.map((test) => {
                      return (
                        <li
                          key={test.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            {/* Nút chọn bài kiểm tra */}
                            <button
                              className="btn btn-link text-left"
                              onClick={() => handleSelectTest(test)}
                              disabled={test.isFinalTest}
                            >
                              {test.title}
                            </button>

                            {/* Checkbox để đánh dấu Final Test */}
                          </div>
                            <input
                              type="checkbox"
                              className="mx-2"
                              checked={test.isFinalTest}
                              onChange={() =>
                                handleToggleFinalTest(
                                  test.id,
                                  !test.isFinalTest
                                )
                              }
                            />
                            <label className="mb-0"> is final Test?</label>

                          {/* Nút xóa bài kiểm tra */}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTest(test.id)}
                            disabled={test.isFinalTest}
                          >
                            Delete
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div
                    className="test-guidelines mt-3 p-3"
                    style={{
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <h6>Guidelines:</h6>
                    <ul>
                      <li>Click on a test name to view or edit its details.</li>
                      <li>
                        Use the &quot;Add Test&quot; button to create a new
                        test.
                      </li>
                      <li>
                        Delete a test by clicking the &quot;✖&quot; button next
                        to it.
                      </li>
                      <li>
                        Ensure all fields are properly filled before saving a
                        test.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Test Details */}
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Test Details</h5>
                </div>
                <div className="card-body">
                  {/* Test Title */}
                  <div className="form-group">
                    <label>Test Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter test title"
                      value={currentTest.title}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Test Description */}
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter test description"
                      value={currentTest.description}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  {/* Total Marks */}
                  <div className="form-group">
                    <label>Total Marks</label>
                    <select
                      className="form-control"
                      value={currentTest.totalMarks}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          totalMarks: parseInt(e.target.value, 10),
                        })
                      }
                    >
                      <option value={0}>0</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Pass Percentage */}
                  <div className="form-group">
                    <label>Pass Percentage (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentTest.passPercentage}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          passPercentage: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>

                  {/* Duration */}
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentTest.duration}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          duration: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </div>

                  {/* Status Test */}
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={currentTest.statusTest}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          statusTest: e.target.value,
                        })
                      }
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  {/* Selected Questions */}
                  <h5>Selected Questions:</h5>
                  <small>
                    Please select a question from the Available Questions below
                    before clicking Save Test.
                  </small>
                  {/* Display Requirement Message */}
                  {getQuestionRequirementMessage()}
                  <ul>
                    {currentTest.questions.map((q) => (
                      <li key={q.id}>
                        <strong>({q.marks} marks)</strong> {q.content}
                        <button
                          className="btn btn-delete-article"
                          onClick={() => handleRemoveQuestion(q.id)}
                        >
                          ✖
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn btn-primary mt-3"
                    onClick={handleSaveTest}
                  >
                    Save Test
                  </button>
                </div>
              </div>

              {/* Available Questions */}
              <div className="card mt-3">
                <div className="card-header">
                  <h5>Available Questions</h5>
                </div>
                <div className="card-body">
                  <AvailableQuestions
                    courseId={courseId}
                    onAddQuestion={handleAddQuestion}
                    totalMarks={currentTest.totalMarks}
                    selectedQuestions={selectedQuestions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
