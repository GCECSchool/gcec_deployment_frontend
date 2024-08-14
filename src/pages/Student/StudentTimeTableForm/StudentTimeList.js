import React, { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import "./TimeTable.css";
import { useNavigate } from "react-router-dom";
import Student from "../Student";

const StudentTimeList = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [timeProperties, setTimeProperties] = useState([]);
  const [subjectProperties, setSubjectProperties] = useState([]);
  const [myId, setMyId] = useState(null);
  const [gradeName, setGradeName] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [classProperties, setClassProperties] = useState([]);
  const [selectedClassRoom, setSelectedClassRoom] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    getAllGrades();
  }, []);

  const getAllGrades = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/grade/all"
      );
      setGrades(data.grades);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const initializeScheduleData = (timeSubjectProperties) => {
    const newScheduleData = {};
    timeSubjectProperties.roomData.forEach((roomData) => {
      const room = roomData.room;
      newScheduleData[room] = {};
      roomData.daySubject.forEach((daySubject) => {
        const day = daySubject.day;
        newScheduleData[room][day] = {};
        daySubject.timeSubject.forEach((timeSubject) => {
          const time = timeSubject.time;
          newScheduleData[room][day][time] = timeSubject.subject || "";
        });
      });
    });
    return newScheduleData;
  };

  const handleGradeChange = async (event) => {
    const selectedGradeId = event.target.value;
    setSelectedGrade(selectedGradeId);
    setCategoryEnabled(true);
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/grade/single/${selectedGradeId}`
      );
      setMyId(data.grade._id);
      setGradeName(data.grade.name);
      setSubjectProperties(data.grade.subjectProperties);
      setTimeProperties(data.grade.timeProperties);
      setClassProperties(data.grade.classProperties);
      console.log(data.grade.timeSubjectProperties);

      // Populate scheduleData with existing data from MongoDB
      setScheduleData(initializeScheduleData(data.grade.timeSubjectProperties));
      console.log("Time Subject Properties:", data.grade.timeSubjectProperties);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClassRoomChange = (event) => {
    const selectedClassRoom = event.target.value;
    setSelectedClassRoom(selectedClassRoom);

    // Ensure the selectedClassRoom is initialized in scheduleData
    if (!scheduleData[selectedClassRoom]) {
      setScheduleData((prevData) => ({
        ...prevData,
        [selectedClassRoom]: days.reduce((acc, day) => {
          acc[day] = timeProperties.reduce((dayAcc, time) => {
            dayAcc[time.name] = "";
            return dayAcc;
          }, {});
          return acc;
        }, {}),
      }));
    }
  };

  const handleCellChange = (value, time, day) => {
    setScheduleData((prevData) => ({
      ...prevData,
      [selectedClassRoom]: {
        ...prevData[selectedClassRoom],
        [day]: {
          ...prevData[selectedClassRoom][day],
          [time]: value,
        },
      },
    }));
  };

  const handleGradeUpdate = async () => {
    try {
      const roomData = Object.keys(scheduleData).map((room) => ({
        room,
        daySubject: days.map((day) => ({
          day,
          timeSubject: timeProperties.map((time) => ({
            time: time.name,
            subject: scheduleData[room][day]?.[time.name] || "",
          })),
        })),
      }));

      await axios.put(
        `https://gcecbackend-195.onrender.com/api/v1/grade/update/${myId}`,
        {
          timeSubjectProperties: {
            grade: gradeName,
            roomData: roomData,
          },
        }
      );
      navigate("/setups");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Student>
      <div className="setMainFormContainer">
        <h1>Add Time Chart</h1>

        <div className="gradeContainer">
          <div className="gradeFormInput">
            <TextField
              select
              label="Grades"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedGrade}
              onChange={handleGradeChange}
            >
              <MenuItem value="">Select Grade</MenuItem>
              {grades?.map((g) => (
                <MenuItem key={g._id} value={g._id}>
                  {g.name}
                </MenuItem>
              ))}
            </TextField>

            {categoryEnabled && (
              <TextField
                select
                label="Class Rooms"
                variant="outlined"
                fullWidth
                margin="normal"
                value={selectedClassRoom}
                onChange={handleClassRoomChange}
              >
                <MenuItem value="">Select Class Room</MenuItem>
                {classProperties.map((room) => (
                  <MenuItem key={room.name} value={room.name}>
                    {room.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {categoryEnabled && selectedClassRoom && (
              <div className="addUpdateSubject">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={handleGradeUpdate}
                >
                  Update
                </button>
              </div>
            )}
          </div>

          {categoryEnabled && selectedClassRoom && (
            <div className="tableMainChartContainer">
              <h1>Time Chart</h1>

              <div className="tableScroll">
                <table className="timetable">
                  <thead>
                    <tr>
                      <th></th>
                      {days.map((day) => (
                        <th key={day} align="center">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeProperties.map((time) => (
                      <tr key={time.name}>
                        <td component="th" scope="row">
                          {time.name}
                        </td>
                        {days.map((day) => (
                          <td key={`${time.name}-${day}`}>
                            <TextField
                              select
                              value={
                                scheduleData[selectedClassRoom]?.[day]?.[
                                  time.name
                                ] || ""
                              }
                              onChange={(event) =>
                                handleCellChange(
                                  event.target.value,
                                  time.name,
                                  day
                                )
                              }
                              fullWidth
                              variant="outlined"
                            >
                              <MenuItem value="">None</MenuItem>
                              {subjectProperties.map((subject) => (
                                <MenuItem
                                  key={subject.name}
                                  value={subject.name}
                                >
                                  {subject.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Student>
  );
};

export default StudentTimeList;
