import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basicInfo: {
    courseTitle: "",
    category: { value: null, label: "" },
    level: { value: "", label: "" },
    description: "",
  },
  mediaInfo: {
    imageFileName: "",
    imageUrl: "",
    videoUrl: "",
    videoThumbnail: "",
  },
  curriculumInfo: {
    sections: [],
  },
  questionInfo: {
    questions: [],
  },
  settingsInfo: {
    hashtags: [],
    basePrice: 0,
    visibility: 1, //  1 = PENDING, 2 = PUBLISHED, 3 = DRAFT
  },
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseId(state, action) {
      state.id = action.payload.id;
    },
    // Actions cho Basic
    setBasicInfo: (state, action) => {
      state.basicInfo = { ...state.basicInfo, ...action.payload };
    },
    // Actions cho Media
    setMediaInfo: (state, action) => {
      state.mediaInfo = { ...state.mediaInfo, ...action.payload };
    },
    // Actions cho Curriculum
    setCurriculumInfo: (state, action) => {
      state.curriculumInfo.sections = action.payload.sections;
    },
    addSection: (state, action) => {
      state.curriculumInfo.sections.push({
        ...action.payload,
        lectures: action.payload.lectures || [],
      });
    },
    updateSection: (state, action) => {
      const { index, title } = action.payload;
      if (state.curriculumInfo.sections[index]) {
        state.curriculumInfo.sections[index].title = title;
      }
    },
    deleteSection: (state, action) => {
      const { index } = action.payload;
      if (state.curriculumInfo.sections[index]) {
        state.curriculumInfo.sections.splice(index, 1);
      }
    },
    addLecture: (state, action) => {
      const { sectionIndex, lecture } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures.push({
          ...lecture,
          articles: lecture.articles || [],
        });
      }
    },
    updateLecture: (state, action) => {
      const { sectionIndex, lectureIndex, lecture } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[lectureIndex] = {
          ...state.curriculumInfo.sections[sectionIndex].lectures[lectureIndex],
          ...lecture,
        };
      }
    },
    deleteLecture: (state, action) => {
      const { sectionIndex, lectureIndex } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures.splice(
          lectureIndex,
          1
        );
      }
    },
    addArticle: (state, action) => {
      const { sectionIndex, lectureIndex, article } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[
          lectureIndex
        ].articles.push(article);
      }
    },
    addDescription: (state, action) => {
      const { sectionIndex, lectureIndex, description } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[
          lectureIndex
        ].description = description;
      }
    },
    addVideo: (state, action) => {
      const { sectionIndex, lectureIndex, videoUrl } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[
          lectureIndex
        ].videoUrl = videoUrl;
      }
    },
    // Actions cho Settings Question---------------------
    setQuestionInfo: (state, action) => {
      state.questionInfo.questions = action.payload.questions;
    },
    addQuestion: (state, action) => {
      // Thêm question mới vào danh sách questions
      state.questionInfo.questions.push({
        ...action.payload,
        id: action.payload.id,
        answerOptions: action.payload.answerOptions || [], // Khởi tạo danh sách câu trả lời
      });
    },
    updateQuestion: (state, action) => {
      const { id, title } = action.payload;
      // Cập nhật tiêu đề của question tại index
      const question = state.questionInfo.questions.find((q) => q.id === id);

      if (question) {
        question.title = title;
      } else {
        console.warn(`Question with id ${id} does not exist!`);
      }
    },
    deleteQuestion: (state, action) => {
      const { id } = action.payload;
      // Xóa question tại index
      state.questionInfo.questions = state.questionInfo.questions.filter(
        (question) => question.id !== id
      );
    },
    addAnswerOption: (state, action) => {
      const { questionId, answerOption } = action.payload;
      const question = state.questionInfo.questions.find(
        (q) => q.id === questionId
      );

      if (!question) {
        console.warn(`Question at index ${questionId} does not exist!`);
        return;
      }

      // Kiểm tra questionType, có thể so sánh kiểu question
      if (!question.answerOptions) {
        question.answerOptions = []; // Nếu question chưa có answerOptions, khởi tạo mảng
      }

      // Kiểm tra số lượng câu trả lời tối đa là 5
      if (question.answerOptions.length >= 5) {
        console.warn("Maximum 5 answers allowed per question!");
        return;
      }

      // Kiểm tra xem đã có đáp án đúng nào chưa
      const hasCorrectAnswer = question.answerOptions.some(
        (option) => option.isCorrect
      );

      // Thêm câu trả lời mới vào question tương ứng
      question.answerOptions.push({
        ...answerOption,
        isCorrect: hasCorrectAnswer ? false : answerOption.isCorrect || false,
      });
    },

    updateAnswerOption: (state, action) => {
      const { questionId, answerId, answerOption } = action.payload;
      const question = state.questionInfo.questions.find(
        (q) => q.id === questionId
      );

      if (!question) {
        console.warn(`Question at index ${questionId} does not exist!`);
        return;
      }
      const answer = question.answerOptions.find((a) => a.id === answerId);

      if (!answer) {
        console.warn(
          `Answer at index ${answerId} does not exist for question ${questionId}!`
        );
        return;
      }

      // Cập nhật câu trả lời
      Object.assign(answer, answerOption);
    },

    deleteAnswerOption: (state, action) => {
      const { questionId, answerId } = action.payload;
      const question = state.questionInfo.questions.find(
        (q) => q.id === questionId
      );

      if (!question) {
        console.warn(`Question at index ${questionId} does not exist!`);
        return;
      }
      
      question.answerOptions = question.answerOptions.filter(
        (answer) => answer.id !== answerId
      );
    },

    // Actions cho Settings
    setSettingsInfo: (state, action) => {
      state.settingsInfo = { ...state.settingsInfo, ...action.payload };
    },

    addHashtag: (state, action) => {
      if (!state.settingsInfo.hashtags.includes(action.payload)) {
        state.settingsInfo.hashtags.push(action.payload);
      }
    },

    removeHashtag: (state, action) => {
      state.settingsInfo.hashtags = state.settingsInfo.hashtags.filter(
        (hashtag) => hashtag !== action.payload
      );
    },

    setBasePrice: (state, action) => {
      state.settingsInfo.basePrice = action.payload;
    },

    resetSettings: (state) => {
      state.settingsInfo.hashtags = [];
      state.settingsInfo.basePrice = 0;
      state.settingsInfo.visibility = "PENDING";
    },
    // Reset toàn bộ form
    resetCourseState: () => initialState,
  },
});

export const {
  setBasicInfo,
  setMediaInfo,
  setCurriculumInfo,
  setQuestionInfo,
  setSettingsInfo,
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
  addArticle,
  addDescription,
  addVideo,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswerOption,
  updateAnswerOption,
  deleteAnswerOption,
  addHashtag,
  removeHashtag,
  setBasePrice,
  resetSettings,
  resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;
