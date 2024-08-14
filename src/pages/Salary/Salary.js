import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Modal, Button } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAcademicContext } from "../Finance/FinanceContext";

const Salary = () => {
  const { academics } = useAcademicContext();
  const [academic, setAcademic] = useState({});
  const [selectedAcademics, setSelectedAcademics] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    const bonus = parseFloat(bonusAmount) || 0;
    setTotalBalance(amount + bonus);
  }, [paymentAmount, bonusAmount]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleYearChange = async (event) => {
    const selectedAcademicSlug = event.target.value;
    setSelectedAcademics(selectedAcademicSlug);
    setCategoryEnabled(true);

    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/academic/singleRemove/${selectedAcademicSlug}`
      );
      setAcademic(data.academic);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGradeChange = (event) => {
    const gradeSlug = event.target.value;
    setSelectedGrade(gradeSlug);
    setEdited(true);
    if (academic.teacherProperties) {
      const selectedGradeProperties = academic.teacherProperties.find(
        (property) => property.grade === gradeSlug
      );
      if (selectedGradeProperties) {
        const teachers = selectedGradeProperties.teachers;
        setFilteredTeachers(teachers);
      } else {
        setFilteredTeachers([]);
      }
    }
  };

  const handleCellClick = (teacher, month) => {
    setSelectedTeacher(teacher);
    setSelectedMonth(month);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentAmount("");
    setBonusAmount("");
    setTotalBalance(0);
  };

  const handleSaveData = async () => {
    const amount = parseFloat(paymentAmount) || 0;
    const bonus = parseFloat(bonusAmount) || 0;

    try {
      const response = await axios.put(
        `https://gcecbackend-195.onrender.com/api/v1/teacher/update-finance/${selectedTeacher.slug}`,
        {
          financeProperties: [
            {
              year: selectedAcademics,
              salary: [
                {
                  month: selectedMonth,
                  value: amount,
                  bonus: bonus,
                  total: amount + bonus,
                },
              ],
            },
          ],
        }
      );

      setFilteredTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.slug === selectedTeacher.slug
            ? {
                ...teacher,
                financeProperties: response.data.teacher.financeProperties,
              }
            : teacher
        )
      );

      setPaymentAmount("");
      setBonusAmount("");
      setTotalBalance(0);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const getTotalForMonth = (teacher, month) => {
    const yearData = teacher.financeProperties.find(
      (f) => f.year === selectedAcademics
    );
    if (yearData) {
      const monthData = yearData.salary.find((s) => s.month === month);
      return monthData ? monthData.total : "";
    }
    return "";
  };

  return (
    <Layout>
      <div className="financeMainConatainer">
        <h1>Teacher Salary</h1>

        <div className="financeYearSelect">
          <TextField
            select
            label="Academic Years"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedAcademics}
            onChange={handleYearChange}
          >
            <MenuItem value="">Select Year</MenuItem>
            {academics?.map((a) => (
              <MenuItem key={a._id} value={a.slug}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>

          {categoryEnabled && (
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
              {academic.teacherProperties?.map((g, idx) => (
                <MenuItem key={idx} value={g.grade}>
                  {g.grade}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        {edited ? (
          <div className="financeTableContainer">
            <div className="tableScroll">
              <table className="timetable">
                <thead>
                  <tr>
                    <th></th>
                    {months.map((month) => (
                      <th key={month} align="center">
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, teachIdx) => (
                    <tr key={teachIdx}>
                      <td component="th" scope="row">
                        <img
                          src={teacher.image.url}
                          alt={teacher.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        {teacher.name}
                      </td>
                      {months.map((month, index) => (
                        <td
                          key={index}
                          onClick={() => handleCellClick(teacher, month)}
                        >
                          {getTotalForMonth(teacher, month)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}

        <Modal
          open={showModal}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .modalContainer": {
              backgroundColor: "white",
              color: "black",
              border: "2px solid #000",
              boxShadow: 24,
              padding: "20px",
              width: "50%",
              maxWidth: "400px",
              maxHeight: "70%",
              overflow: "auto",
            },
          }}
        >
          <div className="modalContainer">
            <h2>{selectedMonth} Month</h2>
            <div>
              <TextField
                type="number"
                label="Enter payment"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                fullWidth
              />

              <TextField
                style={{ marginTop: "1rem" }}
                type="number"
                label="Enter bonus"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                fullWidth
              />

              <p>Total: {totalBalance}</p>
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveData}
            >
              Save
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Salary;
