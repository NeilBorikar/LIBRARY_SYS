import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LoginNav from "./components/LoginNav.jsx";
import RoleBasedRouter from "./components/RoleBasedRouter.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Add simple debugging
console.log('App component loading...');

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLibraryStaff from "./pages/admin/AdminLibraryStaff";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReports from "./pages/admin/AdminReports";

import LibraryLogin from "./pages/library/LibraryLogin";
import LibraryDashboard from "./pages/library/LibraryDashboard";
import LibraryDashboardEnhanced from "./pages/library/LibraryDashboardEnhanced";
import BooksIssued from "./pages/library/BooksIssued";
import BooksReturned from "./pages/library/BooksReturned";
import FineCollected from "./pages/library/FineCollected";
import AddBook from "./pages/library/AddBook";
import ViewAllBooks from "./pages/library/ViewAllBooks";
import ReminderManagement from "./pages/library/ReminderManagement";

import StaffLogin from "./pages/staff/StaffLogin";
import StaffRegister from "./pages/staff/StaffRegister";
import StaffDashboard from "./pages/staff/StaffDashboard";
import CollegeStaffDashboard from "./pages/staff/CollegeStaffDashboard";
import StaffBooksIssued from "./pages/staff/StaffBooksIssued";
import StaffBooksReturned from "./pages/staff/StaffBooksReturned";

import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentDashboardEnhanced from "./pages/student/StudentDashboardEnhanced";
import StudentBooksIssued from "./pages/student/StudentBooksIssued";
import StudentBooksReturned from "./pages/student/StudentBooksReturned";
import StudentFinePaid from "./pages/student/StudentFinePaid";


function App() {
  console.log('App component rendered');
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginNav />} />

          {/* Public Login Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/library/login" element={<LibraryLogin />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/register" element={<StaffRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/library-staff" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLibraryStaff />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute requiredRole="admin">
              <AdminStudents />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute requiredRole="admin">
              <AdminStaff />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } />

          {/* Protected Library Staff Routes */}
          <Route path="/library/dashboard" element={
            <ProtectedRoute requiredRole="library_staff">
              <LibraryDashboardEnhanced />
            </ProtectedRoute>
          } />
          <Route path="/library/dashboard/old" element={
            <ProtectedRoute requiredRole="library_staff">
              <LibraryDashboard />
            </ProtectedRoute>
          } />
          <Route path="/library/books-issued" element={
            <ProtectedRoute requiredRole="library_staff">
              <BooksIssued />
            </ProtectedRoute>
          } />
          <Route path="/library/books-returned" element={
            <ProtectedRoute requiredRole="library_staff">
              <BooksReturned />
            </ProtectedRoute>
          } />
          <Route path="/library/fine-collected" element={
            <ProtectedRoute requiredRole="library_staff">
              <FineCollected />
            </ProtectedRoute>
          } />
          <Route path="/library/add-book" element={
            <ProtectedRoute requiredRole="library_staff">
              <AddBook />
            </ProtectedRoute>
          } />
          <Route path="/library/all-books" element={
            <ProtectedRoute requiredRole="library_staff">
              <ViewAllBooks />
            </ProtectedRoute>
          } />
          <Route path="/library/reminders" element={
            <ProtectedRoute requiredRole="library_staff">
              <ReminderManagement />
            </ProtectedRoute>
          } />

          {/* Protected Staff Routes */}
          <Route path="/staff/dashboard" element={
            <ProtectedRoute requiredRole="staff">
              <CollegeStaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/staff/dashboard/old" element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/staff/books-issued" element={
            <ProtectedRoute requiredRole="staff">
              <StaffBooksIssued />
            </ProtectedRoute>
          } />
          <Route path="/staff/books-returned" element={
            <ProtectedRoute requiredRole="staff">
              <StaffBooksReturned />
            </ProtectedRoute>
          } />

          {/* Protected Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboardEnhanced />
            </ProtectedRoute>
          } />
          <Route path="/student/dashboard/old" element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/books-issued" element={
            <ProtectedRoute requiredRole="student">
              <StudentBooksIssued />
            </ProtectedRoute>
          } />
          <Route path="/student/books-returned" element={
            <ProtectedRoute requiredRole="student">
              <StudentBooksReturned />
            </ProtectedRoute>
          } />
          <Route path="/student/fine-paid" element={
            <ProtectedRoute requiredRole="student">
              <StudentFinePaid />
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
