import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMediaInfo } from "../../../redux/slices/course/courseSlice";
import "./utils/CourseMedia.css";
// eslint-disable-next-line react/prop-types
const CourseMedia = ({ prevTab1, nextTab2 }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const [isUploading, setIsUploading] = useState(false);
  //fix loi hinh anh
  const {
    imageFileName,
    imageUrl = "",
    videoUrl,
    videoThumbnail,
  } = useSelector((state) => state.course.mediaInfo);
  const [localImageUrl, setLocalImageUrl] = useState("");

  const validateFields = () => {
    const newErrors = {};
    
    // Kiểm tra ảnh có được upload hay không
    if (!imageUrl) newErrors.imageUrl = "Please upload a course cover image.";
    
    // Kiểm tra video URL hợp lệ (phải là YouTube)
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    if (!videoUrl) {
      newErrors.videoUrl = "Please provide a video URL.";
    } else if (!youtubeRegex.test(videoUrl)) {
      newErrors.videoUrl = "Invalid YouTube URL. Please enter a valid link.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Nếu không có lỗi, trả về `true`
  };

  
  useEffect(() => {
    if (imageUrl) {
      setLocalImageUrl(`${imageUrl}?timestamp=${new Date().getTime()}`);
    }
  }, [imageUrl, isUploading]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    const allowedExtensions = ["jpg", "jpeg", "png"];
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Only JPG, JPEG, or PNG images are allowed.");
      return;
    }
    // Upload the image to the server
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "course"); // type is course for course images
    setIsUploading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!response.data) {
        throw new Error("No response data from server.");
      }

      const fileUrlFromServer = response.data;
      const updatedImageUrl = `${fileUrlFromServer}?timestamp=${new Date().getTime()}`;
      const fileNameFromServer = fileUrlFromServer.split("/").pop();

      await waitForFileReady(fileUrlFromServer);

      dispatch(
        setMediaInfo({
          imageFileName: fileNameFromServer,
          imageUrl: updatedImageUrl,
        })
      );
      setLocalImageUrl(updatedImageUrl);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false); // Kết thúc trạng thái tải
    }
  };

  useEffect(() => {
    // Khi videoUrl thay đổi, tự động cập nhật videoThumbnail
    if (videoUrl) {
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
      const match = videoUrl.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1]; // `videoId` từ regex
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        // Cập nhật videoThumbnail trong Redux
        dispatch(
          setMediaInfo({
            videoThumbnail: thumbnailUrl,
          })
        );
      } else {
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
          alert("Invalid YouTube URL. Please check the link.");
        } else {
          alert("Only YouTube URLs are supported.");
        }
        // Xóa videoThumbnail nếu videoUrl không hợp lệ
        dispatch(setMediaInfo({ videoThumbnail: "" }));
      }
    }
  }, [videoUrl, dispatch]);

  const waitForFileReady = async (fileUrl) => {
    let isFileReady = false;
    let attempts = 0;
    const maxAttempts = 20; // Thử tối đa 10 lần (tương đương 5 giây)

    while (!isFileReady && attempts < maxAttempts) {
      try {
        // Gửi request HEAD để kiểm tra file có tồn tại không
        await axios.head(fileUrl, { timeout: 500 });
        isFileReady = true;
      } catch (error) {
        console.log(`Waiting for file... Attempt ${attempts + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Đợi 500ms trước khi thử lại
        attempts++;
      }
    }

    if (!isFileReady) {
      console.warn("File not available after multiple attempts.");
    }
  };

  const handleNext = () => {
    if (validateFields()) {
      nextTab2(); // Chỉ chuyển tab nếu không có lỗi
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
              {errors.imageUrl && <span className="error text-danger">{errors.imageUrl}</span>}
              <div className="input-block">
                <div className="add-image-box">
                  {isUploading ? (
                    <div className="spinner"></div> // Hiển thị trạng thái tải
                  ) : localImageUrl ? (
                    <img
                      src={localImageUrl}
                      alt="Course Cover"
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ color: "#aaa" }}>No image uploaded</span>
                  )}
                </div>
              </div>
             

              <div className="input-block">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Video URL"
                  value={videoUrl}
                  onChange={(e) =>
                    dispatch(setMediaInfo({ videoUrl: e.target.value }))
                  }
                />
              </div>
              {errors.videoUrl && <span className="error text-danger">{errors.videoUrl}</span>}
              <div className="input-block">
                <div className="add-image-box add-video-box">
                  {videoThumbnail ? (
                    <img
                      src={videoThumbnail}
                      alt="Video Thumbnail"
                      style={{ width: "200px", height: "120px" }}
                    />
                  ) : (
                    <span style={{ color: "#aaa" }}>
                      No video thumbnail available
                    </span>
                  )}
                </div>
              </div>
              
            </form>
          </div>
          <div className="widget-btn">
            <Link className="btn btn-black prev_btn" onClick={prevTab1}>
              Previous
            </Link>
            <Link className="btn btn-info-light next_btn" onClick={handleNext}>
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
