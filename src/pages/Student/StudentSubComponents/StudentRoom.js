import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { ReactToPrint } from "react-to-print";
import { IoMdPrint } from "react-icons/io";
import Layout from "../../../components/Layout/Layout";

const StudentRoom = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState([]);
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(""); // New state for selected room
  const [selectedRoomStudents, setSelectedRoomStudents] = useState([]); // State to hold students of the selected room
  const componentRef = useRef(null);

  useEffect(() => {
    getAllGrades();
  }, []);

  const getAllGrades = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/grade/all"
      );
      setGrades(data.grades);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeChange = async (event) => {
    const selectedGradeSlug = event.target.value;
    setSelectedGrade(selectedGradeSlug);
    setCategoryEnabled(true);
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/grade/singleSlug/${selectedGradeSlug}`
      );
      setGrade(data.grade.classStudentProperties);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoomChange = (event) => {
    const selectedRoom = event.target.value;
    setSelectedRoom(selectedRoom);
    const room = grade.find((r) => r.myClass === selectedRoom);
    if (room) {
      setSelectedRoomStudents(room.students);
    } else {
      setSelectedRoomStudents([]);
    }
  };

  const handleBack = () => {
    navigate("/students");
  };

  const handleDetails = (slug) => {
    navigate(`/student-details/${slug}`);
  };

  return (
    <Layout>
      <div className="studentGradeMainContainer">
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
        <h1>Student Room</h1>

        <div className="sortGradeStudent">
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
              <MenuItem key={g._id} value={g.slug}>
                {g.name}
              </MenuItem>
            ))}
          </TextField>

          {categoryEnabled && (
            <TextField
              select
              label="Rooms"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedRoom}
              onChange={handleRoomChange} // Call handleRoomChange on room selection
            >
              <MenuItem value="">Select Room</MenuItem>
              {grade.map((c, idx) => (
                <MenuItem key={idx} value={c.myClass}>
                  {c.myClass}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        {/* Display students of the selected room */}
        <div className="sortGradeRoomStudent">
          <>
            <ReactToPrint
              trigger={() => {
                return (
                  <div className="studentPrintBtn">
                    <button type="button" className="btn btn-primary">
                      Print <IoMdPrint />
                    </button>
                  </div>
                );
              }}
              content={() => componentRef.current} // Use the ref here
              documentTitle={"Documents"}
              pageStyle="print"
            />
            <div ref={componentRef}>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <div className="tableHeadTitle">
                  <h2>GCEC Private School</h2>
                </div>

                <div className="totalStudentLength">
                  <p>Total : {selectedRoomStudents.length} students</p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>{selectedGrade}</span>{" "}
                    <span style={{ fontWeight: "bold" }}>({selectedRoom})</span>{" "}
                    students
                  </p>
                </div>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell align="left">S-Id</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">FatherName</TableCell>
                      <TableCell align="left">Contacts</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ color: "white" }}>
                    {selectedRoomStudents?.map((s, index) => (
                      <TableRow
                        key={s._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => handleDetails(s.slug)}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left" style={{ color: "red" }}>
                          {s.studentId}
                        </TableCell>
                        <TableCell align="left">{s.engName}</TableCell>
                        <TableCell align="left">{s.fatherName}</TableCell>
                        <TableCell align="left">
                          {s.contactOne} <br /> {s.contactTwo}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        </div>
      </div>
    </Layout>
  );
};

export default StudentRoom;
