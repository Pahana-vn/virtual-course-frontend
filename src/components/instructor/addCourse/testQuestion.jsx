import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Popup from "./popup";
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswerOption,
  updateAnswerOption,
  deleteAnswerOption,
} from "../../common/redux/slices/courseSlice";
import "./Curriculum.css";

const TestQuestion = ({ nextTab4, prevTab3 }) => {
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

  const questionTypes = [
    { type: 10, title: "10-Point Questions" },
    { type: 8, title: "8-Point Questions" },
    { type: 6, title: "6-Point Questions" },
  ];

  const handleAddQuestion = (type, title) => {
    dispatch(addQuestion({ title, type, answerOptions: [] }));
  };

  const handleAddAnswerOption = (originalIndex, title) => {
    const currentAnswerOptions = questions[originalIndex]?.answerOptions || [];
    const newQuestionAnswer = {
      title: title || "Untitled Option",
      isCorrect: currentAnswerOptions.length === 0,
    };
    dispatch(
      addAnswerOption({ questionIndex: originalIndex, answerOption: newQuestionAnswer })
    );
  };

  const handleUpdateQuestion = (originalIndex, newTitle) => {
    dispatch(updateQuestion({ index: originalIndex, title: newTitle }));
  };

  const handleDeleteQuestion = (originalIndex) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteQuestion({ index: originalIndex }));
    }
  };

  const handleUpdateAnswerOption = (
    originalIndex,
    answerIndex,
    updatedAnswer
  ) => {
    dispatch(
      updateAnswerOption({
        questionIndex: originalIndex,
        answerOptionIndex: answerIndex,
        answerOption: updatedAnswer,
      })
    );
  };

  const handleDeleteAnswerOption = (originalIndex, answerIndex) => {
    dispatch(
      deleteAnswerOption({
        questionIndex: originalIndex,
        answerOptionIndex: answerIndex,
      })
    );
  };

  return (
    <>
      <fieldset className="field-card" style={{ display: "block" }}>
        <div className="add-course-info">
          <div className="add-course-inner-header">
            <h4>Test Questions</h4>
          </div>
          <div className="add-course-form">
            {questionTypes.map((questionType) => (
              <div key={questionType.type} className="quiz-grid">
                <div className="quiz-head">
                  <h5>{questionType.title}</h5>
                  <button
                    className="btn"
                    onClick={() =>
                      handleOpenPopup(
                        `Add Question for ${questionType.title}`,
                        (title) => handleAddQuestion(questionType.type, title)
                      )
                    }
                  >
                    Add Question
                  </button>
                </div>

                <div className="quiz-content">
                  {questions
                    .map((question, originalIndex) => ({ ...question, originalIndex }))
                    .filter((question) => question.type === questionType.type)
                    .map(({ title, answerOptions, originalIndex }, idx) => (
                      <div key={originalIndex} className="quiz-item">
                        <div className="faq-grid">
                          <div className="faq-header">
                            <Link
                              className="collapsed faq-collapse"
                              data-bs-toggle="collapse"
                              to={`#collapse-quiz-${questionType.type}-${originalIndex}`}
                            >
                              <i className="fas fa-align-justify" /> Question{" "}
                              {idx + 1}: {title}
                            </Link>
                            <div className="faq-right">
                              <button
                                className="btn btn-edit-quiz"
                                onClick={() =>
                                  handleOpenPopup(
                                    "Edit Question Title",
                                    (newTitle) =>
                                      handleUpdateQuestion(originalIndex, newTitle)
                                  )
                                }
                              >
                                <i className="far fa-pen-to-square" />
                              </button>
                              <button
                                className="btn btn-delete-quiz"
                                onClick={() => handleDeleteQuestion(originalIndex)}
                              >
                                <i className="far fa-trash-can" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          id={`collapse-quiz-${questionType.type}-${originalIndex}`}
                          className="collapse"
                        >
                          <div className="quiz-answers">
                            {answerOptions.map((answer, answerIndex) => (
                              <div key={answerIndex} className="quiz-answer">
                                <div className="answer-row d-flex align-items-center">
                                  <input
                                    type="checkbox"
                                    checked={answer.isCorrect || false}
                                    onChange={(e) =>
                                      handleUpdateAnswerOption(
                                        originalIndex,
                                        answerIndex,
                                        {
                                          ...answer,
                                          isCorrect: e.target.checked,
                                        }
                                      )
                                    }
                                  />
                                  <p className="m-0 flex-grow-1">
                                    Answer {answerIndex + 1}:{" "}
                                    <strong>{answer.title}</strong>
                                  </p>
                                  <button
                                    className="btn btn-delete-article"
                                    onClick={() =>
                                      handleDeleteAnswerOption(
                                        originalIndex,
                                        answerIndex
                                      )
                                    }
                                  >
                                    ✖
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Hiển thị lỗi nếu số đáp án < 2 */}
                            {answerOptions.length < 2 && (
                              <p className="error-message text-danger">
                                You must add at least 2 answers.
                              </p>
                            )}

                            {/* Hiển thị lỗi nếu không có đáp án đúng */}
                            {answerOptions.length > 0 &&
                              answerOptions.filter((answer) => answer.isCorrect)
                                .length === 0 && (
                                <p className="error-message text-danger">
                                  At least one answer must be marked as correct.
                                </p>
                              )}

                            {/* Hiển thị nút Add Answer nếu số đáp án < 5 */}
                            {answerOptions.length < 5 && (
                              <button
                                className="btn btn-success"
                                onClick={() =>
                                  handleOpenPopup("Add Answer", (title) =>
                                    handleAddAnswerOption(originalIndex, title)
                                  )
                                }
                              >
                                Add Answer
                              </button>
                            )}

                            {/* Hiển thị lỗi nếu đã đủ 5 đáp án */}
                            {answerOptions.length >= 5 && (
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
};

export default TestQuestion;
