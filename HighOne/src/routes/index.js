import React from "react"
import { Navigate } from "react-router-dom"
import Chat from "../pages/Chat/Chat"
import UserProfile from "../pages/Authentication/user-profile"
import Attendance from "../pages/Attendance/index"
import Calendar from "../pages/Calendar/index"
import Pages404 from "pages/Utility/pages-404"
import Login from "../pages/Authentication/Login"
import TeacherLogin from "../pages/Authentication/TeacherLogin"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import ChangePassword from "../pages/Authentication/ChangePassword"
import Dashboard from "../pages/Dashboard/index"
import AddPost from "../pages/Post/AddPost"
import Post from "../pages/Post/PostList/index"
import EditPost from "pages/Post/EditPost"
import Notes from "pages/Notes"
import TimeTable from "pages/TimeTable"
import Notesmodel from "pages/Notes/Notesmodel"
import AddAcademicCalender from "pages/AcademicCalender/AddAcademicCalender"
import AdminNotes from "pages/Notes/AdminNotes"
import Circular from "pages/Circular"
import CreateCircular from "pages/Circular/addCircular"
import EditCircular from "pages/Circular/editCircular"
import AcademicSession from "pages/AcademicSession/AcademicSession"
import StudentReport from "pages/Attendance/StudentReport"
import TestPage from "pages/ExamTest/TestPage"
import TestEditPage from "pages/ExamTest/TestEditPage"
import TestCreatePage from "pages/ExamTest/TestCreatePage"
import Syllabus from "pages/Syllabus"
import Holiday from "pages/Holiday"
import AnnualResult from "pages/Result"
import ShowProfilePic from "pages/ProfilePic/ShowProfilePic"
import TestResult from "pages/ExamTest/TestResult"
import TestAnswer from "pages/ExamTest/TestAnswer"
import Classgroup from "pages/ClassGroups/Classgroup"

const name = JSON.parse(localStorage.getItem("User"))

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  name == "Admin" ? { path: "/syllabus", component: <Syllabus /> } : "",
  name == "Admin" ? { path: "/result", component: <AnnualResult /> } : "",
  name == "Admin" ? { path: "/holiday", component: <Holiday /> } : "",
  name == "Admin"
    ? { path: "/academic-session", component: <AcademicSession /> }
    : "",
  name == "Admin"
    ? { path: "/academic-calender", component: <AddAcademicCalender /> }
    : "",
  name == "Admin" ? { path: "/circular", component: <Circular /> } : "",
  { path: "/add-circular", component: <CreateCircular /> },
  { path: "/edit-circular/:id", component: <EditCircular /> },
  { path: "/post", component: <Post /> },
  { path: "/add-post", component: <AddPost /> },
  { path: "/edit-post/:post_id", component: <EditPost /> },

  name == "Admin"
    // ? { path: "/notes", component: <Notes /> }
    ? { path: "/notes", component: <AdminNotes /> }
    : { path: "/notes", component: <Notes /> },

  { path: "/timetable", component: <TimeTable /> },

  { path: "/attendance", component: <Attendance /> },
  { path: "/student-report/:st_code", component: <StudentReport /> },

  { path: "/test", component: <TestPage /> },
  { path: "/exam/test/create", component: <TestCreatePage /> },
  { path: "/edittest/:test_id", component: <TestEditPage /> },
  { path: "/test-result/:test_id", component: <TestResult /> },
  { path: "/test-answer/:st_code", component: <TestAnswer /> },

  // ============ chat ==========
  { path: "/chat", component: <Chat /> },
  { path: "/chat/:id", component: <Chat /> },

  { path: "/calendar", component: <Calendar /> },
  { path: "/studentl", component: <Notesmodel /> },
  name == "Admin" ? " " : { path: "/profile", component: <UserProfile /> },
  name == "Admin"
    ? " "
    : { path: "/change-password", component: <ChangePassword /> },
  name == "Admin"
    ? { path: "/verify-profile", component: <ShowProfilePic /> }
    : "",

  name == "Admin"
    ? { path: "/classgroup", component: <Classgroup /> }
    : "",

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Pages404 /> },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/teacher_login", component: <TeacherLogin /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
