import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import LoginNav from "./components/LoginNav.jsx";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLibraryStaff from "./pages/admin/AdminLibraryStaff";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReports from "./pages/admin/AdminReports";

import LibraryLogin from "./pages/library/LibraryLogin";
import LibraryDashboard from "./pages/library/LibraryDashboard";
import BooksIssued from "./pages/library/BooksIssued";
import BooksReturned from "./pages/library/BooksReturned";
import FineCollected from "./pages/library/FineCollected";
import AddBook from "./pages/library/AddBook";
import ViewAllBooks from "./pages/library/ViewAllBooks";

import StaffLogin from "./pages/staff/StaffLogin";
import StaffRegister from "./pages/staff/StaffRegister";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffBooksIssued from "./pages/staff/StaffBooksIssued";
import StaffBooksReturned from "./pages/staff/StaffBooksReturned";


import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentBooksIssued from "./pages/student/StudentBooksIssued";
import StudentBooksReturned from "./pages/student/StudentBooksReturned";
import StudentFinePaid from "./pages/student/StudentFinePaid";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginNav />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/library-staff" element={<AdminLibraryStaff />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        <Route path="/library/login" element={<LibraryLogin />} />
        <Route path="/library/dashboard" element={<LibraryDashboard />} />
        <Route path="/library/books-issued" element={<BooksIssued />} />
        <Route path="/library/books-returned" element={<BooksReturned />} />
        <Route path="/library/fine-collected" element={<FineCollected />} />
        <Route path="/library/add-book" element={<AddBook />} />
        <Route path="/library/all-books" element={<ViewAllBooks />} />

        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/register" element={<StaffRegister />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/books-issued" element={<StaffBooksIssued />} />
        <Route path="/staff/books-returned" element={<StaffBooksReturned />} />


        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/books-issued" element={<StudentBooksIssued />} />
        <Route path="/student/books-returned" element={<StudentBooksReturned />} />
        <Route path="/student/fine-paid" element={<StudentFinePaid />} />

      </Routes>
    </Router>
  );
}

export default App;
