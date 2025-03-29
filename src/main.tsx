import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";

// Pages
import App from "./App.tsx";
import SignUp from "./page/SignUp/SignUp.tsx";
import Dashboard from "./page/dashboard/Dashboard.tsx";
import DashboardLayout from "./page/dashboard/DashboardLayout.tsx";
import PhoneBook from "./page/dashboard/PhoneBook.tsx";
import ForgotPassword from "./page/forgotPassword/ForgotPassword.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard">
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="phone-book" element={<PhoneBook />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
