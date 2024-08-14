import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Teacher from "../Teacher";

const TeacherDataDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (params?.slug) getSingleTeacher();
  }, [params?.slug]);

  const getSingleTeacher = async () => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/teacher/single/${params.slug}`
      );
      setTeacher(data.teacher);
      console.log("My Single teacher", data.teacher);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate("/teachers-data");
  };

  return (
    <Teacher>
      <div className="dataTableContainer">
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>

          <h1>{teacher?.name} Data</h1>
        </div>

        {/* Main Table */}
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Homeclass Students</TableCell>
                <TableCell align="left">Teaching Grades</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
              {teacher && (
                <TableRow
                  key={teacher._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    1
                  </TableCell>
                  <TableCell align="left">{teacher.name}</TableCell>
                  <TableCell align="left">
                    {teacher.homeClassStudents?.map((homeClassStudent) => (
                      <div key={homeClassStudent._id}>
                        {teacher.grade.name} ( {homeClassStudent.myClass} )
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="left">
                    {teacher.studentProperties?.map((studentProperty) => (
                      <div key={studentProperty._id}>
                        {studentProperty.grade}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Homeclass Students Table */}
        {teacher?.homeClassStudents?.map((homeClassStudent, index) => (
          <TableContainer
            key={homeClassStudent._id}
            component={Paper}
            style={{
              boxShadow: "0px 13px 20px 0px #80808029",
              marginTop: "1rem",
              padding: "0.5rem",
            }}
          >
            <h2>Homeclass: {homeClassStudent.myClass}</h2>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Grade</TableCell>
                  <TableCell align="left">Father Name</TableCell>
                  <TableCell align="left">Father NRC</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ color: "white" }}>
                {homeClassStudent.students?.map((student, studentIndex) => (
                  <TableRow
                    key={student._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {studentIndex + 1}
                    </TableCell>
                    <TableCell align="left">{student.engName}</TableCell>
                    <TableCell align="left">{teacher.grade.name}</TableCell>
                    <TableCell align="left">{student.fatherName}</TableCell>
                    <TableCell align="left">{student.fatherNRC}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}

        {/* Student Properties */}
        <TableContainer
          component={Paper}
          style={{
            boxShadow: "0px 13px 20px 0px #80808029",
            marginTop: "1rem",
            padding: "0.5rem",
          }}
        >
          <h2>Teaching Grades</h2>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Student Grade</TableCell>
                <TableCell align="left">English Name</TableCell>
                <TableCell align="left">Myanmar Name</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
              {teacher?.studentProperties?.map((studentProp, index) => (
                <TableRow
                  key={studentProp._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{studentProp.grade}</TableCell>
                  <TableCell align="left">
                    {studentProp.students.map((student) => (
                      <div key={student._id}>{student.engName}</div>
                    ))}
                  </TableCell>
                  <TableCell align="left">
                    {studentProp.students.map((student) => (
                      <div key={student._id}>{student.myanName}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Teacher>
  );
};

export default TeacherDataDetails;
