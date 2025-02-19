import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";
import SettingsPageHeader from "./settingsPageHeader";
import {
  useGetEducationsQuery,
  useManageEducationMutation,
  useDeleteEducationMutation,
} from "../../../redux/slices/instructor/InstructorProfileApiSlice";
import CustomInput from "./customInput";
const InstructorProfileEducation = () => {
  const currentYear = new Date().getFullYear();
  const instructorId = useSelector(selectCurrentInstructor);

  const {
    data: educationProfile,
    isLoading,
    isError,
  } = useGetEducationsQuery({ instructorId });

  const [manageEducation] = useManageEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const [selectedEducation, setSelectedEducation] = useState(null);
  const [editableEducation, setEditableEducation] = useState({
    degree: "",
    university: "",
    startYear: "",
    endYear: "",
    description: "",
  });

  useEffect(() => {
    if (educationProfile) {
      setSelectedEducation(null); // Reset khi có thay đổi
      setEditableEducation({
        degree: "",
        university: "",
        startYear: "",
        endYear: "",
        description: "",
      });
    }
  }, [educationProfile]);

  const handleSaveEducation = async () => {
    if (!editableEducation.degree.trim()) {
      alert("Degree is required.");
      return;
    }

    try {
      const payload = { ...editableEducation, instructorId };

      if (selectedEducation) {
        await manageEducation({
          instructorId,
          educationId: selectedEducation.id,
          education: payload,
          method: "PUT",
        }).unwrap();
        alert("Education updated successfully!");
      } else {
        await manageEducation({
          instructorId,
          education: payload,
          method: "POST",
        }).unwrap();
        alert("Education added successfully!");
      }
      setEditableEducation({
        degree: "",
        university: "",
        startYear: "",
        endYear: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to save education:", error);
      alert("Failed to save education. Please try again.");
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (!window.confirm("Are you sure you want to delete this education?"))
      return;

    try {
      await deleteEducation({
        instructorId,
        educationId,
      }).unwrap();
      alert("Education deleted successfully!");
    } catch (error) {
      console.error("Failed to delete education:", error);
      alert("Failed to delete education. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading education details.</p>;

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Settings"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Education</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Education
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
                <div className="settings-menu p-3">
                  <div className="profile-heading">
                    <h3>Education Details</h3>
                    <p>Edit your education information</p>
                  </div>
                  <SettingsPageHeader />
                  <div className="row">
                    {/* Left Section: List of Education */}
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <h3>Education</h3>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                setEditableEducation({
                                  degree: "",
                                  university: "",
                                  startYear: "",
                                  endYear: "",
                                  description: "",
                                });
                                setSelectedEducation(null);
                              }}
                            >
                              Add
                            </button>
                          </div>
                          <ul className="list-group">
                            {educationProfile?.map((edu) => (
                              <li
                                key={edu.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <button
                                  className="btn btn-link text-center flex-grow-1"
                                  onClick={() => {
                                    setEditableEducation(edu);
                                    setSelectedEducation(edu);
                                  }}
                                >
                                  {edu.degree}
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteEducation(edu.id)}
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 p-3 bg-light border rounded">
                            <h5>How to Manage Your Education Records:</h5>
                            <small>
                            <p>
                                - Click the <b>Add</b> button, fill (Degree, University, Start Year, End Year and Description) on the right panel and then press <b>Save Education</b> to create a new education record. 
                              </p>
                              <p>
                                - Click on an existing education item to edit the information fields on the right. Then click <b>Save Education</b> to update your existing item.
                              </p>
                              <p>
                                - Press the <b>Delete</b> button to remove an
                                education record permanently.
                              </p>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Education Details */}
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-header">
                          <h5>Education Details</h5>
                        </div>
                        <div className="card-body">
                          {/* Degree */}
                          <div className="form-group">
                            <label className="fw-bold">Degree</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editableEducation.degree}
                              onChange={(e) =>
                                setEditableEducation({
                                  ...editableEducation,
                                  degree: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* University */}
                          <div className="form-group">
                            <label className="fw-bold">University</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editableEducation.university}
                              onChange={(e) =>
                                setEditableEducation({
                                  ...editableEducation,
                                  university: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Start Year */}
                          <div className="row">
                            <div className="col-md-6 my-3">
                              <label className="fw-bold mx-2">Start Year</label>
                              <DatePicker
                                selected={editableEducation.startYear ? new Date(editableEducation.startYear, 0, 1) : null}
                                onChange={(date) =>
                                  setEditableEducation({
                                    ...editableEducation,
                                    startYear: date.getFullYear(),
                                  })
                                }
                                showYearPicker
                                dateFormat="yyyy"
                                yearDropdownItemNumber={100}
                              scrollableYearDropdown
                              minDate={new Date(1900, 0, 1)}
                              maxDate={new Date(currentYear, 0, 1)}
                              customInput={<CustomInput />}
                                className="form-control"
                              />
                            </div>

                            <div className="col-md-6 my-3">
                              <label className="fw-bold mx-2">End Year</label>
                              <DatePicker
                                selected={editableEducation.endYear ? new Date(editableEducation.endYear, 0, 1) : null}
                                onChange={(date) =>
                                  setEditableEducation({
                                    ...editableEducation,
                                    endYear: date.getFullYear(),
                                  })
                                }
                                showYearPicker
                                dateFormat="yyyy"
                                yearDropdownItemNumber={100}
                                editableEducation
                              minDate={
                                editableEducation.startYear
                                  ? new Date(editableEducation.startYear, 0, 1)
                                  : new Date(1900, 0, 1)
                              }
                              maxDate={new Date(currentYear, 0, 1)}
                              customInput={<CustomInput />}
                                className="form-control"
                              />
                            </div>
                          </div>
                          {/* Description */}
                          <div className="form-group">
                            <label className="fw-bold">Description</label>
                            <textarea
                              className="form-control"
                              rows="4"
                              value={editableEducation.description}
                              onChange={(e) =>
                                setEditableEducation({
                                  ...editableEducation,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Save Button */}
                          <button
                            className="btn btn-primary my-2"
                            onClick={handleSaveEducation}
                          >
                            Save Education
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default InstructorProfileEducation;
