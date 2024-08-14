import React, { useEffect, useRef, useState } from "react";
import Student from "../Student";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ReactToPrint from "react-to-print";
import { IoMdPrint } from "react-icons/io";

const DailyFee = () => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    getAllStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      filterStudentsByDate(new Date());
    }
  }, [students]);

  const getAllStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/student/allData"
      );
      setStudents(data.students);
      console.log("All Students", data.students);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterStudentsByDate(date);
  };

  const filterStudentsByDate = (date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const filtered = students.filter((student) =>
        student.financeProperties?.some((finance) =>
          finance.fee.some((fee) => fee.date === formattedDate)
        )
      );
      const sortedFiltered = filtered.sort((a, b) =>
        a.engName.localeCompare(b.engName)
      );
      setFilteredStudents(sortedFiltered);
    } else {
      setFilteredStudents([]);
    }
  };

  const calculateTotalFee = () => {
    return filteredStudents.reduce((total, student) => {
      return (
        total +
        student.financeProperties.reduce((sum, finance) => {
          return (
            sum +
            finance.fee
              .filter((fee) => fee.date === format(selectedDate, "yyyy-MM-dd"))
              .reduce((feeSum, fee) => feeSum + fee.value, 0)
          );
        }, 0)
      );
    }, 0);
  };

  return (
    <Student>
      <h1>Daily Fee</h1>

      <div className="feeDateContainer">
        <div className="dateLabel">
          <label>Select Date: </label>
        </div>

        <div className="dateSelect">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className="datePicker"
          />
        </div>

        <div style={{ marginLeft: "5px" }}>
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
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress color="primary" size={40} thickness={4} />
          <p>Loading...</p>
        </div>
      ) : (
        <div ref={componentRef}>
          {filteredStudents.length > 0 && (
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
                  Academic fees payment for {format(selectedDate, "yyyy-MM-dd")}
                </p>

                <p>Total Fee : {calculateTotalFee()} MMK</p>
              </div>

              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell align="left">S-Id</TableCell>
                    <TableCell align="left">StudentName</TableCell>
                    <TableCell align="left">Grade</TableCell>
                    <TableCell align="left">Amount Paid</TableCell>
                    <TableCell align="left">Month</TableCell>
                    <TableCell align="left">Paid Date</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">PaidBy</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ color: "white" }}>
                  {filteredStudents.map((student, idx) =>
                    student.financeProperties.map((finance) =>
                      finance.fee
                        .filter(
                          (fee) =>
                            fee.date === format(selectedDate, "yyyy-MM-dd")
                        )
                        .map((fee, feeIdx) => (
                          <TableRow
                            key={`${idx}-${feeIdx}`}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {idx + 1}
                            </TableCell>
                            <TableCell align="left">
                              {student.studentId}
                            </TableCell>
                            <TableCell align="left">
                              {student.engName}
                            </TableCell>
                            <TableCell align="left">
                              {student.grade?.name}
                            </TableCell>
                            <TableCell align="left">{fee.value}</TableCell>
                            <TableCell align="left">{fee.month}</TableCell>
                            <TableCell align="left">{fee.date}</TableCell>
                            <TableCell align="left">{fee.status}</TableCell>
                            <TableCell align="left">{fee.paidBy}</TableCell>
                          </TableRow>
                        ))
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredStudents.length === 0 && selectedDate && (
            <p>No fee payments found for the selected date.</p>
          )}
        </div>
      )}
    </Student>
  );
};

export default DailyFee;
