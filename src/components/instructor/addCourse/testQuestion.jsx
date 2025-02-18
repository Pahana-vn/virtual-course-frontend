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
} from "../../../redux/slices/course/courseSlice";
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

  const generateUniqueId = () => {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const questionMarks = [
    { mark: 10, content: "10-Point Questions" },
    { mark: 8, content: "8-Point Questions" },
    { mark: 6, content: "6-Point Questions" },
  ];

  const handleAddQuestion = (mark, title) => {
    dispatch(addQuestion({ 
      id: generateUniqueId(),
      title,
      mark,
      answerOptions: [],
    }));
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
    dispatch(
      addAnswerOption({ questionId, answerOption: newAnswerOption })
    );
  };

  const handleUpdateAnswerOption = (
    questionId,
    answerId,
    updatedAnswer
  ) => {
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

  return (
    <>
      <fieldset className="field-card" style={{ display: "block" }}>
        <div className="add-course-info">
          <div className="add-course-inner-header">
            <h4>Test Questions</h4>
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
                              <i className="fas fa-align-justify" /> Question: {question.title}
                            </Link>
                            <div className="faq-right">
                              <button
                                className="btn btn-edit-quiz"
                                onClick={() =>
                                  handleOpenPopup(
                                    "Edit Question Title",
                                    (newTitle) =>
                                      handleUpdateQuestion(question.id, newTitle),
                                      question.title
                                  )
                                }
                              >
                                <i className="far fa-pen-to-square" />
                              </button>
                              <button
                                className="btn btn-delete-quiz"
                                onClick={() => handleDeleteQuestion(question.id)}
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
                              question.answerOptions.filter((answer) => answer.isCorrect)
                                .length === 0 && (
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
};

export default TestQuestion;
