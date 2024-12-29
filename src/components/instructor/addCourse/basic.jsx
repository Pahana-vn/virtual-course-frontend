import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextEditor from "./editor";
import Select from "react-select";
import DOMPurify from "dompurify";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../common/redux/slices/categorySlice";
import { setBasicInfo } from "../../common/redux/slices/courseSlice";

// eslint-disable-next-line react/prop-types
const Basic = ({ nextTab }) => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.categories);
  const { courseTitle, category, level, description } = useSelector(
    (state) => state.course.basicInfo
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const mobileSidebar = useSelector((state) => state.sidebarSlice.expandMenu);

  const levels = [
    { label: "BEGINNER", value: "BEGINNER" },
    { label: "INTERMEDIATE", value: "INTERMEDIATE" },
    { label: "ADVANCED", value: "ADVANCED" },
  ];

  const validateFields = () => {
    const newErrors = {};
    if (!courseTitle) newErrors.courseTitle = "Course title is required";
    if (!category) newErrors.category = "Please select a category";
    if (!level) newErrors.level = "Please select a level";
    if (!description) newErrors.description = "Course description is required";
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      nextTab(); // Go to next tab
    }
  };

  const style = {
    menu: (base) => ({ ...base, marginTop: "0px" }),
    menuList: (base) => ({ ...base, padding: "0" }),
    option: (provided) => ({
      ...provided,
      backgroundColor: mobileSidebar === "disabled" ? "#fff" : "#000",
      color: mobileSidebar === "disabled" ? "#000" : "#fff",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: mobileSidebar === "disabled" ? "#FFDEDA" : "#2b2838",
        // #dddddd
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: "black",
      transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
      transition: "250ms",
      display: "none",
    }),
  };

  return (
    <>
      <fieldset id="first">
        <div className="add-course-info">
          <div className="add-course-inner-header">
            <h4>Basic Information</h4>
          </div>
          <div className="add-course-form">
            <form action="#">
              <div className="input-block">
                <label className="add-course-label">Course Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Course Title"
                  onChange={(e) =>
                    dispatch(setBasicInfo({ courseTitle: e.target.value }))
                  }
                  value={courseTitle}
                />
                {errors.courseTitle && (
                  <span className="error text-danger">{errors.courseTitle}</span>
                )}
              </div>
              <div className="input-block">
                <label className="add-course-label">Courses Category</label>
                <Select
                  options={categories.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                  placeholder="Select Category"
                  onChange={(selectedOption) =>
                    dispatch(setBasicInfo({ category: selectedOption }))
                  }
                  value={category}
                  isLoading={status === "loading"}
                  styles={style}
                />
                {errors.category && (
                  <span className="error text-danger">{errors.category}</span>
                )}
              </div>
              <div className="input-block">
                <label className="add-course-label">Courses Level</label>
                <Select
                  options={levels}
                  placeholder="Select Level"
                  onChange={(selectedOption) =>
                    dispatch(setBasicInfo({ level: selectedOption}))
                  }
                  value={level}
                  styles={style}
                />
                {errors.level && <span className="error text-danger">{errors.level}</span>}
              </div>
              <div className="input-block mb-0">
                <label className="add-course-label">Course Description</label>
                <div id="editor">
                  <TextEditor
                    value={description}
                    onChange={(data) =>
                      dispatch(
                        setBasicInfo({ description: DOMPurify.sanitize(data, { ALLOWED_TAGS: ['p', 'b', 'i', 'ul', 'li', 'br']  }) }) // Loại bỏ tất cả thẻ HTML trừ các thẻ trong ALLOWED_TAGS
                        )
                    }
                  />
                </div>
                {errors.description && (
                  <span className="error text-danger">{errors.description}</span>
                )}
              </div>
            </form>
          </div>
          <div className="widget-btn">
            <Link to="#" className="btn btn-black">
              Back
            </Link>
            <Link
              to="#"
              className="btn btn-info-light next_btn"
              onClick={handleNext}
            >
              Continue
            </Link>
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default Basic;
