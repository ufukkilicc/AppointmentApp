import React from "react";
import { getCookie, isAuth, setCookie } from "./authHelper";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuth } from "../features/auth/authSlice";

const ProtectedRoute = ({ redirect_url, children }) => {
  const dispatch = useDispatch();
  const auth = getCookie("user");
  dispatch(updateAuth(auth));
  if (!isAuth()) {
    return <Navigate to={redirect_url} />;
  }
  return children;
};

export default ProtectedRoute;
