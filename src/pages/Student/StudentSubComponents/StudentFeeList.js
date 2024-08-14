import React, { useState, useEffect, useRef } from "react";
import Student from "../Student";
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
import { useAcademicContext } from "../../Finance/FinanceContext";
import axios from "axios";
import ReactToPrint from "react-to-print";
import { IoMdPrint } from "react-icons/io";

const StudentFeeList = () => {
  const { academics } = useAcademicContext();
  const [academic, setAcademic] = useState([]);
  const [selectedAcademics, setSelectedAcademics] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
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
      console.log("My Student Fee", data.academic);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeChange = (event) => {
    const gradeSlug = event.target.value;
    setSelectedGrade(gradeSlug);
    if (academic.studentProperties) {
      const selectedGradeProperties = academic.studentProperties.find(
        (property) => property.grade === gradeSlug
      );
      if (selectedGradeProperties) {
        const students = selectedGradeProperties.students;
        setFilteredStudents(students);
        console.log("My Filtered students", students);
      } else {
        setFilteredStudents([]);
      }
    }
  };

  useEffect(() => {
    if (filteredStudents.length > 0) {
      const feeMonths = filteredStudents.reduce((acc, student) => {
        const studentMonths =
          student.financeProperties?.[0]?.fee.map((f) => f.month) || [];
        return [...acc, ...studentMonths];
      }, []);
      const uniqueMonths = [...new Set(feeMonths)];
      setMonths(uniqueMonths);
    } else {
      setMonths([]);
    }
  }, [filteredStudents]);

  useEffect(() => {
    if (selectedMonth && filteredStudents.length > 0) {
      const paymentsForMonth = filteredStudents.map((student) => {
        const payment = student?.financeProperties[0]?.fee.find(
          (f) => f.month === selectedMonth
        );
        return {
          studentId: student.studentId,
          name: student.engName,
          grade: student.grade.name,
          value: payment ? payment.value : 0,
          remain: payment ? payment.remain : 0,
          date: payment ? payment.date : null,
          status: payment ? payment.status : null,
          paidBy: payment ? payment.paidBy : null,
        };
      });
      setPayments(paymentsForMonth);
    }
  }, [selectedMonth, filteredStudents]);

  const calculateTotalFee = () => {
    return payments.reduce((total, payment) => total + payment.value, 0);
  };

  return (
    <Student>
      <div className="financeMainConatainer">
        <h1>Student Fee</h1>

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
              {academic.studentProperties?.map((g, idx) => (
                <MenuItem key={idx} value={g.grade}>
                  {g.grade}
                </MenuItem>
              ))}
            </TextField>
          )}

          {categoryEnabled && (
            <TextField
              select
              label="Monthly Fee"
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
              content={() => componentRef.current}
              documentTitle={filteredStudents.grade?.name}
              pageStyle="print"
            />
            <div ref={componentRef}>
              {selectedMonth && (
                <TableContainer
                  component={Paper}
                  style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                >
                  <div className="tableHeadTitle">
                    <h2>GCEC Private School</h2>
                  </div>

                  <div className="totalStudentLength">
                    <p>Total : {filteredStudents.length} students</p>

                    {/* All Combine fee amount here  */}
                    <p>Total Fee : {calculateTotalFee()} MMK</p>
                    <p>
                      Academic{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {academic.name}
                      </span>{" "}
                      {selectedMonth} fees payment
                    </p>
                    <p>Grade : {selectedGrade}</p>
                  </div>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell align="left">S-Id</TableCell>
                        <TableCell align="left">StudentName</TableCell>
                        <TableCell align="left">Grade</TableCell>
                        <TableCell align="left">Amount Paid</TableCell>
                        <TableCell align="left">Remaing</TableCell>
                        <TableCell align="left">Paid Date</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">PaidBy</TableCell>
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
                          <TableCell align="left">
                            {payment.studentId}
                          </TableCell>
                          <TableCell align="left">{payment.name}</TableCell>
                          <TableCell align="left">{payment.grade}</TableCell>
                          <TableCell align="left">{payment.value}</TableCell>
                          <TableCell align="left">{payment.remain}</TableCell>
                          <TableCell align="left">{payment.date}</TableCell>
                          <TableCell align="left">{payment.status}</TableCell>
                          <TableCell align="left">{payment.paidBy}</TableCell>
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
    </Student>
  );
};

export default StudentFeeList;
