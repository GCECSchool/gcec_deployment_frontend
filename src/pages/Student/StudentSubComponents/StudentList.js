import React, { useEffect, useState } from "react";
import Student from "../Student";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudents();
  }, [page]);

  const getAllStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://gcecbackend-195.onrender.com/api/v1/student/all?page=${page}`
      );
      const { data, pages: totalPages } = await res.json();

      setPages(totalPages);
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (slug) => {
    navigate(`/stud-dash-details/${slug}`);
  };

  return (
    <Student>
      <div className="studentListHeader">
        <div className="studentListTitle">
          <h1>Student List</h1>
        </div>
      </div>

      <div className="studentTableContainer">
        <>
          <Pagination page={page} pages={pages} changePage={setPage} />

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
                    <TableCell align="left">StudentId</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Grade</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ color: "white" }}>
                  {students?.map((s, index) => (
                    <TableRow
                      key={s._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{s.studentId}</TableCell>
                      <TableCell align="left">{s.engName}</TableCell>
                      <TableCell align="left">{s.grade?.name}</TableCell>

                      <TableCell
                        align="left"
                        className="Details"
                        onClick={() => handleEdit(s.slug)}
                      >
                        Details
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Pagination page={page} pages={pages} changePage={setPage} />
        </>
      </div>
    </Student>
  );
};

export default StudentList;
