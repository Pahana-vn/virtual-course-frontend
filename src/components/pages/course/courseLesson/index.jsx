import React, { useEffect, useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { Link, useParams } from "react-router-dom";
import YouTube from 'react-youtube';
import { fetchCourseDetails } from "../../../../services/courseService";
import { completeLecture } from "../../../../services/progressService";
import Footer from "../../../footer";
import { Lock, Play } from "../../../imagepath";
import PageHeader from "../../header";

const CourseLesson = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const studentId = 1; // Giả sử studentId = 1 (có thể thay bằng logic lấy studentId thật)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Lấy dữ liệu chi tiết khoá học
        const data = await fetchCourseDetails(courseId);
        setCourse(data);

        // Nếu khoá học có sections và section đầu tiên có lectures
        // thì chọn bài giảng đầu tiên làm mặc định
        if (data.sections && data.sections.length > 0 && data.sections[0].lectures.length > 0) {
          setSelectedLecture(data.sections[0].lectures[0]);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchDetails();
  }, [courseId]);

  // Hàm toggle mở/đóng danh sách lectures trong 1 section
  const toggleSection = (sectionId) => {
    setOpenSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  };

  // Khi người dùng click chọn 1 bài giảng
  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  // Sự kiện gọi khi video kết thúc
  const onVideoEnd = async () => {
    if (!selectedLecture) return;
    try {
      // Gọi API đánh dấu lecture đã hoàn thành
      await completeLecture(studentId, selectedLecture.id);

      // Cập nhật lại dữ liệu khoá học sau khi đánh dấu hoàn thành
      const updatedData = await fetchCourseDetails(courseId);
      setCourse(updatedData);

      // Lấy lại lecture hiện tại dựa trên ID
      const currentLectureId = selectedLecture.id;
      let updatedLecture = null;
      updatedData.sections.forEach(section => {
        const found = section.lectures.find(l => l.id === currentLectureId);
        if (found) updatedLecture = found;
      });

      // Cập nhật state selectedLecture nếu tìm thấy
      if (updatedLecture) setSelectedLecture(updatedLecture);
    } catch (error) {
      console.error("Error completing lecture:", error);
    }
  };

  // Render YouTube Player
  const renderYouTubePlayer = (videoUrl) => {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) return <p>Invalid video URL</p>;

    const opts = {
      width: '100%',
      height: '400',
      playerVars: {
        autoplay: 0,
      },
    };

    return (
      <YouTube
        videoId={videoId}
        opts={opts}
        onEnd={onVideoEnd} // Gọi onVideoEnd khi video kết thúc
      />
    );
  };

  // Nếu chưa có dữ liệu khoá học thì hiển thị Loading...
  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-wrapper">
      {/* Header */}
      <PageHeader />
      <section className="page-content course-sec course-lesson">
        <div className="container">
          <div className="row">
            {/* Sidebar với danh sách section và lectures */}
            <div className="col-lg-4">
              <div className="lesson-group">
                {course.sections.map((section) => (
                  <div className="course-card" key={section.id} style={{ marginBottom: '20px' }}>
                    <h6 className="cou-title" style={{ marginBottom: '10px' }}>
                      <Link
                        className="collapsed"
                        to="#"
                        onClick={() => toggleSection(section.id)}
                        aria-controls={`collapse-${section.id}`}
                        aria-expanded={openSections[section.id] || false}
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {section.titleSection}{" "}
                        <span style={{ color: '#777', fontWeight: 'normal' }}>
                          {section.lectures.length} Lessons
                        </span>
                      </Link>
                    </h6>
                    <Collapse in={openSections[section.id]}>
                      <div
                        id={`collapse-${section.id}`}
                        className="card-collapse collapse"
                        style={{ paddingLeft: '10px', borderLeft: '2px solid #eee' }}
                      >
                        <ul style={{ listStyle: 'none', paddingLeft: '0', margin: 0 }}>
                          {section.lectures.map((lecture) => (
                            <li key={lecture.id}
                              style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleLectureClick(lecture)}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  color: 'black',
                                  textDecoration: 'none',
                                  fontWeight: lecture.id === selectedLecture?.id ? 'bold' : 'normal',
                                  flex: '1',
                                  paddingRight: '10px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {lecture.titleLecture}
                              </p>
                              <div style={{ flexShrink: 0 }}>
                                {lecture.lectureVideo ? (
                                  <img src={Play} alt="Play" style={{ width: '20px', height: '20px' }} />
                                ) : (
                                  <img src={Lock} alt="Locked" style={{ width: '20px', height: '20px' }} />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>
            </div>
            {/* /Sidebar */}

            {/* Khu vực hiển thị video và nội dung bài giảng */}
            <div className="col-lg-8">
              <div className="lesson-widget-group">
                {selectedLecture ? (
                  <>
                    <h4 className="tittle" style={{ fontWeight: 'bold', marginBottom: '20px', color: 'red' }}>
                      {selectedLecture.titleLecture}
                    </h4>
                    {selectedLecture.lectureVideo ? (
                      <div className="introduct-video" style={{ marginBottom: '20px' }}>
                        {renderYouTubePlayer(selectedLecture.lectureVideo)}
                      </div>
                    ) : (
                      <p style={{ color: '#999' }}>This lecture is locked.</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: '#999' }}>Please select a lecture to view.</p>
                )}
              </div>
            </div>
            {/* /Content */}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// Hàm trích xuất videoId từ URL YouTube
const extractYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\s/]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default CourseLesson;
