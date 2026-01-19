import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import AdminLogin from "./pages/admin/AdminLogin";
import LibraryLogin from "./pages/library/LibraryLogin";
import StaffLogin from "./pages/staff/StaffLogin";
import StudentLogin from "./pages/student/StudentLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/library/login" element={<LibraryLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
