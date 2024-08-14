import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Layout from "../../components/Layout/Layout";
import Modal from "react-modal"; // Import Modal directly
import "./Calendar.css";
import axios from "axios";

Modal.setAppElement("#root");

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
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
    setSelectedDate(arg.date);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    setTitle(clickInfo.event.title);
    setSelectedEventId(clickInfo.event.extendedProps._id); // Assuming your event object has an id property
    setShowModal(true);
    setEdited(!edited);
  };

  const handleModalClose = () => {
    setShowModal(false);
    fetchEventsFromDatabase();
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://gcecbackend-195.onrender.com/api/v1/calendar/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            start: selectedDate,
            end: selectedDate, // For simplicity, we set the end time to the same as the start time
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add event");
      }
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setShowModal(false);
      fetchEventsFromDatabase();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEventDelete = async () => {
    try {
      const response = await fetch(
        `https://gcecbackend-195.onrender.com/api/v1/calendar/delete/${selectedEventId}`, // Assuming you have selectedEventId state to store the id of the selected event
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      const deletedEvent = await response.json();
      // Update the events state by removing the deleted event
      setEvents(events.filter((event) => event.id !== deletedEvent.id));
      setShowModal(false);
      fetchEventsFromDatabase();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventUpdate = async () => {
    try {
      const response = await fetch(
        `https://gcecbackend-195.onrender.com/api/v1/calendar/update/${selectedEventId}`,
        {
          method: "PUT", // Assuming you're using PUT method for updating events
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            start: selectedDate,
            end: selectedDate, // For simplicity, we set the end time to the same as the start time
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      const updatedEvent = await response.json();
      // Update the events state by replacing the updated event
      setEvents(
        events.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
      setShowModal(false);
      fetchEventsFromDatabase();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Layout>
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
        <div className="modalDelete">
          <button onClick={handleEventDelete}>Delete</button>
        </div>

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
            {edited ? (
              <>
                <button type="submit" onClick={handleEventUpdate}>
                  Update
                </button>
              </>
            ) : (
              <>
                <button type="submit" onClick={handleModalSubmit}>
                  Add Event
                </button>
              </>
            )}

            <button type="button" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Calendar;
