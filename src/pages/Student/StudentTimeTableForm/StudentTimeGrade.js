import React from "react";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import useStudentGrade from "../../../components/hooks/useStudentGrade";

const StudentTimeGrade = () => {
  const categories = useStudentGrade();
  const navigate = useNavigate();

  const handleGradeSlug = (slug) => {
    navigate(`/student-grade-time-list/${slug}`);
  };

  return (
    <div className="studentGradeSelect">
      <TextField
        select
        label="Grade"
        variant="outlined"
        fullWidth
        margin="normal"
      >
        <MenuItem value="">Select Grade</MenuItem>
        {/* Render options for teacher's grade */}
        {categories.map((g) => (
          <MenuItem
            key={g._id}
            value={g.slug}
            onClick={() => handleGradeSlug(g.slug)}
          >
            {g.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default StudentTimeGrade;
