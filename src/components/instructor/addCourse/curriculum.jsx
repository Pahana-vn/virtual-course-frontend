import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Popup from "./popup";
import {
  addSection,
  updateSection,
  deleteSection,
  addLecture,
  updateLecture,
  deleteLecture,
} from "../../common/redux/slices/courseSlice";
import "./Curriculum.css";
// eslint-disable-next-line react/prop-types
const Curriculum = ({ nextTab3, prevTab2 }) => {
  const dispatch = useDispatch();
  const { sections } = useSelector((state) => state.course.curriculumInfo);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupInput, setPopupInput] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupAction, setPopupAction] = useState(() => () => {});
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpenPopup = (title, action, defaultValue = "") => {
    setPopupTitle(title);
    setPopupAction(() => action);
    setPopupInput(defaultValue); // Hiển thị giá trị mặc định
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

  const handleAddSection = (title) => {
    dispatch(
      addSection({
        title,
        lectures: [],
      })
    );
  };

  const handleUpdateSection = (sectionIndex, newTitle) => {
    dispatch(updateSection({ index: sectionIndex, title: newTitle }));
  };

  const handleDeleteSection = (sectionIndex) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      dispatch(deleteSection({ index: sectionIndex }));
    }
  };

  const handleAddLecture = (sectionIndex, title) => {
    const newLecture = {
      title,
      articles: [],
      videoUrl: "",
      videoThumbnail: "",
    };
    dispatch(addLecture({ sectionIndex, lecture: newLecture }));
  };

  const handleUpdateLecture = (sectionIndex, lectureIndex, data) => {
    dispatch(updateLecture({ sectionIndex, lectureIndex, lecture: data }));
  };

  const handleDeleteLecture = (sectionIndex, lectureIndex) => {
    // Gọi action deleteLecture từ Redux
    dispatch(deleteLecture({ sectionIndex, lectureIndex }));
  };

  const handleAddArticle = (sectionIndex, lectureIndex) => {
    const currentArticles =
      sections[sectionIndex].lectures[lectureIndex].articles;

    // Validate số lượng file pdf
    if (currentArticles.length >= 1) {
      setErrorMessage("You can only upload a maximum of 1 articles.");
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf"; // Restrict to PDF files only
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate file upload and get the file URL
        const uploadedFile = {
          name: file.name,
          url: `/uploads/articles/${file.name}`, // This is a mock. Replace with actual upload logic.
          content: "",
        };
        const updatedLecture = {
          ...sections[sectionIndex].lectures[lectureIndex],
          articles: [...currentArticles, uploadedFile], // Thêm file mới
        };
        handleUpdateLecture(sectionIndex, lectureIndex, updatedLecture);
        setErrorMessage(""); // Reset lỗi
      }
    };
    fileInput.click();
  };

  const handleDeleteArticle = (sectionIndex, lectureIndex, articleIndex) => {
    const updatedArticles = sections[sectionIndex].lectures[
      lectureIndex
    ].articles.filter((_, index) => index !== articleIndex);
    const updatedLecture = {
      ...sections[sectionIndex].lectures[lectureIndex],
      articles: updatedArticles,
    };
    handleUpdateLecture(sectionIndex, lectureIndex, updatedLecture);
  };

  const handleVideoUrlChange = async (sectionIndex, lectureIndex, url) => {
    const youtubeRegEx =
      /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/.exec(
        url
      );

    let videoThumbnail = "";
    let videoDuration = "";
    if (youtubeRegEx) {
      const videoId = youtubeRegEx[3];
      videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      try {
        // Gọi API YouTube để lấy thông tin video
        console.log(process.env.YOUTUBE_DATA_API_V3);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.REACT_APP_YOUTUBE_DATA_API_V3}&part=contentDetails`
        );
        const data = await response.json();
        // console.log("YouTube API Response:", data);

        if (data.items && data.items.length > 0) {
          const durationISO = data.items[0].contentDetails.duration;

          // Chuyển đổi ISO 8601 thành giây
          videoDuration = parseYouTubeDuration(durationISO);
          // console.log("Parsed video duration:", videoDuration);
        }
      } catch (error) {
        console.error("Error fetching video duration:", error);
      }
    }

    const updatedLecture = {
      ...sections[sectionIndex].lectures[lectureIndex],
      videoUrl: url,
      videoThumbnail,
      videoDuration,
    };

    handleUpdateLecture(sectionIndex, lectureIndex, updatedLecture);
  };

  const parseYouTubeDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    return hours * 3600 + minutes * 60 + seconds; // Trả về tổng số giây
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  return (
    <>
      <fieldset className="field-card" style={{ display: "block" }}>
        <div className="add-course-info">
          <div className="add-course-inner-header">
            <h4>Curriculum</h4>
          </div>
          <div className="add-course-section">
            <button
              className="btn"
              onClick={() =>
                handleOpenPopup("Add Section", (title) =>
                  handleAddSection(title)
                )
              }
            >
              Add Section
            </button>
          </div>
          {/* Hiển thị các Section */}
          <div className="add-course-form">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="curriculum-grid">
                <div className="curriculum-head">
                  <p>
                    Section {sectionIndex + 1}: {section.title}
                  </p>
                  <div className="section-actions">
                    {/* Nút Chỉnh sửa */}
                    <button
                      className="btn btn-edit-section"
                      onClick={() =>
                        handleOpenPopup(
                          "Edit Section Title",
                          (newTitle) =>
                            handleUpdateSection(sectionIndex, newTitle),
                          section.title // Giá trị mặc định
                        )
                      }
                    >
                      <i className="far fa-pen-to-square" />
                    </button>
                    {/* Nút Xóa */}
                    <button
                      className="btn btn-delete-section"
                      onClick={() => handleDeleteSection(sectionIndex)}
                    >
                      <i className="far fa-trash-can" />
                    </button>
                  </div>
                  <button
                    className="btn"
                    onClick={() =>
                      handleOpenPopup("Add Lecture", (title) =>
                        handleAddLecture(sectionIndex, title)
                      )
                    }
                  >
                    Add Lecture
                  </button>
                </div>
                <div className="curriculum-info">
                  {/* Nội dung Section */}
                  <div id={`accordion-${sectionIndex}`}>
                    {section.lectures.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className="faq-grid">
                        <div className="faq-header">
                          <Link
                            className="collapsed faq-collapse"
                            data-bs-toggle="collapse"
                            to={`#collapse-${sectionIndex}-${lectureIndex}`}
                          >
                            <i className="fas fa-align-justify" />{" "}
                            Lecture {lectureIndex + 1}: {lecture.title}
                          </Link>
                          <div className="faq-right">
                            <button
                              className="btn btn-edit"
                              onClick={() =>
                                handleOpenPopup(
                                  "Edit Lecture",
                                  (title) =>
                                    handleUpdateLecture(
                                      sectionIndex,
                                      lectureIndex,
                                      {
                                        ...lecture,
                                        title,
                                      }
                                    ),
                                  lecture.title
                                )
                              }
                            >
                              <i className="far fa-pen-to-square me-1" />
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this lecture?"
                                  )
                                ) {
                                  handleDeleteLecture(
                                    sectionIndex,
                                    lectureIndex
                                  );
                                }
                              }}
                            >
                              <i className="far fa-trash-can" />
                            </button>
                          </div>
                        </div>

                        <div
                          id={`collapse-${sectionIndex}-${lectureIndex}`}
                          className="collapse"
                          data-bs-parent={`#accordion-${sectionIndex}`}
                        >
                          <div className="faq-body">
                            {/* Show Video */}
                            <div className="input-block">
                              Lecture Video URL:<input
                                type="text"
                                className="form-control"
                                placeholder="Video URL"
                                value={lecture.videoUrl}
                                onChange={(e) =>
                                  handleVideoUrlChange(
                                    sectionIndex,
                                    lectureIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            {lecture.videoUrl && (
                              <>
                                <div className="input-block">
                                  <div className="add-image-box add-video-box">
                                    {lecture.videoThumbnail && (
                                      <img
                                        src={lecture.videoThumbnail}
                                        alt="Video Thumbnail"
                                        style={{
                                          width: "200px",
                                          height: "120px",
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                                {/* Hiển thị Duration */}
                                {lecture.videoDuration && (
                                  <p>
                                    <strong>Duration:</strong>{" "}
                                    {formatDuration(lecture.videoDuration)} (hh:mm:ss)
                                  </p>
                                )}
                              </>
                            )}

                            {/* Show Articles */}
                            {lecture.articles.length > 0 && (
                              <div className="lecture-articles">
                                <strong>Articles:</strong>
                                <ul>
                                  {lecture.articles.map(
                                    (article, articleIndex) => (
                                      <li key={articleIndex}>
                                        <a
                                          href={article.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {article.name}
                                        </a>
                                        <button
                                          className="btn btn-delete-article"
                                          onClick={() =>
                                            handleDeleteArticle(
                                              sectionIndex,
                                              lectureIndex,
                                              articleIndex
                                            )
                                          }
                                        >
                                          ✖
                                        </button>
                                        {/* Input để nhập Content */}
                                        <textarea
                                          className="form-control my-3"
                                          value={article.content}
                                          placeholder="Enter content for this article"
                                          onChange={(e) => {
                                            const updatedArticles =
                                              lecture.articles.map((a, idx) =>
                                                idx === articleIndex
                                                  ? {
                                                      ...a,
                                                      content: e.target.value,
                                                    }
                                                  : a
                                              );
                                            const updatedLecture = {
                                              ...sections[sectionIndex]
                                                .lectures[lectureIndex],
                                              articles: updatedArticles,
                                            };
                                            handleUpdateLecture(
                                              sectionIndex,
                                              lectureIndex,
                                              updatedLecture
                                            );
                                          }}
                                        />
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            <div className="add-article-btns">
                              <button
                                className="btn"
                                onClick={() =>
                                  handleAddArticle(sectionIndex, lectureIndex)
                                }
                              >
                                Add Article
                              </button>
                              {errorMessage && (
                                <p className="error-message">{errorMessage}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="widget-btn">
            <Link className="btn btn-black prev_btn" onClick={prevTab2}>
              Previous
            </Link>
            <Link className="btn btn-info-light next_btn" onClick={nextTab3}>
              Continue
            </Link>
          </div>
        </div>
      </fieldset>
      {/* Popup thêm Section */}
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

Curriculum.propTypes = {
  nextTab3: PropTypes.func.isRequired,
  prevTab2: PropTypes.func.isRequired,
};

export default Curriculum;
