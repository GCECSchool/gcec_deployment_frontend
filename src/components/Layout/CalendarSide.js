import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const CalendarSide = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(""); // State for the event title
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    fetchEventsFromDatabase();
  }, []);

  const fetchEventsFromDatabase = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/calendar/all"
      );
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDateClick = (arg) => {
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setTitle(clickInfo.event.title);
    setShowModal(true);
    setEdited(!edited);
  };

  const handleModalClose = () => {
    setShowModal(false);
    fetchEventsFromDatabase();
  };

  return (
    <div>
      <div className="calendarMainContainer">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick} // Handle event click
        />
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={handleModalClose}
        className="add-event-modal"
        overlayClassName="add-event-modal-overlay"
      >
        <h2>Add Event</h2>

        <div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="button" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarSide;
