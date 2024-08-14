import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Student from "./pages/Student/Student";
import Teacher from "./pages/Teacher/Teacher";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import StudentList from "./pages/Student/StudentSubComponents/StudentList";
import StudentTimetableList from "./pages/Student/StudentSubComponents/StudentTimetableList";
import StudentExamList from "./pages/Student/StudentSubComponents/StudentExamList";
import StudentFeeList from "./pages/Student/StudentSubComponents/StudentFeeList";
import StudentSearchList from "./pages/Student/StudentForm/StudentSearchList";
import Post from "./pages/Post/Post";
import PostForm from "./pages/Post/PostForm";
import StudentTimeList from "./pages/Student/StudentTimeTableForm/StudentTimeList";
import Calendar from "./pages/Calendar/Calendar";
import Finance from "./pages/Finance/Finance";
import TeacherList from "./pages/Teacher/TeacherSubComponents/TeacherList";
import TeacherSalary from "./pages/Teacher/TeacherSubComponents/TeacherSalary";
import Salary from "./pages/Salary/Salary";
import StudentSortGrade from "./pages/Student/StudentSubComponents/StudentSortGrade";
import TeacherSortGrade from "./pages/Teacher/TeacherSubComponents/TeacherSortGrade";
import TeacherData from "./pages/Teacher/TeacherForm/TeacherData";
import TeacherDataDetails from "./pages/Teacher/TeacherForm/TeacherDataDetails";
import TeacherStudentData from "./pages/Teacher/TeacherForm/TeacherStudentData";
import StudentExamDetails from "./pages/Student/StudentSubComponents/StudentExamDetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import StudSearchDash from "./pages/Dashboard/StudSearchDash";
import TeahSearchDash from "./pages/Dashboard/TeahSearchDash";
import StudentDashDetails from "./pages/Dashboard/StudentDashDetails";
import TeacherDashDetails from "./pages/Dashboard/TeacherDashDetails";
import StudentRoom from "./pages/Student/StudentSubComponents/StudentRoom";
import PrintContent from "./pages/Finance/PrintContent";
import DailyFee from "./pages/Student/StudentSubComponents/DailyFee";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<PageNotFound />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stud-search-dash" element={<StudSearchDash />} />
      <Route path="/tech-search-dash" element={<TeahSearchDash />} />

      <Route path="/stud-dash-details/:slug" element={<StudentDashDetails />} />
      <Route path="/tech-dash-details/:slug" element={<TeacherDashDetails />} />

      {/* Posts */}
      <Route path="/posts" element={<Post />} />
      <Route path="/post-form" element={<PostForm />} />

      {/* Calendars */}
      <Route path="/calendar" element={<Calendar />} />

      {/* Students */}
      <Route path="/students" element={<Student />} />
      <Route path="/students-list" element={<StudentList />} />
      <Route path="/students-sort-grade" element={<StudentSortGrade />} />
      <Route path="/students-room-grade" element={<StudentRoom />} />
      <Route path="/students-timetable" element={<StudentTimetableList />} />

      <Route path="/students-exam" element={<StudentExamList />} />
      <Route
        path="/student-exam-details/:slug/:year/:month"
        element={<StudentExamDetails />}
      />

      <Route path="/students-fee" element={<StudentFeeList />} />
      <Route path="/daily-fee" element={<DailyFee />} />
      <Route path="/student-search-list" element={<StudentSearchList />} />
      <Route path="/student-grade-time-list" element={<StudentTimeList />} />

      {/* Teachers */}
      <Route path="/teachers" element={<Teacher />} />
      <Route path="/teachers-list" element={<TeacherList />} />
      <Route path="/teachers-data" element={<TeacherData />} />
      <Route path="/tech-data-details/:slug" element={<TeacherDataDetails />} />
      <Route
        path="/teachers-students-details/:slug"
        element={<TeacherStudentData />}
      />
      <Route path="/teachers-sort-grade" element={<TeacherSortGrade />} />
      <Route path="/teachers-salary" element={<TeacherSalary />} />

      {/* Finances */}
      <Route path="/finances" element={<Finance />} />

      <Route path="/print-content" element={<PrintContent />} />

      {/* Salary */}
      <Route path="/salaries" element={<Salary />} />
    </Routes>
  );
}

export default App;
