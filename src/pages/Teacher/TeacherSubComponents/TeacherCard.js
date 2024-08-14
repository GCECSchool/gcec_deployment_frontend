import React from "react";
import { useNavigate } from "react-router-dom";

const TeacherCard = ({ teacher }) => {
  const navigate = useNavigate();
  const truncatedName =
    teacher.name.length > 8
      ? teacher.name.substring(0, 8) + "..."
      : teacher.name;

  const handleDetails = (slug) => {
    navigate(`/tech-dash-details/${slug}`);
  };
  return (
    <div className="teacherCard" onClick={() => handleDetails(teacher.slug)}>
      <div className="teacherCardImg">
        <img src={teacher.image?.url} alt={teacher.name} />
      </div>

      <div className="teacherCardName">
        <p title={teacher.name}>{truncatedName}</p>
        <p>{teacher.teacherId}</p>
        <p>{teacher.grade?.name}</p>
      </div>
    </div>
  );
};

export default TeacherCard;
