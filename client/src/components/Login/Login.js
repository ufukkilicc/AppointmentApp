import React, { useEffect } from "react";
import { isAuth, setCookie } from "../../helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuth } from "../../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = (auth) => {
    setCookie("user", auth);
    dispatch(updateAuth(auth));
    navigate("/");
  };
  useEffect(() => {
    if (isAuth()) {
      navigate("/");
    }
  }, []);
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white flex flex-col gap-5 justify-center items-center rounded p-5 shadow-2xl">
        <div className="flex flex-row justify-center items-center gap-5">
          <button
            className="bg-orange-400 p-2 rounded"
            onClick={() => handleLogin("doctor")}
          >
            <h1 className="text-white font-bold">Doctor</h1>
          </button>
          <h1 className="text-gray-500 font-bold text-xl">OR</h1>
          <button
            className="bg-green-400 p-2 rounded"
            onClick={() => handleLogin("patient")}
          >
            <h1 className="text-white font-bold">Patient</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
