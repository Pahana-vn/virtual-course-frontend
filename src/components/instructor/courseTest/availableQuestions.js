import React, { useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { useGetQuestionsByCourseQuery } from "../../../redux/slices/course/questionApiSlice";

const AvailableQuestions = ({ courseId, onAddQuestion, totalMarks, selectedQuestions  }) => {
  const { data: questions, isLoading, error } = useGetQuestionsByCourseQuery({ courseId });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  if (isLoading) return <p>Loading questions...</p>;
  if (error) return <p>Error loading questions: {error.message}</p>;

  // Lọc ra những câu hỏi chưa được chọn để tránh trùng lặp
  const availableQuestions = questions.filter(
    (question) => !selectedQuestions.some((q) => q.id === question.id)
  );

  const handleAdd = () => {

    if (![50, 100].includes(totalMarks)) {
      setErrorMessage("You can only add questions if total marks are 50 or 100.");
      return;
    }

    if (selectedQuestion) {
      // Kiểm tra giới hạn câu hỏi
      const updatedQuestions = [...selectedQuestions, selectedQuestion];
      const questionCounts = { 6: 0, 8: 0, 10: 0 };

      updatedQuestions.forEach((q) => {
        questionCounts[q.marks] += 1;
      });

      // Kiểm tra số lượng câu hỏi theo điểm
      if (totalMarks === 100) {
        if (
          questionCounts[6] > 6 ||
          questionCounts[8] > 3 ||
          questionCounts[10] > 4
        ) {
          setErrorMessage("You can only select up to 6 questions of 6 marks, 3 questions of 8 marks, and 4 questions of 10 marks for 100 total marks.");
          return;
        }
      } else if (totalMarks === 50) {
        if (
          questionCounts[6] > 4 ||
          questionCounts[8] > 2 ||
          questionCounts[10] > 1
        ) {
          setErrorMessage("You can only select up to 4 questions of 6 marks, 2 questions of 8 marks, and 1 question of 10 marks for 50 total marks.");
          return;
        }
      }

      onAddQuestion(selectedQuestion);
      setSelectedQuestion(null);
      setErrorMessage(""); // Clear error message if valid
    } else {
      alert("Please select a question before adding.");
    }
  };

  return (
    <div className="form-group">
      {/* Dropdown Select */}
      <Select
        options={availableQuestions.map((question) => ({
          label: `${question.marks}: ${question.content}`,
          value: question.id,
        }))}
        placeholder="Select a question"
        onChange={(option) => {
          const question = questions.find((q) => q.id === option.value);
          setSelectedQuestion(question);
        }}
        value={selectedQuestion ? { label: `${selectedQuestion.marks}: ${selectedQuestion.content}`, value: selectedQuestion.id } : null}
        menuPortalTarget={document.body} // Hiển thị dropdown phía trên
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }} 
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

      {/* Hiển thị thông báo lỗi */}
      {errorMessage && <h5 style={{ color: "red" }}>{errorMessage}</h5>}

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
  totalMarks: PropTypes.number.isRequired,
  selectedQuestions: PropTypes.array.isRequired,
};

export default AvailableQuestions;
