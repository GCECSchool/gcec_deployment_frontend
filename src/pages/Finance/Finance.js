import React, { useState, useEffect, useRef } from "react";
import { TextField, MenuItem, Modal, Button } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useAcademicContext } from "../Finance/FinanceContext";
import "./Finance.css";
import { IoMdPrint } from "react-icons/io";
import { ReactToPrint } from "react-to-print";
import { useLocation } from "react-router-dom";

const Finance = () => {
  const location = useLocation(); // Get location object
  const { academics } = useAcademicContext();
  const [grades, setGrades] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [academic, setAcademic] = useState({});
  const [selectedAcademics, setSelectedAcademics] = useState(
    location.state?.selectedAcademics || ""
  );
  const [selectedGrade, setSelectedGrade] = useState(
    location.state?.selectedGrade || ""
  );
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [remainAmount, setRemainAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [edited, setEdited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchEdit, setSearchEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const componentRef = useRef(null);

  const sortGrades = (grades) => {
    // Define your custom order based on grade names
    const customOrder = [
      "Nursery",
      "KG",
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
      "Grade 7",
      "Grade 8",
      "Grade 9",
      "Grade 10",
      "Grade 11",
      "Grade 12",
      "Inter - L1",
      "Inter - L2",
      "Inter - L3",
      "Inter - L4",
      "Inter - L5",
      "Inter - L6",
    ];

    // Sort grades array based on customOrder
    grades.sort((a, b) => {
      return customOrder.indexOf(a.name) - customOrder.indexOf(b.name);
    });

    return grades;
  };

  useEffect(() => {
    getAllGrades();
  }, []);

  const getAllGrades = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/grade/all"
      );
      // Sort grades using custom sorting function
      const sortedGrades = sortGrades(data.grades);
      setGrades(sortedGrades);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFeeAmountData();
  }, []);

  const getAllFeeAmountData = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/fee/all"
      );
      setFeeData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedAcademics && selectedGrade) {
      handleGradeChange({ target: { value: selectedGrade } });
    }
  }, [selectedAcademics, selectedGrade]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    const remain = parseFloat(remainAmount) || 0;
  }, [paymentAmount, remainAmount]);

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
    setSearchEdit(true);
    if (academic.studentProperties) {
      const selectedGradeProperties = academic.studentProperties.find(
        (property) => property.grade === gradeSlug
      );
      if (selectedGradeProperties) {
        const students = selectedGradeProperties.students;
        setFilteredStudents(students);
        console.log("My Students", students);
      } else {
        setFilteredStudents([]);
      }
    }
  };

  const handleCellClick = (student, month) => {
    setSelectedStudent(student);
    setSelectedMonth(month);

    const fee = student.financeProperties
      ?.find((fp) => fp.year === selectedAcademics)
      ?.fee.find((f) => f.month === month);

    if (fee) {
      setPaymentAmount(fee.value.toString());
      setRemainAmount(fee.remain.toString());
      setStatus(fee.status);
      setPaidBy(fee.paidBy);
      setSelectedDate(new Date(fee.date));
    } else {
      setPaymentAmount("");
      setRemainAmount("");
      setStatus("");
      setPaidBy("");
      setSelectedDate(new Date()); // Set current date if no existing fee data
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentAmount("");
    setRemainAmount("");
    setStatus("");
  };

  const handleSaveData = async () => {
    const amount = parseFloat(paymentAmount) || 0;
    const remain = parseFloat(remainAmount) || 0;
    const date = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

    try {
      const response = await axios.put(
        `https://gcecbackend-195.onrender.com/api/v1/student/updateFinance/${selectedStudent.slug}`,
        {
          financeProperties: [
            {
              year: selectedAcademics,
              fee: [
                {
                  month: selectedMonth,
                  value: amount,
                  remain: remain,
                  date: date,
                  status: status,
                  paidBy: paidBy,
                },
              ],
            },
          ],
        }
      );

      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.slug === selectedStudent.slug
            ? {
                ...student,
                financeProperties: response.data.student.financeProperties,
              }
            : student
        )
      );

      setPaymentAmount("");
      setRemainAmount("");
      setStatus("");
      setSelectedDate(null);
      setShowModal(false);
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage("There was an error saving the data. Please try again."); // Set error message
    }
  };

  const handlePrintData = async () => {
    const amount = parseFloat(paymentAmount) || 0;
    const remain = parseFloat(remainAmount) || 0;
    const date = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

    try {
      setShowPrint(true);
      const response = await axios.put(
        `https://gcecbackend-195.onrender.com/api/v1/student/updateFinance/${selectedStudent.slug}`,
        {
          financeProperties: [
            {
              year: selectedAcademics,
              fee: [
                {
                  month: selectedMonth,
                  value: amount,
                  remain: remain,
                  date: date,
                  status: status,
                  paidBy: paidBy,
                },
              ],
            },
          ],
        }
      );

      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.slug === selectedStudent.slug
            ? {
                ...student,
                financeProperties: response.data.student.financeProperties,
              }
            : student
        )
      );
    } catch (error) {
      console.error("Error saving data:", error);
      setErrorMessage("There was an error saving the data. Please try again."); // Set error message
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredStudentsBySearch = filteredStudents.filter(
    (student) =>
      student.engName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteData = async () => {
    try {
      await axios.delete(
        `https://gcecbackend-195.onrender.com/api/v1/student/deleteFinance/${selectedStudent.slug}`,
        {
          data: {
            year: selectedAcademics,
            month: selectedMonth,
          },
        }
      );

      setFilteredStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.slug === selectedStudent.slug
            ? {
                ...student,
                financeProperties: student.financeProperties.map((fp) =>
                  fp.year === selectedAcademics
                    ? {
                        ...fp,
                        fee: fp.fee.filter((f) => f.month !== selectedMonth),
                      }
                    : fp
                ),
              }
            : student
        )
      );

      setPaymentAmount("");
      setRemainAmount("");
      setStatus("");
      setSelectedDate(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClosePrintModal = () => {
    setShowPrint(false);
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="financeMainConatainer">
        <h1>Student Fees</h1>

        {errorMessage && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {errorMessage}
          </div>
        )}

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
              {grades?.map((g) => (
                <MenuItem key={g._id} value={g.slug}>
                  {g.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        {/* Search Input here */}
        {searchEdit && (
          <div className="financeYearSelect">
            <TextField
              label="Search by ID or Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        )}

        {edited ? (
          <div className="financeTableContainer">
            <div className="tableScroll">
              <table className="timetable">
                <thead>
                  <tr>
                    <th>No</th> {/* Added header for index */}
                    <th>S-Id</th> {/* Added header for index */}
                    <th>Name</th> {/* Added header for name */}
                    <th>Contacts</th>
                    {months.map((month) => (
                      <th key={month} align="center">
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentsBySearch.map((student, studentIdx) => (
                    <tr key={studentIdx}>
                      <td>{studentIdx + 1}</td> {/* Display index */}
                      <td>{student.studentId}</td>
                      <td component="th" scope="row">
                        {student.engName}
                      </td>
                      <td>
                        {student.contactOne} <br /> {student.contactTwo}
                      </td>
                      {months.map((month, monthIdx) => {
                        const fee = student.financeProperties
                          ?.find((fp) => fp.year === selectedAcademics)
                          ?.fee.find((f) => f.month === month);

                        return (
                          <td
                            key={monthIdx}
                            onClick={() => handleCellClick(student, month)}
                          >
                            {fee ? (
                              <div>
                                <div>{`${fee.value}`}</div>
                                <div>{fee.status}</div>
                                <div>{fee.date}</div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* Data Modal */}
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
              width: "90%", // Set initial width for larger screens
              maxWidth: "400px", // Set maximum width
              maxHeight: "70%", // Set maximum height
              overflow: "auto",
              "@media (min-width: 600px)": {
                width: "70%", // Adjust width for smaller screens
              },
              "@media (min-width: 960px)": {
                width: "50%", // Adjust width for even smaller screens
              },
            },
          }}
        >
          <div className="modalContainer">
            <h2 className="printTitle">{selectedMonth} Payment</h2>
            <div>
              {/* Select Fee   */}
              <TextField
                select
                label="Select Fees"
                variant="outlined"
                fullWidth
                margin="normal"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              >
                <MenuItem value="">Select Fee</MenuItem>
                {feeData?.map((g, idx) => (
                  <MenuItem key={idx} value={g.amount}>
                    {g.amount}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                style={{ marginTop: "1rem" }}
                type="number"
                label="Enter remain"
                value={remainAmount}
                onChange={(e) => setRemainAmount(e.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Status"
                variant="outlined"
                fullWidth
                margin="normal"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Discount">Discount</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </TextField>

              <TextField
                select
                label="PaidBy"
                variant="outlined"
                fullWidth
                margin="normal"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
              >
                <MenuItem value="">Payment Type</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="KPay">KPay</MenuItem>
              </TextField>

              {/* To fill the current date today in the field */}

              <div style={{ marginTop: "1rem" }}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                  className="datePicker"
                />
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveData}
                style={{ marginTop: "1rem" }}
              >
                Save
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handlePrintData}
                style={{ marginTop: "1rem", marginLeft: "0.5rem" }}
              >
                Print <IoMdPrint />
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteData}
                style={{ marginTop: "1rem", marginLeft: "0.5rem" }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        {/* Print Modal */}
        <Modal
          open={showPrint}
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
              width: "90%", // Set initial width for larger screens
              maxWidth: "400px", // Set maximum width
              maxHeight: "70%", // Set maximum height
              overflow: "auto",
              "@media (min-width: 600px)": {
                width: "70%", // Adjust width for smaller screens
              },
              "@media (min-width: 960px)": {
                width: "50%", // Adjust width for even smaller screens
              },
            },
          }}
        >
          <div className="modalContainer">
            <h2 className="printTitle">{selectedMonth} Payment</h2>
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "1rem" }}
                >
                  Print <IoMdPrint />
                </Button>
              )}
              content={() => componentRef.current}
            />

            <Button
              variant="contained"
              color="error"
              onClick={handleClosePrintModal}
              style={{ marginTop: "1rem", marginLeft: "0.5rem" }}
            >
              Close
            </Button>

            <div className="printContainer" ref={componentRef}>
              <div className="printWidth">
                <div className="logoContainer">
                  <img src="/bglogo.png" alt="Logo" />
                </div>

                <p className="printAddress">Taungzalat, Kalaymyo</p>
                <p className="reciptText">RECEIPT / VOUCHER</p>
                <p className="printAddress">
                  09457373234, 09959053881, 09793322469
                </p>

                <div className="dateContainer">
                  <p>{selectedStudent?.grade?.name}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {selectedDate
                      ? selectedDate.toISOString().split("T")[0]
                      : ""}
                  </p>
                </div>

                <div className="InfoPrint">
                  <div className="dataRow">
                    <p>Name:</p>
                    <p>{selectedStudent?.engName}</p>
                  </div>

                  <div className="dataRow">
                    <p>Payment Amount:</p>
                    <p>{paymentAmount}</p>
                  </div>

                  <div className="dataRow">
                    <p>Month:</p>
                    <p>{selectedMonth}</p>
                  </div>

                  <div className="PaidTotal">
                    <p>{status}</p>
                  </div>

                  <div className="dataRow">
                    <p>Paid By:</p>
                    <p>{paidBy}</p>
                  </div>

                  <div>
                    <p> --- Thank You --- </p>
                    <p>သွင်းပြီးငွေ ပြန်မအမ်းပါ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Finance;
