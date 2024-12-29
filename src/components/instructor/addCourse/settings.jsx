import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ReactTagsInput from "./tags";
import {
  addHashtag,
  removeHashtag,
  setBasePrice,
  resetCourseState,
} from "../../common/redux/slices/courseSlice";
import { selectCurrentUser } from "../../common/redux/slices/authSlice";

const Settings = ({ nextTab5, prevTab4 }) => {
  const dispatch = useDispatch();
  const courseSlice = useSelector((state) => state.course);

  // Lấy dữ liệu từ Redux
  const hashtags = useSelector((state) => state.course.settingsInfo.hashtags);
  const basePrice = useSelector((state) => state.course.settingsInfo.basePrice);
  const user = useSelector(selectCurrentUser);
  const [errorMessage, setErrorMessage] = useState("");

  const validateHashtag = (tag, existingTags) => {
    const errors = [];
    
    // 1. Kiểm tra trống
    if (!tag.trim()) {
      errors.push("Hashtag cannot be empty.");
      return errors;
    }
  
    // 2. Kiểm tra ký tự hợp lệ (cho phép dấu # ở đầu, không bắt buộc)
    if (!/^#?[a-zA-Z0-9_-]+$/.test(tag)) {
      errors.push("Hashtag can only contain letters, numbers, underscores, hyphens, and optionally start with #.");
    }
  
    // 3. Kiểm tra độ dài
    if (tag.length > 30) {
      errors.push("Hashtag cannot be longer than 30 characters.");
    }
  
    // 4. Kiểm tra trùng lặp (dạng không phân biệt dấu #)
    const normalizedTag = tag.startsWith("#") ? tag.slice(1) : tag;
    if (existingTags.some((t) => t.slice(1) === normalizedTag)) {
      errors.push("Hashtag already exists.");
    }
  
    return errors;
  };
  

  // Thêm hashtag
  const handleAddHashtag = (tag) => {
    const formattedTag = tag.startsWith("#") ? tag : `#${tag}`; // Thêm dấu # nếu chưa có
    const errors = validateHashtag(formattedTag, hashtags);
  
    if (errors.length > 0) {
      setErrorMessage(errors.join(" ")); // Hiển thị lỗi gộp
      return;
    }
  
    setErrorMessage(""); // Xóa lỗi nếu hợp lệ
    dispatch(addHashtag(formattedTag)); // Thêm hashtag vào Redux
  };
  

  // Xóa hashtag
  const handleRemoveHashtag = (tag) => {
    dispatch(removeHashtag(tag));
    setErrorMessage("");
  };

  // Xử lý thay đổi base price
  const handleBasePriceChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value < 0) {
      setErrorMessage("Base price must be a positive number.");
      return;
    }
    setErrorMessage("");
    dispatch(setBasePrice(value));
  };

  const submitCourse = async (courseData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/courses`,
        courseData
      );
      console.log("Course saved successfully:", response.data);
      return response.data; // Trả về dữ liệu đã lưu
    } catch (error) {
      console.error("Failed to save course:", error);
      throw error; // Xử lý lỗi nếu cần
    }
  };

  // Validate và lấy thông tin
  const handleContinue = async () => {
    if (!hashtags.length) {
      setErrorMessage("At least one hashtag is required.");
      return;
    }
    if (!basePrice || isNaN(basePrice) || basePrice <= 0) {
      setErrorMessage("Base price must be a positive number.");
      return;
    }
    setErrorMessage("");

    console.log("Redux store:", courseSlice, user);
    // Dữ liệu của khóa học từ Redux store
    const createCourseData = {
      titleCourse: courseSlice.basicInfo.courseTitle || "",
      description: courseSlice.basicInfo.description || "",
      categoryId: courseSlice.basicInfo.category.value || 0,
      categoryName: courseSlice.basicInfo.category.label || "",
      level: courseSlice.basicInfo.level?.value || "BEGINNER",

      imageCover: courseSlice.mediaInfo.imageUrl || "",
      urlVideo: courseSlice.mediaInfo.videoUrl || "",

      sections: courseSlice.curriculumInfo.sections.map(
        (section, sectionIndex) => ({
          titleSection: section.title || "",
          numOfLectures: section.lectures.length || 0,
          sessionDuration: section.lectures.reduce(
            (sum, lecture) => sum + (lecture.videoDuration || 0),
            0
          ),
          sequenceNumber: sectionIndex + 1,

          lectures: section.lectures.map((lecture, lectureIndex) => ({
            titleLecture: lecture.title || "",
            lectureOrder: lectureIndex + 1,
            lectureVideo: lecture.videoUrl,
            // sectionId: section.id || sectionIndex + 1,
            articles: lecture.articles.map((article) => ({
              content: article.content || "",
              fileUrl: article.url || "",
              // lectureId: lecture.id || lectureIndex + 1,
            })),
          })),
        })
      ),
      questions: courseSlice.questionInfo.questions.map(
        (question) => {
          const isSingle = question.answerOptions?.filter(option => option.isCorrect).length === 1;
          return {
            content: question.title || "",
            type: isSingle ? "SINGLE" : "MULTIPLE", // Chỉ 1 câu trả lời đúng -> SINGLE
            marks: question.type || 0,
            answerOptions: question.answerOptions.map((option) => ({
              content: option.title || "",
              isCorrect: option.isCorrect || false,
            })),
          };
        }
      ),

      duration: courseSlice.curriculumInfo.sections.reduce((totalDuration, section) => {
        const sectionDuration = section.lectures.reduce(
          (sum, lecture) => sum + (lecture.videoDuration || 0),
          0
        );
        return totalDuration + sectionDuration;
      }, 0),

      hashtag: courseSlice.settingsInfo.hashtags.join(", "),
      basePrice: courseSlice.settingsInfo.basePrice || 0,
      status: courseSlice.settingsInfo.visibility === 2 ? "ACTIVE" : "INACTIVE",

      instructorId: user.id || 0,
      instructorInfo: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photo: user.photo || "",
      },

      // courseId: courseSlice.id || 0,
    };

    console.log(createCourseData);

    try {
      const savedCourse = await submitCourse(createCourseData);
      toast.success("Course saved successfully!");
      console.log("Course added:", savedCourse);
      dispatch(resetCourseState());
      nextTab5(); // Chuyển đến bước tiếp theo nếu thành công
    } catch {
      toast.error("Failed to save course. Please try again.");
    }
  };

  return (
    <>
      <fieldset className="field-card" style={{ display: "block" }}>
        <div className="add-course-info">
          <div className="add-course-inner-header">
            <h4>Requirements</h4>
          </div>
          <div className="add-course-form">
            <form action="#">
              {/* Input hashtags */}
              <div className="input-block input-block-tagsinput">
                <ReactTagsInput
                  tags={hashtags}
                  onAddTag={handleAddHashtag}
                  onRemoveTag={handleRemoveHashtag}
                  maxLength={30}
                />
              </div>
              {/* Input base price */}
              <div className="input-block mb-0">
                <label className="add-course-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="10.0"
                  value={basePrice || ""}
                  onChange={handleBasePriceChange}
                />
              </div>
              {/* Hiển thị lỗi */}
              {errorMessage && (
                <p className="error-message text-danger">{errorMessage}</p>
              )}
            </form>
          </div>
          <div className="widget-btn">
            <Link className="btn btn-black prev_btn" to="#" onClick={prevTab4}>
              Previous
            </Link>
            <Link
              className="btn btn-info-light next_btn"
              to="#"
              onClick={handleContinue}
            >
              Continue
            </Link>
          </div>
        </div>
      </fieldset>
    </>
  );
};

Settings.propTypes = {
  nextTab5: PropTypes.func.isRequired,
  prevTab4: PropTypes.func.isRequired,
};

export default Settings;
