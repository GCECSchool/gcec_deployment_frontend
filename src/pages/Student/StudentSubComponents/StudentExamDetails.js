import React, { useEffect, useState } from "react";
import Student from "../Student";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StudentExamDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [student, setStudent] = useState(null);
  const [examData, setExamData] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (params?.slug && params?.year && params?.month) {
      getSingleStudent();
    }
  }, [params]);

  const getSingleStudent = async () => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/student/single/${params.slug}`
      );
      setStudent(data.student);

      const selectedYear = params.year;
      const selectedMonth = params.month;

      const examsForSelectedMonth = data.student.examProperties
        .filter((exam) => exam.year === selectedYear)
        .flatMap((exam) =>
          exam.examData.filter((data) => data.month === selectedMonth)
        );

      if (examsForSelectedMonth.length > 0) {
        setExamData(examsForSelectedMonth[0].exams);

        const uniqueSubjects = [
          ...new Set(examsForSelectedMonth[0].exams.map((e) => e.name)),
        ];
        setSubjects(uniqueSubjects);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step
  };

  return (
    <Student>
      <div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleGoBack}
        >
          Back
        </button>
      </div>
      <h1>Student Exam Details</h1>

      {student && (
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Grade</TableCell>
                {subjects.map((subject, idx) => (
                  <TableCell key={idx} align="left">
                    {subject}
                  </TableCell>
                ))}
                <TableCell align="left">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
              <TableRow>
                <TableCell component="th" scope="row">
                  1
                </TableCell>
                <TableCell align="left">{student.engName}</TableCell>
                <TableCell align="left">{student.grade.name}</TableCell>
                {subjects.map((subject, idx) => {
                  const subjectExam = examData.find((e) => e.name === subject);
                  return (
                    <TableCell key={idx} align="left">
                      {subjectExam ? subjectExam.value : "N/A"}
                    </TableCell>
                  );
                })}
                <TableCell align="left">
                  {examData.reduce((acc, curr) => acc + curr.value, 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Student>
  );
};

export default StudentExamDetails;
