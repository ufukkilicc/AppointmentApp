import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import ProtectedRoute from "./helpers/protectedRoute";
import { socket } from "./helpers/socketio";
import alertify from "alertifyjs";
import { useDispatch, useSelector } from "react-redux";
import {
  addAppointments,
  getAppointments,
  includeAppointment,
  updateAppointment,
} from "./features/appointments/appointmentsSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket !== undefined) {
      // console.log("Connected");
      socket.on("appointments", (data) => {
        dispatch(addAppointments(data));
      });
      socket.on("reserved_appointment", (data) => {
        dispatch(updateAppointment(data));
      });
      socket.on("created_appointment", (data) => {
        dispatch(includeAppointment(data));
      });
      socket.on("output", (data) => {
        dispatch(includeAppointment(data));
      });
      socket.on("update", (data) => {
        dispatch(updateAppointment(data));
      });
      socket.on("status", (data) => {
        if (data.message === "No Appointment Here.") {
          alertify.error(data.message);
        } else if (data.message === "This Appointment Unavailable") {
          alertify.error(data.message);
        } else if (data.message === "Appointment Already Exists.") {
          alertify.error(data.message);
        } else {
          alertify.success(data.message);
        }
      });
    }
  }, []);
  const appointments = useSelector(getAppointments);
  return (
    <div className="h-screen bg-blue-500 font-mono">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute redirect_url={"/auth/login"}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="auth/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      {/* <button onClick={() => handleClick()}>Tıkla</button> */}
    </div>
  );
}

export default App;
