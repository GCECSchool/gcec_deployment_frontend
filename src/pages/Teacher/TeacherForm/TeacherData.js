import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Teacher from "../Teacher";
import Pagination from "../../../components/Pagination/Pagination";

const TeacherData = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTeachers();
  }, []);

  const getAllTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://gcecbackend-195.onrender.com/api/v1/teacher/all?page=${page}`
      );
      const { data, pages: totalPages } = await res.json();

      setPages(totalPages);
      setTeachers(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetails = (slug) => {
    navigate(`/tech-data-details/${slug}`);
  };

  return (
    <Teacher>
      <div className="dataTableContainer">
        <div>
          <h1>Teacher Data</h1>
        </div>

        <Pagination page={page} pages={pages} changePage={setPage} />

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

                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
              {teachers?.map((t, index) => (
                <TableRow
                  key={t._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{t.name}</TableCell>
                  <TableCell align="left">{t.grade.name}</TableCell>

                  <TableCell
                    align="left"
                    className="Details"
                    onClick={() => handleDetails(t.slug)}
                  >
                    Details
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Teacher>
  );
};

export default TeacherData;
