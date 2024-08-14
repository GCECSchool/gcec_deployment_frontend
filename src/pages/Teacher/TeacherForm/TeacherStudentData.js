import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout/Layout";

const TeacherStudentData = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) getSingleTeacher();
  }, [params?.slug]);

  const getSingleTeacher = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/teacher/singlePopulateData/${params.slug}`
      );
      setTeacher(data.teacher);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate("/teachers-data");
  };

  return (
    <Layout>
      <div className="dataTableContainer">
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>

          <h1>Teacher Data</h1>
        </div>

        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
            <p className="loadingTeacher">Loading student please wait...</p>
          </div>
        ) : (
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
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
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
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
        )}
      </div>
    </Layout>
  );
};

export default TeacherStudentData;
