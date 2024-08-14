import React, { useState } from "react";
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
import axios from "axios";
import { useAcademicContext } from "../../Finance/FinanceContext";
import { useNavigate } from "react-router-dom";

const StudentExamList = () => {
  const navigate = useNavigate();
  const { academics } = useAcademicContext();
  const [academic, setAcademic] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);

  console.log("All Years", academics);

  const handleYearChange = async (event) => {
    const selectedAcademicSlug = event.target.value;
    setSelectedAcademic(selectedAcademicSlug);

    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/academic/singleRemove/${selectedAcademicSlug}`
      );
      setAcademic(data.academic);
      console.log("Selected Academic:", selectedAcademicSlug);
      console.log("Academic Data:", data.academic);
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
      console.log("Selected Grade Properties:", selectedGradeProperties);
      if (selectedGradeProperties) {
        const students = selectedGradeProperties.students.filter((student) =>
          student.examProperties.some((exam) => exam.year === academic.name)
        );
        console.log("Filtered Students:", students);
        setFilteredStudents(students);

        const uniqueMonths = [
          ...new Set(
            students.flatMap((student) =>
              student.examProperties
                .filter((exam) => exam.year === academic.name)
                .flatMap((exam) => exam.examData.map((data) => data.month))
            )
          ),
        ];
        console.log("Unique Months:", uniqueMonths);
        setMonths(uniqueMonths);
      } else {
        setFilteredStudents([]);
        setMonths([]);
      }
    }
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);

    const studentsWithSelectedMonth = filteredStudents
      .map((student) => {
        const filteredExams = student.examProperties
          .filter((exam) => exam.year === academic.name)
          .map((exam) => ({
            ...exam,
            examData: exam.examData.filter((data) => data.month === month),
          }))
          .filter((exam) => exam.examData.length > 0);
        return {
          ...student,
          examProperties: filteredExams,
        };
      })
      .filter((student) => student.examProperties.length > 0);

    setFilteredStudents(studentsWithSelectedMonth);
  };

  const handleEdit = (slug, year, month) => {
    navigate(`/student-exam-details/${slug}/${year}/${month}`);
  };

  return (
    <Student>
      <div className="financeMainConatainer">
        <h1>Student Exam</h1>

        <div className="financeYearSelect">
          <TextField
            select
            label="Academic Years"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedAcademic}
            onChange={handleYearChange}
          >
            <MenuItem value="">Select Year</MenuItem>
            {academics?.map((academic, idx) => (
              <MenuItem key={idx} value={academic.slug}>
                {academic.name}
              </MenuItem>
            ))}
          </TextField>

          {selectedAcademic && (
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

          {selectedGrade && (
            <TextField
              select
              label="Months"
              variant="outlined"
              fullWidth
              margin="normal"
              value={selectedMonth}
              onChange={handleMonthChange}
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

        <div className="examTable">
          {filteredStudents.length > 0 && selectedMonth && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student, idx) =>
                    student.examProperties.map((exam, examIdx) =>
                      exam.examData.map((data, dataIdx) => (
                        <TableRow key={`${idx}-${examIdx}-${dataIdx}`}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{student.engName}</TableCell>
                          <TableCell>{exam.year}</TableCell>
                          <TableCell>{data.month}</TableCell>
                          <TableCell>{data.total}</TableCell>
                          <TableCell
                            align="left"
                            className="Details"
                            onClick={() =>
                              handleEdit(student.slug, exam.year, data.month)
                            }
                          >
                            Details
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </Student>
  );
};

export default StudentExamList;
