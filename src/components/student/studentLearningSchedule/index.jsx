import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa"; // Import trash icon
import { Link } from "react-router-dom";
import Footer from "../../footer";
import StudentHeader from "../header";
import StudentSidebar from "../sidebar";

const StudentLearningSchedule = () => {
    const [schedule, setSchedule] = useState(
        JSON.parse(localStorage.getItem("schedule")) || []
    );

    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event for editing/deleting
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "startTime" || name === "endTime") {
            const currentDate = newEvent[name.includes("start") ? "startDate" : "endDate"].split("T")[0];
            const newDateTime = `${currentDate}T${value}`;
            setNewEvent({ ...newEvent, [name.includes("start") ? "startDate" : "endDate"]: newDateTime });
        } else {
            setNewEvent({ ...newEvent, [name]: value });
        }
    };

    const addEvent = () => {
        if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
            return alert("Please fill out all fields!");
        }

        const newId = schedule.length + 1;
        const updatedSchedule = [...schedule, { id: newId, ...newEvent }];
        setSchedule(updatedSchedule);
        localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
        setNewEvent({
            title: "",
            description: "",
            startDate: "",
            endDate: "",
        });
        setShowModal(false);
    };

    const events = schedule.map((event) => ({
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        extendedProps: {
            description: event.description,
        },
    }));

    const handleDateClick = (info) => {
        setSelectedEvent(null); // Clear previous selected event
        const selectedDate = `${info.dateStr}T12:00`;  // Add a default time to the date (e.g., noon)
        setNewEvent({
            title: "",
            description: "",
            startDate: selectedDate,
            endDate: selectedDate,
        });
        setShowModal(true);
    };

    const handleEventClick = (info) => {
        const selectedEvent = schedule.find(event => event.title === info.event.title);
        setSelectedEvent(selectedEvent);
        setNewEvent({
            title: selectedEvent.title,
            description: selectedEvent.description,
            startDate: selectedEvent.startDate,
            endDate: selectedEvent.endDate,
        });
        setShowModal(true);
    };

    const deleteEvent = (eventId) => {
        const updatedSchedule = schedule.filter(event => event.id !== eventId);
        setSchedule(updatedSchedule);
        localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
        setShowModal(false); // Close the modal after deletion
    };

    return (
        <div className="main-wrapper">
            <StudentHeader activeMenu={"Learning Schedule"} />
            <div className="breadcrumb-bar breadcrumb-bar-info">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-12">
                            <div className="breadcrumb-list">
                                <h2 className="breadcrumb-title">Your Learning Schedule</h2>
                                <nav aria-label="breadcrumb" className="page-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/home">Home</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Learning Schedule
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
                        <StudentSidebar />
                        <div className="col-xl-9 col-lg-9">
                            <div className="settings-widget card-details">
                                <div className="settings-menu p-0">
                                    <div className="profile-heading">
                                        <h3>Your Learning Schedule</h3>
                                    </div>

                                    <div className="calendar-container">
                                        <FullCalendar
                                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                            initialView="dayGridMonth"
                                            events={events}
                                            dateClick={handleDateClick}
                                            eventClick={handleEventClick} // Handle event click for opening modal
                                            headerToolbar={{
                                                left: "prev,next today",
                                                center: "title",
                                                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            {/* Modal Popup for Adding/Editing Event */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEvent ? "Edit Event" : "Add New Event"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={newEvent.title}
                            onChange={handleInputChange}
                            placeholder="Event Title"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={newEvent.description}
                            onChange={handleInputChange}
                            placeholder="Event Description"
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="time"
                            className="form-control"
                            name="startTime"
                            value={newEvent.startDate.slice(11, 16)}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="time"
                            className="form-control"
                            name="endTime"
                            value={newEvent.endDate.slice(11, 16)}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Selected Date: {new Date(newEvent.startDate).toLocaleDateString('en-US')}
                        </label>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {selectedEvent && (
                        <Button variant="danger" onClick={() => deleteEvent(selectedEvent.id)}>
                            <FaTrashAlt /> Delete
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addEvent}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentLearningSchedule;
