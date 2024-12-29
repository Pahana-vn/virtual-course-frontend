import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  basicInfo: {
    courseTitle: "",
    category: null,
    level: null,
    description: "",
  },
  mediaInfo: {
    imageFileName: '',
    imageUrl: '',
    videoUrl: '',
    videoThumbnail: '',
  },
  curriculumInfo: {
    sections: [], // Mỗi section chứa lectures, articles, descriptions, videos
  },
  quizInfo: {
    quizzes: []
  },
  settingsInfo: {
    hashtags: [], // Danh sách hashtag
    basePrice: "", // Giá cơ bản
    visibility: "Inactive", // hoặc 'Active'
  },
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
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
          ...lecture 
        };
      }
    },
    deleteLecture: (state, action) => {
      const { sectionIndex, lectureIndex } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures.splice(lectureIndex, 1);
      }
    },
    addArticle: (state, action) => {
      const { sectionIndex, lectureIndex, article } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[lectureIndex].articles.push(article);
      }
    },
    addDescription: (state, action) => {
      const { sectionIndex, lectureIndex, description } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[lectureIndex].description = description;
      }
    },
    addVideo: (state, action) => {
      const { sectionIndex, lectureIndex, videoUrl } = action.payload;
      if (state.curriculumInfo.sections[sectionIndex]?.lectures[lectureIndex]) {
        state.curriculumInfo.sections[sectionIndex].lectures[lectureIndex].videoUrl = videoUrl;
      }
    },
     // Actions cho Settings Quiz---------------------
    addQuiz: (state, action) => {
      // Thêm quiz mới vào danh sách quizzes
      state.quizInfo.quizzes.push({
        ...action.payload,
        quizAnswers: action.payload.quizAnswers || [], // Khởi tạo danh sách câu trả lời
      });
    },
    updateQuiz: (state, action) => {
      const { index, title } = action.payload;
      // Cập nhật tiêu đề của quiz tại index
      if (state.quizInfo.quizzes[index]) {
        state.quizInfo.quizzes[index].title = title;
      }
    },
    deleteQuiz: (state, action) => {
      const { index } = action.payload;
      // Xóa quiz tại index
      if (state.quizInfo.quizzes[index]) {
        state.quizInfo.quizzes.splice(index, 1);
      }
    },
    addQuizAnswer: (state, action) => {
      const { quizIndex, quizAnswer } = action.payload;
      if (!state.quizInfo.quizzes[quizIndex]) {
        console.warn(`Quiz at index ${quizIndex} does not exist!`);
        return;
      }
      if (state.quizInfo.quizzes[quizIndex].quizAnswers.length >= 5) {
        console.warn("Maximum 5 answers allowed per quiz!");
        return;
      }
      state.quizInfo.quizzes[quizIndex].quizAnswers.push({
        ...quizAnswer,
        isCorrect: false,
      });
    },
    updateQuizAnswer: (state, action) => {
      const { quizIndex, quizAnswerIndex, quizAnswer } = action.payload;
      if (!state.quizInfo.quizzes[quizIndex]) {
        console.warn(`Quiz at index ${quizIndex} does not exist!`);
        return;
      }
      if (!state.quizInfo.quizzes[quizIndex].quizAnswers[quizAnswerIndex]) {
        console.warn(`Answer at index ${quizAnswerIndex} does not exist for quiz ${quizIndex}!`);
        return;
      }
      state.quizInfo.quizzes[quizIndex].quizAnswers[quizAnswerIndex] = {
        ...state.quizInfo.quizzes[quizIndex].quizAnswers[quizAnswerIndex],
        ...quizAnswer,
      };
    },
    
    deleteQuizAnswer: (state, action) => {
      const { quizIndex, quizAnswerIndex } = action.payload;
      if (!state.quizInfo.quizzes[quizIndex]) {
        console.warn(`Quiz at index ${quizIndex} does not exist!`);
        return;
      }
      if (!state.quizInfo.quizzes[quizIndex].quizAnswers[quizAnswerIndex]) {
        console.warn(`Answer at index ${quizAnswerIndex} does not exist for quiz ${quizIndex}!`);
        return;
      }
      state.quizInfo.quizzes[quizIndex].quizAnswers.splice(quizAnswerIndex, 1);
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
      state.settingsInfo.basePrice = "";
      state.settingsInfo.price = "";
      state.settingsInfo.visibility = "Inactive";
    },
    // Reset toàn bộ form
    resetCourse: () => initialState,
  },
});

export const {
  setBasicInfo,
  setMediaInfo,
  setCurriculumInfo,
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
  addArticle,
  addDescription,
  addVideo,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  addQuizAnswer,
  updateQuizAnswer,
  deleteQuizAnswer,
  setSettingsInfo,
  addHashtag,
  removeHashtag,
  setBasePrice,
  resetSettings,
  resetCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
