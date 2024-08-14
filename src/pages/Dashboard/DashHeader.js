import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import StudentSearchInput from "../../components/searchForm/StudentSearchInput";
import TeacherSearchInput from "../../components/searchForm/TeacherSearchInput";

const DashHeader = () => {
  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="mainSearchInputForm">
      <div className="selectInbox">
        <TextField
          select
          label="Search Types"
          variant="outlined"
          fullWidth
          margin="normal"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <MenuItem value="">Select Type</MenuItem>
          <MenuItem value="Student">Student</MenuItem>
          <MenuItem value="Teacher">Teacher</MenuItem>
        </TextField>
      </div>

      {selectedType === "Student" && (
        <div>
          <StudentSearchInput />
        </div>
      )}

      {selectedType === "Teacher" && (
        <div>
          <TeacherSearchInput />
        </div>
      )}
    </div>
  );
};

export default DashHeader;
