import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentInstructor } from "../../../redux/slices/auth/authSlice";
import Footer from "../../footer";
import { InstructorHeader } from "../header";
import InstructorSidebar from "../sidebar";
import SettingsPageHeader from "./settingsPageHeader";
import {
  useGetSkillsQuery,
  useManageSkillMutation,
  useDeleteSkillMutation,
} from "../../../redux/slices/instructor/InstructorProfileApiSlice";

const InstructorProfileSkill = () => {
  const instructorId = useSelector(selectCurrentInstructor);

  const {
    data: skillProfile,
    isLoading,
    isError,
  } = useGetSkillsQuery({ instructorId });

  const [manageSkill] = useManageSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [editableSkill, setEditableSkill] = useState({ skillName: "" });

  useEffect(() => {
    if (skillProfile) {
      setSelectedSkill(null);
      setEditableSkill({ skillName: "" });
    }
  }, [skillProfile]);

  const handleSaveSkill = async () => {
    if (!editableSkill.skillName.trim()) {
      alert("Skill name is required.");
      return;
    }

    try {
      const payload = { ...editableSkill, instructorId };

      if (selectedSkill) {
        await manageSkill({
          instructorId,
          skillId: selectedSkill.id,
          skill: payload,
          method: "PUT",
        }).unwrap();
        alert("Skill updated successfully!");
      } else {
        await manageSkill({
          instructorId,
          skill: payload,
          method: "POST",
        }).unwrap();
        alert("Skill added successfully!");
      }
      setEditableSkill({ skillName: "" });
    } catch (error) {
      console.error("Failed to save skill:", error);
      alert("Failed to save skill. Please try again.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await deleteSkill({ instructorId, skillId }).unwrap();
      alert("Skill deleted successfully!");
    } catch (error) {
      console.error("Failed to delete skill:", error);
      alert("Failed to delete skill. Please try again.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading skills.</p>;

  return (
    <div className="main-wrapper">
      <InstructorHeader activeMenu={"Settings"} />
      <div className="breadcrumb-bar breadcrumb-bar-info">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <h2 className="breadcrumb-title">Skills</h2>
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/home">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Skills
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
                    <h3>Skills</h3>
                    <p>Edit your skills</p>
                  </div>
                  <SettingsPageHeader />
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <h3>Skills</h3>
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                setEditableSkill({ skillName: "" });
                                setSelectedSkill(null);
                              }}
                            >
                              Add
                            </button>
                          </div>
                          <ul className="list-group">
                            {skillProfile?.map((skill) => (
                              <li
                                key={skill.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <button
                                  className="btn btn-link text-center flex-grow-1"
                                  onClick={() => {
                                    setEditableSkill(skill);
                                    setSelectedSkill(skill);
                                  }}
                                >
                                  {skill.skillName}
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-header">
                          <h5>Skill Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="form-group">
                            <label className="fw-bold">Skill Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={editableSkill.skillName}
                              onChange={(e) =>
                                setEditableSkill({
                                  ...editableSkill,
                                  skillName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <button className="btn btn-primary my-2" onClick={handleSaveSkill}>
                            Save Skill
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-light border rounded">
                            <h5>How to Manage Your Skill Records:</h5>
                            <small>
                              <p>
                                - Click the <b>Add</b> button, fill <b>Skill Name</b> on the right panel and then press <b>Save Skill</b> to create a new skill record. 
                              </p>
                              <p>
                                - Click on an existing skill item to edit the information fields on the right. Then click <b>Save Skill</b> to update your existing item.
                              </p>
                              <p>
                                - Press the <b>Delete</b> button to remove an
                                skill record permanently.
                              </p>
                            </small>
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

export default InstructorProfileSkill;
