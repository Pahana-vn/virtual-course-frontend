import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ReactTagsInput from "./tags";
import {
  addHashtag,
  removeHashtag,
  setBasePrice,
  resetCourseState,
} from "../../../redux/slices/course/courseSlice";
import { useGetInstructorByIdQuery } from "../../../redux/slices/instructor/instructorApiSlice";
import { prepareCourseData } from "./utils/courseDataUtil";
import { useCreateCourseMutation } from "../../../redux/slices/course/courseApiSlice";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";

const Settings = ({ nextTab5, prevTab4, isEditing }) => {
  const dispatch = useDispatch();
  const [createCourse] = useCreateCourseMutation();
  const courseSlice = useSelector((state) => state.course);

  // Lấy dữ liệu từ Redux
  const hashtags = useSelector((state) => state.course.settingsInfo.hashtags);
  const basePrice = useSelector((state) => state.course.settingsInfo.basePrice);
  const instructorId = useSelector(selectCurrentInstructor);
  const { data: instructor } = useGetInstructorByIdQuery({ id: instructorId });
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
      errors.push(
        "Hashtag can only contain letters, numbers, underscores, hyphens, and optionally start with #."
      );
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
      const response = await createCourse({ courseData }).unwrap(); 
      return response;
    } catch (error) {
      console.error("Failed to save course:", error);
      throw error;
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

    const courseData = prepareCourseData(courseSlice, instructor);

    try {
      const savedCourse = await submitCourse(courseData);
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
                  value={basePrice || 0}
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
            {!isEditing && ( // Chỉ hiển thị nút Continue khi không phải chế độ cập nhật
              <Link
                className="btn btn-danger next_btn"
                to="#"
                onClick={handleContinue}
              >
                Submit
              </Link>
            )}
          </div>
        </div>
      </fieldset>
    </>
  );
};

Settings.propTypes = {
  nextTab5: PropTypes.func.isRequired,
  prevTab4: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};

export default Settings;
