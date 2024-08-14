import React from "react";
import StudentSearch from "./StudentSearch";
import Student from "../Student";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSearch } from "../../../components/hooks/searchContext";

const StudentSearchList = () => {
  const [values] = useSearch();
  return (
    <Student>
      <div className="studentListHeader">
        <h1>Student List</h1>
        <StudentSearch />
        <h1>Sort</h1>
      </div>

      <div className="studentTableContainer">
        <>
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
                {values?.results.map((s, index) => (
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

                    <TableCell align="left" className="Details">
                      Details
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </div>
    </Student>
  );
};

export default StudentSearchList;
