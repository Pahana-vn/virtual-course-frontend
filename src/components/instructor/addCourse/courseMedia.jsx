import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMediaInfo } from "../../common/redux/slices/courseSlice";

// eslint-disable-next-line react/prop-types
const CourseMedia = ({ prevTab1, nextTab2 }) => {
  const dispatch = useDispatch();
  const { imageFileName, imageUrl, videoUrl, videoThumbnail } = useSelector(
    (state) => state.course.mediaInfo
  );
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      if (
        fileExtension === "jpg" ||
        fileExtension === "jpeg" ||
        fileExtension === "png"
      ) {
        // Lưu thông tin file name vào Redux
        dispatch(setMediaInfo({ imageFileName: fileName }));

        // Upload the image to the server
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "courses"); // type is course for course images

        try {
          const response = await axios.post(
            "http://localhost:8080/api/files/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          const fileNameFromServer = response.data;
          // Assuming response.data is the URL of the uploaded image
          dispatch(setMediaInfo({ imageUrl: fileNameFromServer }));
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("Error uploading image");
        }
      } else {
        alert("Only JPG, JPEG, or PNG images are allowed.");
      }
    }
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;

    // Lưu video URL vào Redux
    dispatch(setMediaInfo({ videoUrl: url }));

    // Trích xuất video ID từ URL YouTube sử dụng regex mới
    const youtubeRegEx =
      /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/.exec(
        url
      );

    if (youtubeRegEx) {
      const videoId = youtubeRegEx[3]; // videoId sẽ là phần trích xuất từ nhóm thứ 3 trong regex
      dispatch(
        setMediaInfo({
          videoThumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        })
      );
    } else {
      dispatch(setMediaInfo({ videoThumbnail: "" })); // Xóa thumbnail nếu URL không hợp lệ
    }
  };
  return (
    <>
      <fieldset className="field-card" style={{ display: "block" }}>
        <div className="add-course-info">
          <div className="add-course-inner-header">
            <h4>Courses Media</h4>
          </div>
          <div className="add-course-form">
            <form action="#">
              <div className="input-block">
                <label className="add-course-label">Course cover image</label>
                <div className="relative-form">
                  <span>{imageFileName || "No File Selected"}</span>
                  <label className="relative-file-upload">
                    Upload File
                    <input type="file" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
              <div className="input-block">
                <div className="add-image-box">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Course Cover"
                      style={{ width: "100px", height: "100px" }}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
              <div className="input-block">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Video URL"
                  value={videoUrl}
                  onChange={handleVideoUrlChange}
                />
              </div>
              <div className="input-block">
                <div className="add-image-box add-video-box">
                  {videoThumbnail && (
                    <img
                      src={videoThumbnail}
                      alt="Video Thumbnail"
                      style={{ width: "200px", height: "120px" }}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="widget-btn">
            <Link className="btn btn-black prev_btn" onClick={prevTab1}>
              Previous
            </Link>
            <Link className="btn btn-info-light next_btn" onClick={nextTab2}>
              Continue
            </Link>
          </div>
        </div>
      </fieldset>
    </>
  );
};

// Xác nhận kiểu dữ liệu của props
CourseMedia.propTypes = {
  prevTab1: PropTypes.func.isRequired, // prevTab1 phải là một hàm
  nextTab2: PropTypes.func.isRequired, // nextTab2 phải là một hàm
};

export default CourseMedia;
