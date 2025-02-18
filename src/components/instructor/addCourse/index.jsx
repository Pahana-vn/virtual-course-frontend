import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import Basic from "./basic";
import CourseMedia from "./courseMedia";
import Curriculum from "./curriculum";
import TestQuestion from "./testQuestion";
import Settings from "./settings";
import Success from "./success";
import {
  setBasicInfo,
  setMediaInfo,
  setCurriculumInfo,
  setQuestionInfo,
  setSettingsInfo,
  resetCourseState,
} from "../../../redux/slices/course/courseSlice";
import {
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../../../redux/slices/course/courseApiSlice";
import { useInstructorProfileQuery } from "../../../redux/slices/instructor/instructorApiSlice";
import { prepareCourseData } from "./utils/courseDataUtil";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";

const AddOrEditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const instructorId = useSelector(selectCurrentInstructor);
  const {
    data: instructor,
  } = useInstructorProfileQuery({ id: instructorId });
  const [TabChange, setTabChange] = useState(false);
  const [TabChange1, setTabChange1] = useState(false);
  const [TabChange2, setTabChange2] = useState(false);
  const [TabChange3, setTabChange3] = useState(false);
  const [TabChange4, setTabChange4] = useState(false);

  const [PageChange, setPageChange] = useState("basic");

  const [backendCourseData, setBackendCourseData] = useState(null);

  const courseSlice = useSelector((state) => state.course);
  const { basicInfo, mediaInfo, curriculumInfo, settingsInfo } = useSelector(
    (state) => state.course
  );

  const isEditing = !!courseId;
  const courseIdNumber = Number(courseId);
  const { data: course } = useGetCourseByIdQuery(
  { id: courseIdNumber, skip: !isEditing },
  { refetchOnMountOrArgChange: true }
);
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  useEffect(() => {
    if (isEditing && course) {
      setBackendCourseData(course);
      dispatch(
        setBasicInfo({
          courseTitle: course.titleCourse || "",
          category: {
            value: course.categoryId || null,
            label: course.categoryName || "",
          },
          level: {
            value: course.level || "BEGINNER",
            label:
              course.level.charAt(0).toUpperCase() +
              course.level.slice(1).toLowerCase(),
          },
          description: course.description || "",
          duration: course.duration || 0,
        })
      );

      dispatch(
        setMediaInfo({
          imageUrl: course.imageCover,
          imageFileName: course.imageCover
            ? course.imageCover.split("/").pop() // Lấy phần cuối cùng sau dấu "/"
            : "",
          videoUrl: course.urlVideo || "",
          videoThumbnail: course.urlVideo || "",
        })
      );

      dispatch(
        setCurriculumInfo({
          sections: course.sections?.map((section) => ({
            id: section?.id || 0,
            title: section?.titleSection || "",
            courseId: section.courseId || 0,

            lectures: section?.lectures?.map((lecture) => ({
              id: lecture?.id || 0,
              title: lecture?.titleLecture || "",
              lectureOrder: lecture?.lectureOrder || "",
              lectureVideo: lecture?.lectureVideo || "",
              videoThumbnail:
              lecture.lectureVideo?.includes("youtube.com")
              ? `https://img.youtube.com/vi/${
                  lecture.lectureVideo.split("v=")[1]?.split("&")[0]
                }/maxresdefault.jpg`
              : "",
              sectionId: lecture.sectionId || 0,

              articles: lecture?.articles?.map((article) => ({
                id: article?.id || 0,
                fileUrl: article?.fileUrl || "",
                content: article?.content || "",
                lectureId: article?.lectureId || 0,
              })),
            })) || [],
          })),
        })
      );
      dispatch(
        setQuestionInfo({
          questions: course.questions.map((question) => ({
            id: question.id || 0,
            title: question.content || "",
            mark: question.marks || 0,
            type: question.type || "",
            courseId: question.courseId || 0,

            answerOptions: question.answerOptions.map((option) => ({
              id: option.id || 0,
              title: option.content || "",
              isCorrect: option.isCorrect || false,
              questionId: option.questionId || 0,
            })),
          })) || [],
        })
      );

      dispatch(
        setSettingsInfo({
          hashtags: course.hashtag
          ? course.hashtag.split(",").map((tag) => tag.trim())
          : [],
          basePrice: course.basePrice || 0,
          visibility: course.status === "PUBLISHED" ? 2 : 1,
        })
      );
    } else {
      dispatch(resetCourseState());
    }
    return () => {
      dispatch(resetCourseState());
    };
  }, [isEditing, course, dispatch]);

  const handleSaveDraft = async () => {
    try {
      await createCourse({
        courseData: {
          basicInfo,
          mediaInfo,
          curriculumInfo,
          setQuestionInfo,
          settingsInfo,
          status: "DRAFT",
        },
      }).unwrap();
      alert("Course saved as draft successfully!");
      dispatch(resetCourseState());
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      const courseData = prepareCourseData(courseSlice, instructor, courseIdNumber);
      // console.log("Prepared Course Data:", courseData);

      if (!courseData.duration && backendCourseData) {
        courseData.duration = backendCourseData.duration || 0;
      }
      await updateCourse({
        id: courseIdNumber,
        courseData,
      }).unwrap();
      alert("Course updated successfully!");
      dispatch(resetCourseState());
      navigate("/instructor/instructor-course");
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  const nextTab = () => {
    setTabChange(true);
    setPageChange("courseMedia");
  };

  const prevTab1 = () => {
    setTabChange(false);
    setPageChange("basic");
  };

  const nextTab2 = () => {
    setTabChange1(true);
    setTabChange(true);
    setPageChange("curriculum");
  };

  const prevTab2 = () => {
    setTabChange1(false);
    setPageChange("courseMedia");
  };

  const nextTab3 = () => {
    setTabChange2(true);
    setTabChange(true);
    setPageChange("testQuestion");
  };

  const prevTab3 = () => {
    setTabChange2(false);
    setPageChange("curriculum");
  };

  const nextTab4 = () => {
    setTabChange3(true);
    setTabChange(true);
    setPageChange("settings");
  };

  const prevTab4 = () => {
    setTabChange3(false);
    setPageChange("testQuestion");
  };

  const nextTab5 = () => {
    // New function for Test Quiz tab
    setTabChange4(true);
    setTabChange(true);
    setPageChange("success");
  };

  return (
    <>
      <div className="main-wrapper">
        <InstructorHeader
          activeMenu={isEditing ? "Edit Course" : "Add Course"}
        />

        <section className="page-content course-sec">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="add-course-header">
                  <h2>{isEditing ? "Edit Course" : "Add New Course"}</h2>
                  <div className="add-course-btns">
                    <ul className="nav">
                      <li>
                        <Link
                          to="/instructor/instructor-course"
                          className="btn btn-black"
                        >
                          Back to Course
                        </Link>
                      </li>
                      <li>
                        {isEditing ? (
                          <button
                            className="btn btn-success-dark"
                            onClick={handleUpdateCourse}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Update"}
                          </button>
                        ) : (
                          <button
                            className="btn btn-success-dark"
                            onClick={handleSaveDraft}
                            disabled={isCreating}
                          >
                            {isCreating ? "Saving..." : "Save as Draft"}
                          </button>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="widget-set">
                    <div className="widget-setcount">
                      <ul id="progressbar">
                        <li
                          className={
                            TabChange ? "progress-activated" : "progress-active"
                          }
                        >
                          <p>
                            <span></span> Basic Information
                          </p>
                        </li>
                        <li
                          className={
                            TabChange1
                              ? "progress-activated"
                              : "" || TabChange
                              ? "progress-active"
                              : ""
                          }
                        >
                          <p>
                            <span></span> Courses Media
                          </p>
                        </li>
                        <li
                          className={
                            TabChange2
                              ? "progress-activated"
                              : "" || TabChange1
                              ? "progress-active"
                              : ""
                          }
                        >
                          <p>
                            <span></span> Curriculum
                          </p>
                        </li>
                        <li
                          className={
                            TabChange3
                              ? "progress-activated"
                              : "" || TabChange2
                              ? "progress-active"
                              : ""
                          }
                        >
                          <p>
                            <span /> Test Question
                          </p>
                        </li>
                        <li
                          className={
                            TabChange4
                              ? "progress-activated"
                              : "" || TabChange3
                              ? "progress-active"
                              : ""
                          }
                        >
                          <p>
                            <span /> Settings
                          </p>
                        </li>
                      </ul>
                    </div>

                    <div className="widget-content multistep-form">
                      {PageChange === "basic" ? (
                        <Basic nextTab={nextTab} />
                      ) : (
                        ""
                      )}
                      {PageChange === "courseMedia" ? (
                        <CourseMedia nextTab2={nextTab2} prevTab1={prevTab1} />
                      ) : (
                        ""
                      )}
                      {PageChange === "curriculum" ? (
                        <Curriculum nextTab3={nextTab3} prevTab2={prevTab2} />
                      ) : (
                        ""
                      )}
                      {PageChange === "testQuestion" ? (
                        <TestQuestion nextTab4={nextTab4} prevTab3={prevTab3} />
                      ) : (
                        ""
                      )}
                      {PageChange === "settings" ? (
                        <Settings nextTab5={nextTab5} prevTab4={prevTab4} isEditing={isEditing} />
                      ) : (
                        ""
                      )}
                      {PageChange === "success" ? <Success /> : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AddOrEditCourse;
