import React from "react";
import Student from "../Student";
import StudentTimeGrade from "../StudentTimeTableForm/StudentTimeGrade";

const StudentTimetableList = () => {
  return (
    <Student>
      <div className="studentListHeader">
        <div className="studentList">
          <h1>TimeTable</h1>
        </div>

        <StudentTimeGrade />
      </div>

      <div className="studentTableContainer"></div>
    </Student>
  );
};

export default StudentTimetableList;
