import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Assuming you store the role in localStorage

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
