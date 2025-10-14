import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/UseAuth/useAuth";
import Loader from "../sharedItems/Loader/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const adminEmail = "admin@careercrafter.com";

  const [redirect, setRedirect] = useState(false);

  const isAuthorized = user?.email === adminEmail;

  // Always call useEffect
  useEffect(() => {
    if (!loading && !isAuthorized) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You're not an admin!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        setRedirect(true);
      });
    }
  }, [loading, isAuthorized]);

  if (loading) return <Loader />;
  if (!isAuthorized && redirect) return <Navigate to="/auth/signin" replace />;

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
