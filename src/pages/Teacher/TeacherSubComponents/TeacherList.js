import React, { useEffect, useState } from "react";
import Teacher from "../Teacher";
import Pagination from "../../../components/Pagination/Pagination";
import TeacherCard from "./TeacherCard";
import { CircularProgress } from "@mui/material";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTeachers();
  }, [page]);

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Teacher>
      <div className="studentListHeader">
        <div className="teacherListTitle">
          <h1>Teachers List</h1>
        </div>
      </div>

      <div className="studentTableContainer">
        <>
          <Pagination page={page} pages={pages} changePage={setPage} />

          {loading ? (
            <div className="loadingContainer">
              <CircularProgress />
              <p className="loadingTeacher">Loading teachers please wait...</p>
            </div>
          ) : (
            <div className="teacherCardContainer">
              {/* Teacher Card Image and Name Components here */}
              {teachers?.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </>
      </div>
    </Teacher>
  );
};

export default TeacherList;
