import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const StudentDashDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState("");
  const [student, setStudent] = useState({
    gender: "",
    nationality: "",
    religion: "",
  });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth("");
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Check if student and student.financeProperties are defined and are arrays
  const financeProperties = Array.isArray(student?.financeProperties)
    ? student.financeProperties
    : [];

  const selectedFinance = financeProperties.find(
    (finance) => finance.year === selectedYear
  );

  const selectedMonthData = selectedFinance?.fee.find(
    (fee) => fee.month === selectedMonth
  );

  useEffect(() => {
    if (params?.slug) getSingleStudent();
  }, [params?.slug]);

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

  const getSingleStudent = async () => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/student/single/${params.slug}`
      );
      setStudent(data.student);
      setMyId(data.student._id);
      console.log("My Student", data.student);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateStudent = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="studentContainer">
        <div className="studentFormTopbar">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNavigateStudent}
          >
            Back
          </button>
        </div>

        {loading ? (
          <div>
            <h1 className="loadingStudent">Loading please wait...</h1>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Started Years */}
            <div className="studentFormMainBar">
              <h2>Started Years</h2>
              {student?.financeProperties?.length > 0 && (
                <p>
                  This student is started at{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {student?.financeProperties[0]?.year}
                  </span>{" "}
                  academic year
                </p>
              )}
            </div>

            {/* Student Data */}
            <div className="studentFormMainBar">
              {/* Id and Eng-Name */}
              <div className="studentFormInput">
                <TextField
                  label="StudentId"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.studentId}
                  InputLabelProps={{ shrink: !!student.studentId }}
                  onChange={(e) =>
                    setStudent({ ...student, studentId: e.target.value })
                  }
                />

                <TextField
                  label="Englist Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.engName}
                  InputLabelProps={{ shrink: !!student.engName }}
                  onChange={(e) =>
                    setStudent({ ...student, engName: e.target.value })
                  }
                />
              </div>

              {/* Myan-Name and Password */}
              <div className="studentFormInput">
                <TextField
                  label="Myanmar Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.myanName}
                  InputLabelProps={{ shrink: !!student.myanName }}
                  onChange={(e) =>
                    setStudent({ ...student, myanName: e.target.value })
                  }
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.studentPassword}
                  InputLabelProps={{ shrink: !!student.studentPassword }}
                  onChange={(e) =>
                    setStudent({ ...student, studentPassword: e.target.value })
                  }
                />
              </div>

              {/* Grade and Gender */}
              <div className="studentFormInput">
                <TextField
                  select
                  label="Teacher's Grade"
                  value={student.grade ? student.grade._id : ""}
                  onChange={(e) => {
                    const selectedGrade = grades.find(
                      (g) => g._id === e.target.value
                    );
                    setStudent({ ...student, grade: selectedGrade });
                  }}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: !!student.grade, // Only shrink if there is a value selected
                  }}
                >
                  <MenuItem value="">Select Teacher's Grade</MenuItem>
                  {/* Render options for teacher's grade */}
                  {grades.map((g) => (
                    <MenuItem key={g._id} value={g._id}>
                      {g.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Gender"
                  value={student.gender}
                  onChange={(e) =>
                    setStudent({ ...student, gender: e.target.value })
                  }
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: !!student.gender, // Only shrink if there is a value selected
                  }}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </div>

              {/* Nationality and Religion */}
              <div className="studentFormInput">
                <TextField
                  select
                  label="Nationality"
                  value={student.nationality}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: !!student.nationality }}
                  onChange={(e) =>
                    setStudent({ ...student, nationality: e.target.value })
                  }
                >
                  <MenuItem value="">Select Nationality</MenuItem>
                  <MenuItem value="Chin">Chin</MenuItem>
                  <MenuItem value="Burmese">Burmese</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Religion"
                  value={student.religion}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: !!student.religion }}
                  onChange={(e) =>
                    setStudent({ ...student, religion: e.target.value })
                  }
                >
                  <MenuItem value="">Select Religion</MenuItem>
                  <MenuItem value="Christian">Christian</MenuItem>
                  <MenuItem value="Buddist">Buddist</MenuItem>
                  <MenuItem value="Musilm">Musilm</MenuItem>
                  <MenuItem value="Hindo">Hindo</MenuItem>
                </TextField>
              </div>

              {/* Father-Name and Father-NRC */}
              <div className="studentFormInput">
                <TextField
                  label="Father Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.fatherName}
                  InputLabelProps={{ shrink: !!student.fatherName }}
                  onChange={(e) =>
                    setStudent({ ...student, fatherName: e.target.value })
                  }
                />

                <TextField
                  label="Father NRC"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.fatherNRC}
                  InputLabelProps={{ shrink: !!student.fatherNRC }}
                  onChange={(e) =>
                    setStudent({ ...student, fatherNRC: e.target.value })
                  }
                />
              </div>

              {/* Mother-Name and Mother-NRC */}
              <div className="studentFormInput">
                <TextField
                  label="Mother Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.motherName}
                  InputLabelProps={{ shrink: !!student.motherName }}
                  onChange={(e) =>
                    setStudent({ ...student, motherName: e.target.value })
                  }
                />

                <TextField
                  label="Mother NRC"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.motherNRC}
                  InputLabelProps={{ shrink: !!student.motherNRC }}
                  onChange={(e) =>
                    setStudent({ ...student, motherNRC: e.target.value })
                  }
                />
              </div>

              {/* Birth and Address */}
              <div className="studentFormInput">
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.birth}
                  InputLabelProps={{ shrink: !!student.birth }}
                  onChange={(e) =>
                    setStudent({ ...student, birth: e.target.value })
                  }
                />

                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.address}
                  InputLabelProps={{ shrink: !!student.address }}
                  onChange={(e) =>
                    setStudent({ ...student, address: e.target.value })
                  }
                />
              </div>

              {/* PrevSchool and Marks */}
              <div className="studentFormInput">
                <TextField
                  label="PrevSchool"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.prevSchool}
                  InputLabelProps={{ shrink: !!student.prevSchool }}
                  onChange={(e) =>
                    setStudent({ ...student, prevSchool: e.target.value })
                  }
                />

                <TextField
                  label="Marks"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.marks}
                  InputLabelProps={{ shrink: !!student.marks }}
                  onChange={(e) =>
                    setStudent({ ...student, marks: e.target.value })
                  }
                />
              </div>

              {/* ContactOne and ContactTwo */}
              <div className="studentFormInput">
                <TextField
                  label="Phone-1"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.contactOne}
                  InputLabelProps={{ shrink: !!student.contactOne }}
                  onChange={(e) =>
                    setStudent({ ...student, contactOne: e.target.value })
                  }
                />

                <TextField
                  label="Phone-2"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={student.contactTwo}
                  InputLabelProps={{ shrink: !!student.contactTwo }}
                  onChange={(e) =>
                    setStudent({ ...student, contactTwo: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Finance Data */}
            <div className="studentFormMainBar">
              <h1>Finance</h1>
              <div className="studentFinanceDataSelect">
                {/* Select for years */}
                <TextField
                  select
                  label="Finance"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {student?.financeProperties.map((y, idx) => (
                    <MenuItem key={idx} value={y.year}>
                      {y.year}
                    </MenuItem>
                  ))}
                </TextField>

                {/* After grade selected months will display */}
                {selectedYear && selectedFinance && (
                  <TextField
                    select
                    label="Month"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    {selectedFinance.fee.map((fee, idx) => (
                      <MenuItem key={idx} value={fee.month}>
                        {fee.month}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </div>

              {/* If month is selected, display the fee details */}

              <div className="studentFinanceDataList">
                {selectedMonth && selectedMonthData ? (
                  <>
                    <h2>Fee Details for {selectedMonth}</h2>

                    <TableContainer
                      component={Paper}
                      style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                    >
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell align="left">S-Id</TableCell>
                            <TableCell align="left">Student Name</TableCell>
                            <TableCell align="left">Grade</TableCell>
                            <TableCell align="left">Amount Paid</TableCell>
                            <TableCell align="left">Remaining</TableCell>
                            <TableCell align="left">Paid Date</TableCell>
                            <TableCell align="left">Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody style={{ color: "white" }}>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              1
                            </TableCell>
                            <TableCell align="left">
                              {student.studentId}
                            </TableCell>
                            <TableCell align="left">
                              {student.engName}
                            </TableCell>
                            <TableCell align="left">
                              {student.grade.name}
                            </TableCell>
                            <TableCell align="left">
                              {selectedMonthData.value}
                            </TableCell>
                            <TableCell align="left">
                              {selectedMonthData.remain}
                            </TableCell>
                            <TableCell align="left">
                              {selectedMonthData.date}
                            </TableCell>
                            <TableCell align="left">
                              {selectedMonthData.status}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  selectedMonth && (
                    <div>
                      <h2>No data available for the selected month.</h2>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Exam Data */}
            <div className="studentFormMainBar">
              <h1>Exam</h1>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashDetails;
