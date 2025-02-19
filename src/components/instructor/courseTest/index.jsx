import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import AvailableQuestions from "./availableQuestions";
import {
  useManageTestsMutation,
} from "../../../redux/slices/test/testApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import { useGetInstructorCourseTestsQuery } from "../../../redux/slices/test/testApiSlice";

export const InstructorCourseTests = () => {

  const instructorId = useSelector(selectCurrentInstructor);
  const { courseId } = useParams();
  const {
    data: tests,
    isLoading,
    isError,
    refetch,
  } = useGetInstructorCourseTestsQuery({ id:instructorId, courseId:courseId });
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
    if (!currentTest.questions.find((q) => q.id === question.id)) {
      setCurrentTest({
        ...currentTest,
        questions: [...currentTest.questions, question],
      });
    }
  };

  const handleRemoveQuestion = (questionId) => {
    setCurrentTest({
      ...currentTest,
      questions: currentTest.questions.filter((q) => q.id !== questionId),
    });
  };

  const handleSaveTest = async () => {
    if (!currentTest.title.trim()) {
      alert("Test title is required.");
      return;
    }

    if (currentTest.questions.length === 0) {
      alert("Please select at least one question.");
      return;
    }
    try {
      const payload = {
        ...currentTest,
        courseId,
        duration: currentTest.duration * 60,
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
      duration: Math.floor(test.duration / 60),
    });
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
                  <ul className="list-group">
                    {tests.map((test) => (
                      <li
                        key={test.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <button
                          className="btn btn-link text-left"
                          onClick={() => handleSelectTest(test)}
                        >
                          {test.title}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteTest(test.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
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
                        Delete a test by clicking the &quot;Delete&quot; button
                        next to it.
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
                    <input
                      type="number"
                      className="form-control"
                      value={currentTest.totalMarks}
                      onChange={(e) =>
                        setCurrentTest({
                          ...currentTest,
                          totalMarks: parseInt(e.target.value, 10),
                        })
                      }
                    />
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
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                  {/* Selected Questions */}
                  <h5>Selected Questions:</h5>
                  <small>
                  Please select a question from the Available Questions below before clicking Save Test.
                  </small>
                  <ul>
                    {currentTest.questions.map((q) => (
                      <li key={q.id}>
                        {q.content}
                        <button
                          className="btn btn-danger btn-sm ml-2"
                          onClick={() => handleRemoveQuestion(q.id)}
                        >
                          Remove
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
