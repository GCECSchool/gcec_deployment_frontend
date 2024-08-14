import React from "react";
import { useNavigate } from "react-router-dom";

const StudentHeader = () => {
  const navigate = useNavigate();

  const handleCardClick = (cardName) => {
    navigate(`/${cardName}`); // Assuming cardName matches route path
  };
  return (
    <div className="cardRow">
      {/* Students */}
      <div className="card" onClick={() => handleCardClick("students-list")}>
        <img
          src="https://i.pinimg.com/564x/b7/dd/50/b7dd50c0fd2b562c60e7a0f634f0e22e.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Students</h2>
        </div>
      </div>

      {/* Student Grade Sort */}
      <div
        className="card"
        onClick={() => handleCardClick("students-sort-grade")}
      >
        <img
          src="https://i.pinimg.com/564x/f9/03/b2/f903b2ff2f2488b9c184b7bb516ed7cb.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Students Grade</h2>
        </div>
      </div>

      {/* Student Room */}
      <div
        className="card"
        onClick={() => handleCardClick("students-room-grade")}
      >
        <img
          src="https://i.pinimg.com/564x/56/0d/bd/560dbd7422adf92dee15c0e863c3fd3e.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Students Room</h2>
        </div>
      </div>

      {/* Timetable */}
      <div
        className="card"
        onClick={() => handleCardClick("student-grade-time-list")}
      >
        <img
          src="https://i.pinimg.com/564x/ae/62/a4/ae62a4ffb23c5d15e06065dc0e44db74.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Timetable</h2>
        </div>
      </div>

      {/* Exam */}
      <div className="card" onClick={() => handleCardClick("students-exam")}>
        <img
          src="https://i.pinimg.com/564x/a9/50/b1/a950b11aba450e6a8426133ff899f2b5.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Exam</h2>
        </div>
      </div>

      {/* Fee */}
      <div className="card" onClick={() => handleCardClick("students-fee")}>
        <img
          src="https://i.pinimg.com/564x/27/96/5a/27965ad3c770cffea465a4c8516ecc72.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Fees</h2>
        </div>
      </div>

      {/* Daily Fee */}
      <div className="card" onClick={() => handleCardClick("daily-fee")}>
        <img
          src="https://i.pinimg.com/564x/b1/a9/91/b1a9912dc18ca4db06d178c8ec343f98.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Daily Income Report</h2>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
