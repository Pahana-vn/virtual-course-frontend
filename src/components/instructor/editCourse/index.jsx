import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { InstructorHeader } from "../header";
import Footer from "../../footer";
import InstructorSidebar from "../sidebar";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "../../../redux/slices/courseApiSlice";

const EditCourse = () => {
    const { courseId } = useParams();
    const courseIdNumber = Number(courseId);
    
  const navigate = useNavigate();

  const { data: course, isLoading, isError } = useGetCourseByIdQuery({id: courseIdNumber});
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [formData, setFormData] = useState({
    titleCourse: "",
    description: "",
    basePrice: "",
    discountPrice: "",
    imageCover: "",
    duration: "",
    lessonsCount: "",
  });

  useEffect(() => {
    if (course) {
      setFormData({
        titleCourse: course.titleCourse || "",
        description: course.description || "",
        basePrice: course.basePrice || "",
        discountPrice: course.discountPrice || "",
        imageCover: course.imageCover || "",
        duration: course.duration || "",
        lessonsCount: course.lessonsCount || "",
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse({ id: courseId, courseData: formData }).unwrap();
      alert("Course updated successfully!");
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  if (isLoading) return <p>Loading course data...</p>;
  if (isError) return <p>Error loading course data.</p>;

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Edit Course"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Edit Course</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/instructor/courses">My Courses</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Course
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="row">
            <InstructorSidebar />
            <div className="col-xl-9 col-lg-9">
              <div className="settings-widget card-details">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Edit Course</h3>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-12">
                        <label>Title</label>
                        <input
                          type="text"
                          name="titleCourse"
                          className="form-control"
                          value={formData.titleCourse}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-12">
                        <label>Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div className="col-sm-6">
                        <label>Base Price</label>
                        <input
                          type="number"
                          name="basePrice"
                          className="form-control"
                          value={formData.basePrice}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>Discount Price</label>
                        <input
                          type="number"
                          name="discountPrice"
                          className="form-control"
                          value={formData.discountPrice}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>Duration</label>
                        <input
                          type="text"
                          name="duration"
                          className="form-control"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>Lessons Count</label>
                        <input
                          type="number"
                          name="lessonsCount"
                          className="form-control"
                          value={formData.lessonsCount}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-12">
                        <label>Image Cover URL</label>
                        <input
                          type="text"
                          name="imageCover"
                          className="form-control"
                          value={formData.imageCover}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-12 mt-3">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Save Changes"}
                        </button>
                        <Link
                          to="/instructor/courses"
                          className="btn btn-secondary ms-3"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditCourse;
