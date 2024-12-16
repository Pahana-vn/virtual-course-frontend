import React, { useEffect, useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { Link, useParams } from "react-router-dom";
import YouTube from 'react-youtube';
import { fetchCourseDetailsForStudent } from "../../../../services/courseService";
import { completeLecture } from "../../../../services/progressService";
import Footer from "../../../footer";
import { Lock, Play } from "../../../imagepath";
import PageHeader from "../../header";

const CourseLesson = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const studentId = 1; // Giả sử studentId = 1

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchCourseDetailsForStudent(courseId, studentId);
        setCourse(data);

        if (data.sections && data.sections.length > 0 && data.sections[0].lectures.length > 0) {
          setSelectedLecture(data.sections[0].lectures[0]);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchDetails();
  }, [courseId, studentId]);

  const toggleSection = (sectionId) => {
    setOpenSections(prevState => ({
      ...prevState,
      [sectionId]: !prevState[sectionId]
    }));
  };

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  const onVideoEnd = async () => {
    if (!selectedLecture) return;
    try {
      await completeLecture(studentId, selectedLecture.id);

      // Phải truyền cả studentId
      const updatedData = await fetchCourseDetailsForStudent(courseId, studentId);
      setCourse(updatedData);

      const currentLectureId = selectedLecture.id;
      let updatedLecture = null;
      updatedData.sections.forEach(section => {
        const found = section.lectures.find(l => l.id === currentLectureId);
        if (found) updatedLecture = found;
      });

      if (updatedLecture) setSelectedLecture(updatedLecture);
    } catch (error) {
      console.error("Error completing lecture:", error);
    }
  };


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
        onEnd={onVideoEnd}
      />
    );
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-wrapper">
      <PageHeader />
      <section className="page-content course-sec course-lesson">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
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
                {/* Hiển thị bài test cuối khóa hoặc thông báo */}
                <div style={{ marginTop: '20px' }}>
                  {course.finalTestId ? (
                    course.allLecturesCompleted ? (
                      <div>
                        <h4 style={{ color: 'green', fontWeight: 'bold' }}>
                          Take The Test
                        </h4>
                        <Link to={`/student-final-test/${course.finalTestId}`} className="btn btn-primary">
                          {course.finalTestTitle || "Final Test"}
                        </Link>
                      </div>
                    ) : (
                      <div style={{ color: 'gray', fontWeight: 'bold' }}>
                        You need to complete all lectures before taking the final test.
                        <button
                          disabled
                          className="btn btn-secondary"
                          style={{ marginTop: '10px', cursor: 'not-allowed' }}
                        >
                          Take the Test
                        </button>
                      </div>
                    )
                  ) : (
                    <p>The course does not have a final test.</p>
                  )}
                </div>

              </div>
            </div>
            {/* /Sidebar */}

            {/* Content Area */}
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

                    {/* Hiển thị Article nếu có */}
                    {selectedLecture.articles && selectedLecture.articles.length > 0 && (
                      <div className="lecture-articles" style={{ marginTop: '20px' }}>
                        <h5 style={{ fontWeight: 'bold', marginBottom: '15px' }}>References:</h5>
                        {selectedLecture.articles.map((article) => (
                          <div key={article.id} className="article-item" style={{ marginBottom: '10px' }}>
                            <p>{article.content}</p>
                            {article.fileUrl && (
                              <a href={article.fileUrl} target="_blank" rel="noopener noreferrer">
                                {/* <b>Click to View Document</b> */}
                                <button type="button" className="btn btn-outline-secondary">Click to View Document</button>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
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

const extractYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\s/]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default CourseLesson;
