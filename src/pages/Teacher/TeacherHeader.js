import React from "react";
import { useNavigate } from "react-router-dom";

const TeacherHeader = () => {
  const navigate = useNavigate();

  const handleCardClick = (cardName) => {
    navigate(`/${cardName}`); // Assuming cardName matches route path
  };
  return (
    <div className="cardRow">
      {/* Teachers */}
      <div className="card" onClick={() => handleCardClick("teachers-list")}>
        <img
          src="https://i.pinimg.com/564x/2b/a6/1d/2ba61d0b1ca2584c9e6dad45793c2c1c.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Teachers</h2>
        </div>
      </div>

      {/* Teachers Data */}
      <div className="card" onClick={() => handleCardClick("teachers-data")}>
        <img
          src="https://i.pinimg.com/564x/84/e5/73/84e5734228dd7344e38dcb977894b096.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Teachers Data</h2>
        </div>
      </div>

      {/* Teachers Sort Grade */}
      <div
        className="card"
        onClick={() => handleCardClick("teachers-sort-grade")}
      >
        <img
          src="https://i.pinimg.com/564x/f9/03/b2/f903b2ff2f2488b9c184b7bb516ed7cb.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Teachers Grade</h2>
        </div>
      </div>

      {/* Subject */}
      <div className="card" onClick={() => handleCardClick("teachers-salary")}>
        <img
          src="https://i.pinimg.com/564x/e0/b0/18/e0b0187177abae643d52cd217b765b04.jpg"
          alt="..."
          className="card-image"
        />
        <div className="card-content">
          <h2 className="card-title">Salary</h2>
        </div>
      </div>
    </div>
  );
};

export default TeacherHeader;
