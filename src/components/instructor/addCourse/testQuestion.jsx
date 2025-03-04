import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import Popup from "./popup";
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswerOption,
  updateAnswerOption,
  deleteAnswerOption,
  clearQuestionInfo,
  setQuestionInfo,
} from "../../../redux/slices/course/courseSlice";
import "./Curriculum.css";

const TestQuestion = ({ nextTab4, prevTab3, isEditing }) => {
  const dispatch = useDispatch();
  const { questions } = useSelector(
    (state) => state.course.questionInfo || { questions: [] }
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupAction, setPopupAction] = useState(() => () => {});

  const handleOpenPopup = (title, action, defaultValue = "") => {
    setPopupTitle(title);
    setPopupAction(() => action);
    setPopupInput(defaultValue);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupInput("");
  };

  const handleSavePopup = () => {
    if (popupInput.trim()) {
      popupAction(popupInput);
      handleClosePopup();
    } else {
      alert("Input cannot be empty.");
    }
  };

  const generateUniqueId = () => {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const questionMarks = [
    { mark: 10, content: "10-Point Questions" },
    { mark: 8, content: "8-Point Questions" },
    { mark: 6, content: "6-Point Questions" },
  ];

  const handleAddQuestion = (mark, title) => {
    dispatch(
      addQuestion({
        id: generateUniqueId(),
        title,
        mark,
        answerOptions: [],
      })
    );
  };

  const handleUpdateQuestion = (questionId, newTitle) => {
    dispatch(updateQuestion({ id: questionId, title: newTitle }));
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteQuestion({ id: questionId }));
    }
  };

  const handleAddAnswerOption = (questionId, title) => {
    const question = questions.find((q) => q.id === questionId);
    const currentAnswerOptions = question?.answerOptions || [];
    const newAnswerOption = {
      id: generateUniqueId(),
      title: title || "Untitled Option",
      isCorrect: currentAnswerOptions.length === 0,
    };
    dispatch(addAnswerOption({ questionId, answerOption: newAnswerOption }));
  };

  const handleUpdateAnswerOption = (questionId, answerId, updatedAnswer) => {
    dispatch(
      updateAnswerOption({
        questionId,
        answerId,
        answerOption: updatedAnswer,
      })
    );
  };

  const handleDeleteAnswerOption = (questionId, answerId) => {
    dispatch(
      deleteAnswerOption({
        questionId,
        answerId,
      })
    );
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    dispatch(clearQuestionInfo());

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      chunkSize: 100,
      chunk: async (result, parser) => {
        parser.pause();
        await processCSVChunk(result.data);
        parser.resume();
      },
      complete: (result) => {
        console.log("CSV Import Completed!");
        console.log("Raw Parsed Data:", result.data);
      },
    });
  };

  const processCSVChunk = async (dataChunk) => {
    return new Promise((resolve) => {
      const formattedQuestions = dataChunk.map((row, index) => {
        if (!row["Question Title"] || !row["Mark"]) return null;

        const answerOptions = Object.keys(row)
          .filter((key) => key.startsWith("Answer"))
          .map((key, i) => ({
            id: `${Date.now()}-${index}-${i}`,
            title: row[key].replace("(correct)", "").trim(),
            isCorrect: row[key].includes("(correct)"),
          }))
          .filter((ans) => ans.title !== ""); // Bỏ các dòng trống

        return {
          id: generateUniqueId(),
          title: row["Question Title"],
          mark: parseInt(row["Mark"], 10) || 10,
          answerOptions,
        };
      }).filter(Boolean);

      dispatch(setQuestionInfo({ questions: formattedQuestions }));
      resolve();
    });
  };

  const handleExportCSV = () => {
    if (questions.length === 0) {
      alert("No questions available to export.");
      return;
    }

    const csvData = [
      ["Question Title", "Mark", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5"],
      ...questions.map((q) => [
        q.title,
        q.mark,
        ...q.answerOptions.map((opt) => `${opt.title}${opt.isCorrect ? " (correct)" : ""}`),
      ]),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSampleCSV = () => {
    const sampleData = [
      {
        "Question Title": "What is Java?",
        "Mark": "10",
        "Answer 1": "A programming language (correct)",
        "Answer 2": "A fruit",
        "Answer 3": "A coffee",
        "Answer 4": "",
        "Answer 5": "",
      },
      {
        "Question Title": "Which of these are programming languages?",
        "Mark": "8",
        "Answer 1": "Java (correct)",
        "Answer 2": "Python (correct)",
        "Answer 3": "HTML",
        "Answer 4": "CSS",
        "Answer 5": "",
      },
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_questions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <>
      <fieldset className="field-card" style={{ display: "block" }}>
        <div className="add-course-info">
          <div className="d-flex justify-content-between align-items-center">
            <div className="add-course-inner-header">
              <h4>Test Questions</h4>
            </div>

            <div className="import-section mx-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                style={{ display: "none" }}
                id="csvUpload"
              />
              <label htmlFor="csvUpload" className="btn btn-primary">
                Import CSV
              </label>
              {isEditing ? (
                <button
                  className="btn btn-success mx-2 mb-2"
                  onClick={handleExportCSV}
                >
                  Export CSV
                </button>
              ) : (
                <button
                  className="btn btn-warning mx-2 mb-2"
                  onClick={handleDownloadSampleCSV}
                >
                  Download Sample CSV
                </button>
              )}
            </div>
          </div>
          <div className="add-course-form">
            {questionMarks.map((questionMark) => (
              <div key={questionMark.mark} className="quiz-grid">
                <div className="quiz-head">
                  <h5>{questionMark.content}</h5>
                  <button
                    className="btn"
                    onClick={() =>
                      handleOpenPopup(
                        `Add Question for ${questionMark.content}`,
                        (title) => handleAddQuestion(questionMark.mark, title)
                      )
                    }
                  >
                    Add Question
                  </button>
                </div>
                <div className="quiz-content">
                  {questions
                    .filter((question) => question.mark === questionMark.mark)
                    .map((question) => (
                      <div key={question.id} className="quiz-item">
                        <div className="faq-grid">
                          <div className="faq-header">
                            <Link
                              className="collapsed faq-collapse"
                              data-bs-toggle="collapse"
                              to={`#collapse-quiz-${questionMark.mark}-${question.id}`}
                            >
                              <i className="fas fa-align-justify" /> Question:{" "}
                              {question.title}
                            </Link>
                            <div className="faq-right">
                              <button
                                className="btn btn-edit-quiz"
                                onClick={() =>
                                  handleOpenPopup(
                                    "Edit Question Title",
                                    (newTitle) =>
                                      handleUpdateQuestion(
                                        question.id,
                                        newTitle
                                      ),
                                    question.title
                                  )
                                }
                              >
                                <i className="far fa-pen-to-square" />
                              </button>
                              <button
                                className="btn btn-delete-quiz"
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                              >
                                <i className="far fa-trash-can" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          id={`collapse-quiz-${questionMark.mark}-${question.id}`}
                          className="collapse"
                        >
                          <div className="quiz-answers">
                            {question.answerOptions.map((answer) => (
                              <div key={answer.id} className="quiz-answer">
                                <div className="answer-row d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    checked={answer.isCorrect || false}
                                    onChange={(e) =>
                                      handleUpdateAnswerOption(
                                        question.id,
                                        answer.id,
                                        {
                                          ...answer,
                                          isCorrect: e.target.checked,
                                        }
                                      )
                                    }
                                  />
                                  <p className="m-0 flex-grow-1">
                                    Answer:
                                    <strong>{answer.title}</strong>
                                  </p>
                                  <button
                                    className="btn btn-delete-article"
                                    onClick={() =>
                                      handleDeleteAnswerOption(
                                        question.id,
                                        answer.id
                                      )
                                    }
                                  >
                                    ✖
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Hiển thị lỗi nếu số đáp án < 2 */}
                            {question.answerOptions.length < 2 && (
                              <p className="error-message text-danger">
                                You must add at least 2 answers.
                              </p>
                            )}

                            {/* Hiển thị lỗi nếu không có đáp án đúng */}
                            {question.answerOptions.length > 0 &&
                              question.answerOptions.filter(
                                (answer) => answer.isCorrect
                              ).length === 0 && (
                                <p className="error-message text-danger">
                                  At least one answer must be marked as correct.
                                </p>
                              )}

                            {/* Hiển thị nút Add Answer nếu số đáp án < 5 */}
                            {question.answerOptions.length < 5 && (
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  handleOpenPopup("Add Answer", (title) =>
                                    handleAddAnswerOption(question.id, title)
                                  )
                                }
                              >
                                Add Answer
                              </button>
                            )}

                            {/* Hiển thị lỗi nếu đã đủ 5 đáp án */}
                            {question.answerOptions.length >= 5 && (
                              <p className="error-message text-warning">
                                You can only add up to 5 answers.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="widget-btn">
            <Link className="btn btn-black prev_btn" onClick={prevTab3}>
              Previous
            </Link>
            <Link className="btn btn-info-light next_btn" onClick={nextTab4}>
              Continue
            </Link>
          </div>
        </div>
      </fieldset>

      <Popup
        isOpen={isPopupOpen}
        title={popupTitle}
        onClose={handleClosePopup}
        onSubmit={handleSavePopup}
      >
        <input
          type="text"
          className="form-control"
          value={popupInput}
          onChange={(e) => setPopupInput(e.target.value)}
          placeholder="Enter..."
        />
      </Popup>
    </>
  );
};

TestQuestion.propTypes = {
  nextTab4: PropTypes.func.isRequired,
  prevTab3: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default TestQuestion;
