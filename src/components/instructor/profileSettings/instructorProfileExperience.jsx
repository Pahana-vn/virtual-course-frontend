import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  useGetExperiencesQuery,
  useManageExperienceMutation,
  useDeleteExperienceMutation,
} from "../../../redux/slices/instructor/InstructorProfileApiSlice";


const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="form-control text-start bg-white" onClick={onClick} ref={ref}>
    {value || "Select Year"}
  </button>
));

CustomInput.displayName = "CustomInput";
CustomInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

const InstructorProfileExperience = () => {
  const currentYear = new Date().getFullYear();
  const instructorId = useSelector(selectCurrentInstructor);

  const {
    data: experienceProfile,
    isLoading,
    isError,
  } = useGetExperiencesQuery({ instructorId });

  const [manageExperience] = useManageExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();

  const [selectedExperience, setSelectedExperience] = useState(null);
  const [editableExperience, setEditableExperience] = useState({
    position: "",
    company: "",
    startYear: "",
    endYear: "",
    description: "",
  });

  useEffect(() => {
    if (experienceProfile) {
      setSelectedExperience(null);
      setEditableExperience({
        position: "",
        company: "",
        startYear: "",
        endYear: "",
        description: "",
      });
    }
  }, [experienceProfile]);

  const handleSaveExperience = async () => {
    if (!editableExperience.position.trim()) {
      alert("Position is required.");
      return;
    }

    try {
      const payload = { ...editableExperience, instructorId };

      if (selectedExperience) {
        await manageExperience({
          instructorId,
          experienceId: selectedExperience.id,
          experience: payload,
          method: "PUT",
        }).unwrap();
        alert("Experience updated successfully!");
      } else {
        await manageExperience({
          instructorId,
          experience: payload,
          method: "POST",
        }).unwrap();
        alert("Experience added successfully!");
      }
      setEditableExperience({
        position: "",
        company: "",
        startYear: "",
        endYear: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to save experience:", error);
      alert("Failed to save experience. Please try again.");
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;

    try {
      await deleteExperience({
        instructorId,
        experienceId,
      }).unwrap();
      alert("Experience deleted successfully!");
    } catch (error) {
      console.error("Failed to delete experience:", error);
      alert("Failed to delete experience. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading experience details.</p>;

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Settings"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Experience</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Experience
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
                    <h3>Experience Details</h3>
                    <p>Edit your work experience information</p>
                  </div>
                  <SettingsPageHeader />
                  <div className="row">
                    {/* Left Section: List of Experiences */}
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <h3>Experience</h3>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                setEditableExperience({
                                  position: "",
                                  company: "",
                                  startYear: "",
                                  endYear: "",
                                  description: "",
                                });
                                setSelectedExperience(null);
                              }}
                            >
                              Add
                            </button>
                          </div>
                          <ul className="list-group">
                            {experienceProfile?.map((exp) => (
                              <li
                                key={exp.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <button
                                  className="btn btn-link text-center flex-grow-1"
                                  onClick={() => {
                                    setEditableExperience(exp);
                                    setSelectedExperience(exp);
                                  }}
                                >
                                  {exp.position}
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteExperience(exp.id)}
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 p-3 bg-light border rounded">
                            <h5>How to Manage Your Experience Records:</h5>
                            <small>
                            <p>
                                - Click the <b>Add</b> button, fill (Position, Company, Start Year, End Year and Description) on the right panel and then press <b>Save Experience</b> to create a new experience record. 
                              </p>
                              <p>
                                - Click on an existing experience item to edit the information fields on the right. Then click <b>Save Experience</b> to update your existing item.
                              </p>
                              <p>
                                - Press the <b>Delete</b> button to remove an
                                experience record permanently.
                              </p>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Experience Details */}
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-header">
                          <h5>Experience Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="form-group">
                            <label className="fw-bold">Position</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editableExperience.position}
                              onChange={(e) =>
                                setEditableExperience({
                                  ...editableExperience,
                                  position: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label className="fw-bold">Company</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editableExperience.company}
                              onChange={(e) =>
                                setEditableExperience({
                                  ...editableExperience,
                                  company: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="row">
                            <div className="col-md-6 my-3">
                              <label className="fw-bold mx-2">Start Year</label>
                              <DatePicker
                                selected={editableExperience.startYear ? new Date(editableExperience.startYear, 0, 1) : null}
                                onChange={(date) =>
                                  setEditableExperience({
                                    ...editableExperience,
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
                                selected={editableExperience.endYear ? new Date(editableExperience.endYear, 0, 1) : null}
                                onChange={(date) =>
                                  setEditableExperience({
                                    ...editableExperience,
                                    endYear: date.getFullYear(),
                                  })
                                }
                                showYearPicker
                                dateFormat="yyyy"
                                yearDropdownItemNumber={100}
                                editableExperience
                              minDate={
                                editableExperience.startYear
                                  ? new Date(editableExperience.startYear, 0, 1)
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
                              value={editableExperience.description}
                              onChange={(e) =>
                                setEditableExperience({
                                  ...editableExperience,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>



                          <button className="btn btn-primary my-2" onClick={handleSaveExperience}>
                            Save Experience
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

export default InstructorProfileExperience;
