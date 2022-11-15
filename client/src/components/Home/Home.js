import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, updateAuth } from "../../features/auth/authSlice";
import { isAuth, removeCookie } from "../../helpers/authHelper";
import Calender from "../Calender/Calender";

const Home = () => {
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);
  const navigate = useNavigate();
  const handleLogout = () => {
    if (isAuth()) {
      removeCookie("user");
      dispatch(updateAuth(""));
      navigate("/auth/login");
    }
  };
  return (
    <div className="relative h-screen flex items-center justify-center">
      <Calender />
      <div className="absolute top-0 p-5 w-full flex items-center justify-between">
        {auth === "patient" ? (
          <div className="bg-green-400 p-2 rounded">
            <h1 className="text-white font-bold">Patient</h1>
          </div>
        ) : (
          <div className="bg-orange-400 p-2 rounded">
            <h1 className="text-white font-bold">Doctor</h1>
          </div>
        )}
        <button
          className="bg-red-400 p-2 rounded hover:opacity-80"
          onClick={() => handleLogout()}
        >
          <h1 className="text-white font-bold">LOGOUT</h1>
        </button>
      </div>
    </div>
  );
};

export default Home;
