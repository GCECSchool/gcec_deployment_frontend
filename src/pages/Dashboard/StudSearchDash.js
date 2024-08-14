import React from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../components/hooks/searchContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dashboard from "./Dashboard";

const StudSearchDash = () => {
  const navigate = useNavigate();
  const [values] = useSearch();

  const handleDetail = (slug) => {
    navigate(`/stud-dash-details/${slug}`);
  };

  return (
    <Dashboard>
      <div className="studentSearchContainer">
        <div className="">
          <h1>Search Result</h1>
          <h6>
            {values?.results.length < 1
              ? "No Students Found"
              : `Found ${values?.results.length}`}
          </h6>

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

                    <TableCell
                      align="left"
                      className="Details"
                      onClick={() => handleDetail(s.slug)}
                    >
                      Details
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Dashboard>
  );
};

export default StudSearchDash;
