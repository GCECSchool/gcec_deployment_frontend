import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TeacherDashDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [teacher, setTeacher] = useState({
    gender: "",
    nationality: "",
    religion: "",
  });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (params?.slug) getSingleTeacher();
    // eslint-disable-next-line
  }, [params?.slug]);

  useEffect(() => {
    getAllGrades();
  }, []);

  const getAllGrades = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/grade/all"
      );
      setGrades(data.grades);
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleTeacher = async () => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/teacher/single/${params.slug}`
      );
      setTeacher(data.teacher);
      setMyId(data.teacher._id);
      console.log("My Teacher", data.teacher);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch teacher details. Please try again later.");
    }
  };

  const handleNavigateTeacher = () => {
    navigate(-1);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Layout>
      <div className="teacherContainer">
        <div className="teacherFormTopbar">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNavigateTeacher}
          >
            Back
          </button>
        </div>

        {loading ? (
          <div>
            <h1 className="loadingTeacher">Loading please wait...</h1>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Image upload */}
            <div className="mainUploadContainer">
              <label>
                {teacher.image && teacher.image.url ? (
                  <img
                    src={image ? URL.createObjectURL(image) : teacher.image.url} // Use the url property of the image object
                    alt="Uploaded Photo"
                    className="uploadPhoto"
                  />
                ) : (
                  <div className="uploadPhoto">Upload Photo</div>
                )}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </div>

            {/* Started Years */}
            <div className="studentFormMainBar">
              <h2>Started Years</h2>
              {teacher?.financeProperties?.length > 0 && (
                <p>
                  This teacher is started at{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {teacher?.financeProperties[0]?.year}
                  </span>{" "}
                  academic year
                </p>
              )}
            </div>

            <div className="teacherFormMainBar">
              {/* Id and Name */}
              <div className="teacherFormInput">
                <TextField
                  label="TeacherId"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.teacherId}
                  InputLabelProps={{ shrink: !!teacher.teacherId }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, teacherId: e.target.value })
                  }
                />

                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.name}
                  InputLabelProps={{ shrink: !!teacher.name }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, name: e.target.value })
                  }
                />
              </div>

              {/* Birth and Password */}
              <div className="teacherFormInput">
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.birth}
                  InputLabelProps={{ shrink: !!teacher.birth }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, birth: e.target.value })
                  }
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.teacherPassword}
                  InputLabelProps={{ shrink: !!teacher.teacherPassword }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, teacherPassword: e.target.value })
                  }
                />
              </div>

              {/* Grade and Gender */}
              <div className="teacherFormInput">
                <TextField
                  select
                  label="Teacher's Grade"
                  value={teacher.grade ? teacher.grade._id : ""}
                  onChange={(e) => {
                    const selectedGrade = grades.find(
                      (g) => g._id === e.target.value
                    );
                    setTeacher({ ...teacher, grade: selectedGrade });
                  }}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: !!teacher.grade, // Only shrink if there is a value selected
                  }}
                >
                  <MenuItem value="">Select Teacher's Grade</MenuItem>
                  {/* Render options for teacher's grade */}
                  {grades.map((g) => (
                    <MenuItem key={g._id} value={g._id}>
                      {g.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Gender"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.gender}
                  onChange={(e) =>
                    setTeacher({ ...teacher, gender: e.target.value })
                  }
                  InputLabelProps={{
                    shrink: !!teacher.gender, // Only shrink if there is a value selected
                  }}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </div>

              {/* Nationality and Religion */}
              <div className="teacherFormInput">
                <TextField
                  select
                  label="Nationality"
                  value={teacher.nationality}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: !!teacher.nationality }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, nationality: e.target.value })
                  }
                >
                  <MenuItem value="">Select Nationality</MenuItem>
                  <MenuItem value="Chin">Chin</MenuItem>
                  <MenuItem value="Burmese">Burmese</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Religion"
                  value={teacher.religion}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: !!teacher.religion }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, religion: e.target.value })
                  }
                >
                  <MenuItem value="">Select Religion</MenuItem>
                  <MenuItem value="Christian">Christian</MenuItem>
                  <MenuItem value="Buddist">Buddist</MenuItem>
                  <MenuItem value="Musilm">Musilm</MenuItem>
                  <MenuItem value="Hindo">Hindo</MenuItem>
                </TextField>
              </div>

              {/* Father-Name and Father-NRC */}
              <div className="teacherFormInput">
                <TextField
                  label="Father Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.fatherName}
                  InputLabelProps={{ shrink: !!teacher.fatherName }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, fatherName: e.target.value })
                  }
                />

                <TextField
                  label="Father NRC"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.fatherNRC}
                  InputLabelProps={{ shrink: !!teacher.fatherNRC }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, fatherNRC: e.target.value })
                  }
                />
              </div>

              {/*  Address */}
              <div className="teacherFormInput">
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.address}
                  InputLabelProps={{ shrink: !!teacher.address }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, address: e.target.value })
                  }
                />
              </div>

              {/* ContactOne and ContactTwo */}
              <div className="teacherFormInput">
                <TextField
                  label="Phone-1"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.contactOne}
                  InputLabelProps={{ shrink: !!teacher.contactOne }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, contactOne: e.target.value })
                  }
                />

                <TextField
                  label="Phone-2"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={teacher.contactTwo}
                  InputLabelProps={{ shrink: !!teacher.contactTwo }}
                  onChange={(e) =>
                    setTeacher({ ...teacher, contactTwo: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Display Teacher Subjects And Students */}
        <div className="teacherFormMainBar">
          <h1>Teacher Properties</h1>
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Homeclass Students</TableCell>
                  <TableCell align="left">Teaching Grades</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ color: "white" }}>
                {teacher && (
                  <TableRow
                    key={teacher._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      1
                    </TableCell>
                    <TableCell align="left">{teacher.name}</TableCell>
                    <TableCell align="left">
                      {teacher.homeClassStudents?.map((homeClassStudent) => (
                        <div key={homeClassStudent._id}>
                          {teacher.grade.name} ( {homeClassStudent.myClass} )
                        </div>
                      ))}
                    </TableCell>
                    <TableCell align="left">
                      {teacher.studentProperties?.map((studentProperty) => (
                        <div key={studentProperty._id}>
                          {studentProperty.grade}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashDetails;
