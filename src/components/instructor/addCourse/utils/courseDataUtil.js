export const prepareCourseData = (courseSlice, instructor, courseId) => {
  return {
    id: courseId || 0,
    titleCourse: courseSlice.basicInfo.courseTitle || "",
    description: courseSlice.basicInfo.description || "",
    categoryId: courseSlice.basicInfo.category.value || 0,
    categoryName: courseSlice.basicInfo.category.label || "",
    level: courseSlice.basicInfo.level?.value || "BEGINNER",
    hashtag: courseSlice.settingsInfo.hashtags.join(","),
    imageCover: courseSlice.mediaInfo.imageFileName || "",
    urlVideo: courseSlice.mediaInfo.videoUrl || "",
    process: 0,
    duration: courseId
  ? Math.ceil(courseSlice.basicInfo.duration / 3600)
  : Math.ceil(
      courseSlice.curriculumInfo.sections.reduce(
        (totalDuration, section) => {
          const sectionDuration = section.lectures.reduce(
            (sum, lecture) => sum + (lecture?.videoDuration || 0),
            0
          );
          return totalDuration + sectionDuration;
        },
        0
      ) / 3600
    ),
    basePrice: Number(courseSlice.settingsInfo.basePrice) || 0,
    status: courseSlice.settingsInfo.visibility === 2 ? "PUBLISHED" : "PENDING",

    instructorId: instructor.id || 0,
    instructorInfo: {
      firstName: instructor.firstName || "Unknown",
      lastName: instructor.lastName || "Instructor",
      photo: instructor.photo || "default_instructor_photo.jpg",
    },

    sections: courseSlice.curriculumInfo.sections.map(
      (section, sectionIndex) => ({
        id: section.id || 0,
        titleSection: section.title || "",
        numOfLectures: section.lectures.length || 0,
        sessionDuration: section.lectures.reduce(
          (sum, lecture) => sum + (lecture.videoDuration || 0),
          0
        ),
        sequenceNumber: sectionIndex + 1,
        courseId: section.courseId || 0,

        lectures: section.lectures.map((lecture, lectureIndex) => ({
          id: lecture.id || 0,
          titleLecture: lecture.title || "",
          lectureOrder: lectureIndex + 1,
          lectureVideo: lecture.lectureVideo || "",
          sectionId: lecture.sectionId || 0,
          articles: lecture.articles.map((article) => ({
            id: article.id || 0,
            content: article.content || "",
            fileUrl: article.fileUrl || "",
            lectureId: article.lectureId || 0,
          })),
        })),
      })
    ),

    questions: courseSlice.questionInfo.questions.map((question) => {
      const isSingle =
        question.answerOptions?.filter((option) => option.isCorrect).length ===
        1;
      return {
        id: question.id || 0,
        content: question.title || "",
        type: isSingle ? "SINGLE" : "MULTIPLE",
        marks: question.mark || 0,
        courseId: question.courseId || 0,

        answerOptions: question.answerOptions.map((option) => ({
          id: option.id || 0,
          content: option.title || "",
          isCorrect: option.isCorrect || false,
          questionId: option.questionId || 0,
        })),
      };
    }),
  };
};
