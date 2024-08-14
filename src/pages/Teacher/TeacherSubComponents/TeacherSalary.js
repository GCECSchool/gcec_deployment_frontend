import React, { useState, useEffect, useRef } from "react";
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
import { useAcademicContext } from "../../Finance/FinanceContext";
import Teacher from "../Teacher";
import { ReactToPrint } from "react-to-print";
import { IoMdPrint } from "react-icons/io";

const TeacherSalary = () => {
  const { academics } = useAcademicContext();
  const [academic, setAcademic] = useState([]);
  const [selectedAcademics, setSelectedAcademics] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);
  const [payments, setPayments] = useState([]);
  const componentRef = useRef(null);

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

  useEffect(() => {
    if (filteredTeachers.length > 0) {
      const financeProperties = filteredTeachers[0]?.financeProperties;
      if (financeProperties && financeProperties.length > 0) {
        const salaryMonths = financeProperties[0].salary.map((s) => s.month);
        setMonths(salaryMonths);
      }
    }
  }, [filteredTeachers]);

  useEffect(() => {
    if (selectedMonth && filteredTeachers.length > 0) {
      const paymentsForMonth = filteredTeachers.map((teacher) => {
        const payment = teacher?.financeProperties[0]?.salary.find(
          (s) => s.month === selectedMonth
        );
        return {
          name: teacher.name,
          grade: teacher.grade.name,
          value: payment ? payment.value : 0,
          bonus: payment ? payment.bonus : 0,
          total: payment ? payment.total : 0,
        };
      });
      setPayments(paymentsForMonth);
    }
  }, [selectedMonth, filteredTeachers]);

  return (
    <Teacher>
      <div className="financeMainConatainer">
        <h1>Teacher Salary</h1>

        <div className="financeYearSelect">
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

          {categoryEnabled && (
            <TextField
              select
              label="Monthly Salary"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">Select Month</MenuItem>
              {months.map((month, idx) => (
                <MenuItem key={idx} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        <div>
          <>
            <ReactToPrint
              trigger={() => {
                return (
                  <div className="studentPrintBtn">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: "1rem" }}
                    >
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
              {selectedMonth && (
                <TableContainer
                  component={Paper}
                  style={{
                    boxShadow: "0px 13px 20px 0px #80808029",
                    marginTop: "1rem",
                  }}
                >
                  <div className="tableHeadTitle">
                    <h2>GCEC Private School</h2>
                  </div>

                  <div className="totalStudentLength">
                    <p>Total : {filteredTeachers.length} teachers</p>
                    <p>
                      Academic{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {academic.name}
                      </span>{" "}
                      {selectedMonth} salary
                    </p>
                    <p>Grade : {selectedGrade}</p>
                  </div>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell align="left">TeacherName</TableCell>
                        <TableCell align="left">Grade</TableCell>
                        <TableCell align="left">Basic</TableCell>
                        <TableCell align="left">Bonus</TableCell>
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ color: "white" }}>
                      {payments.map((payment, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {idx + 1}
                          </TableCell>
                          <TableCell align="left">{payment.name}</TableCell>
                          <TableCell align="left">{payment.grade}</TableCell>
                          <TableCell align="left">{payment.value}</TableCell>
                          <TableCell align="left">{payment.bonus}</TableCell>

                          <TableCell align="left" className="Details">
                            {payment.total}{" "}
                            <span style={{ color: "black" }}>MMK</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </>
        </div>
      </div>
    </Teacher>
  );
};

export default TeacherSalary;
