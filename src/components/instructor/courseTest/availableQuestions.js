import React, { useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { useGetQuestionsByCourseQuery } from "../../../redux/slices/course/questionApiSlice";

const AvailableQuestions = ({ courseId, onAddQuestion }) => {
  const { data: questions, isLoading, error } = useGetQuestionsByCourseQuery({ courseId });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  if (isLoading) return <p>Loading questions...</p>;
  if (error) return <p>Error loading questions: {error.message}</p>;

  const handleAdd = () => {
    if (selectedQuestion) {
      onAddQuestion(selectedQuestion);
    } else {
      alert("Please select a question before adding.");
    }
  };

  return (
    <div className="form-group">
      {/* Dropdown Select */}
      <Select
        options={questions.map((question) => ({
          label: question.content,
          value: question.id,
        }))}
        placeholder="Select a question"
        onChange={(option) => {
          const question = questions.find((q) => q.id === option.value);
          setSelectedQuestion(question);
        }}
        value={selectedQuestion ? { label: selectedQuestion.content, value: selectedQuestion.id } : null}
      />

      {/* Hiển thị thông tin câu hỏi */}
      {selectedQuestion && (
        <div className="mt-3">
          <h5>Question Details</h5>
          <p>
            <strong>Content:</strong> {selectedQuestion.content}
          </p>
          <p>
            <strong>Marks:</strong> {selectedQuestion.marks}
          </p>
          <p>
            <strong>Type Question:</strong> {selectedQuestion.type}
          </p>
          <p>
            <strong>Answer Options:</strong>
          </p>
          <ul>
            {selectedQuestion.answerOptions.map((answer, index) => (
              <li key={index}>
                <strong>Answer {index + 1}:</strong> {answer.content}{" "}
                {answer.isCorrect && <span style={{ color: "green" }}> (Correct)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Button */}
      <button className="btn btn-success mt-2" onClick={handleAdd}>
        Add Question
      </button>
    </div>
  );
};

AvailableQuestions.propTypes = {
  courseId: PropTypes.string.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
};

export default AvailableQuestions;
