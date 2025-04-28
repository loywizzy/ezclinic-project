import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Employees from './pages/Employees.jsx';
import Positions from './pages/Positions.jsx';
import Permissions from './pages/Permissions.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <--- import ตัวใหม่ที่สร้าง

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* หน้า Login */}
        <Route path="/" element={<Login />} />

        {/* Layout หลักที่มี Sidebar */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="positions" element={<Positions />} />
          <Route path="permissions" element={<Permissions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
