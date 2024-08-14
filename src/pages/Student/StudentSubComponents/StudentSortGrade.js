import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ReactToPrint } from "react-to-print";
import { IoMdPrint } from "react-icons/io";
import Layout from "../../../components/Layout/Layout";

const StudentSortGrade = () => {
  const [academics, setAcademics] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [selectedAcademics, setSelectedAcademics] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState("");
  const [students, setStudents] = useState([]);
  const componentRef = useRef(null);
  const [myGrade, setMyGrade] = useState(null);

  useEffect(() => {
    getAllAcademics();
  }, []);

  const getAllAcademics = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/academic/all"
      );
      setAcademics(data.academics);
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearChange = async (event) => {
    const selectedAcademicSlug = event.target.value;
    setSelectedAcademics(selectedAcademicSlug);
    setCategoryEnabled(true);

    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/academic/singleRemove/${selectedAcademicSlug}`
      );
      setAcademic(data.academic);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeChange = (event) => {
    const gradeSlug = event.target.value;
    setSelectedGrade(gradeSlug);
    setMyGrade(gradeSlug);
    if (academic.studentProperties) {
      const selectedGradeProperties = academic.studentProperties.find(
        (property) => property.grade === gradeSlug
      );
      if (selectedGradeProperties) {
        const students = selectedGradeProperties.students;
        setFilteredStudents(students);
      } else {
        setFilteredStudents([]);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDetails = (slug) => {
    navigate(`/stud-dash-details/${slug}`);
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
        <h1>Student Grade</h1>

        <div className="sortGradeStudent">
          <TextField
            select
            label="Academic Years"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedAcademics}
            onChange={handleYearChange}
          >
            <MenuItem value="">Select Year</MenuItem>
            {academics?.map((academic, idx) => (
              <MenuItem key={idx} value={academic.slug}>
                {academic.name}
              </MenuItem>
            ))}
          </TextField>

          {categoryEnabled && (
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
              {academic.studentProperties?.map((g, idx) => (
                <MenuItem key={idx} value={g.grade}>
                  {g.grade}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        <div className="studentTableContainer">
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
              documentTitle={students.grade?.name}
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
                  <p>Total : {filteredStudents.length} students</p>
                  <p>
                    Academic{" "}
                    <span style={{ fontWeight: "bold" }}>{academic.name}</span>{" "}
                    students
                  </p>
                  <p>Grade : {myGrade}</p>
                </div>

                <Table sx={{ minWidth: 1300 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell align="left">S-Id</TableCell>
                      <TableCell align="left">Birth</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">FatherName</TableCell>
                      <TableCell align="left">MotherName</TableCell>
                      <TableCell align="left">Address</TableCell>
                      <TableCell align="left">Contacts</TableCell>
                      <TableCell align="left">Prev School</TableCell>
                      <TableCell align="left">Marks</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ color: "white" }}>
                    {filteredStudents?.map((s, index) => (
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
                        <TableCell align="left">{s.birth}</TableCell>
                        <TableCell align="left">
                          {s.engName} <br /> {s.myanName}
                        </TableCell>
                        <TableCell align="left">
                          {s.fatherName} <br /> {s.fatherNRC}
                        </TableCell>
                        <TableCell align="left">
                          {s.motherName} <br /> {s.motherNRC}
                        </TableCell>
                        <TableCell align="left">{s.address}</TableCell>
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

export default StudentSortGrade;
