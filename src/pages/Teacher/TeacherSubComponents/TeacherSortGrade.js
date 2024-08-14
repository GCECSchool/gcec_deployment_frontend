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

const TeacherSortGrade = () => {
  const [academics, setAcademics] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [selectedAcademics, setSelectedAcademics] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState("");
  const [teachers, setTeachers] = useState([]);
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
      console.log("My Grade", data.academic);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeChange = (event) => {
    const gradeSlug = event.target.value;
    setSelectedGrade(gradeSlug);
    setMyGrade(gradeSlug);
    if (academic.teacherProperties) {
      const selectedGradeProperties = academic.teacherProperties.find(
        (property) => property.grade === gradeSlug
      );
      if (selectedGradeProperties) {
        const teachers = selectedGradeProperties.teachers;
        setFilteredTeachers(teachers);
      } else {
        setFilteredTeachers([]);
      }
    }
  };

  const handleBack = () => {
    navigate("/teachers");
  };

  const handleDetails = (slug) => {
    navigate(`/teacher-details/${slug}`);
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
        <h1>Teacher Grade</h1>

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
              {academic.teacherProperties?.map((g, idx) => (
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
              documentTitle={teachers.grade?.name}
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
                  <p>Total : {filteredTeachers.length} teachers</p>
                  <p>
                    Academic{" "}
                    <span style={{ fontWeight: "bold" }}>{academic.name}</span>{" "}
                    teachers
                  </p>
                  <p>Grade : {myGrade}</p>
                </div>

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell align="left">T-Id</TableCell>
                      <TableCell align="left">Birth</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">Grade</TableCell>
                      <TableCell align="left">FatherName</TableCell>
                      <TableCell align="left">Address</TableCell>
                      <TableCell align="left">Contacts</TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ color: "white" }}>
                    {filteredTeachers?.map((t, index) => (
                      <TableRow
                        key={t._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => handleDetails(t.slug)}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left" style={{ color: "red" }}>
                          {t.teacherId}
                        </TableCell>
                        <TableCell align="left">{t.birth}</TableCell>
                        <TableCell align="left">{t.name}</TableCell>
                        <TableCell align="left">{t.grade.name}</TableCell>
                        <TableCell align="left">
                          {t.fatherName} <br /> {t.fatherNRC}
                        </TableCell>
                        <TableCell align="left">{t.address}</TableCell>
                        <TableCell align="left">
                          {t.contactOne} <br /> {t.contactTwo}
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

export default TeacherSortGrade;
