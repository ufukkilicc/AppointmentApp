import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAppointments } from "../../features/appointments/appointmentsSlice";
import { getAuth } from "../../features/auth/authSlice";
import {
  decreaseYear,
  getDate,
  getMonth,
  getWeekDate,
  getYear,
  increaseYear,
  updateDate,
  updateMonth,
  updateWeekDate,
} from "../../features/calendar/calendarSlice";
import { socket } from "../../helpers/socketio";

const Calender = () => {
  const dispatch = useDispatch();
  const [view, setView] = useState("day");
  const [currentDateReservationHours, setCurrentDateReservationHours] =
    useState([]);
  const [currentDateReservations, setCurrentDateReservations] = useState([]);
  const months = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };
  const months_string = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days_string = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleMonthChange = (month) => {
    dispatch(updateMonth(month));
    setView("day");
  };
  const handleYearChange = (direction) => {
    if (direction === "decrease") {
      dispatch(decreaseYear());
    } else {
      dispatch(increaseYear());
    }
  };
  const handleDateChange = (date) => {
    dispatch(updateDate(date));
  };
  const calculateWeekDate = () => {
    const two_digits = Number(
      year.toString().substr(year.toString().length - 2)
    );
    const one_quarter_of_digits = Math.ceil(two_digits / 4);
    const key_number_for_month = months_string.indexOf(month);
    const given_day_of_month = 1;
    let sum =
      two_digits +
      one_quarter_of_digits +
      key_number_for_month +
      given_day_of_month;
    sum -= 1;
    const result = sum % 7;

    if (result === 0) {
      dispatch(updateWeekDate(days_string[6]));
    } else {
      dispatch(updateWeekDate(days_string[result - 1]));
    }
  };
  const month = useSelector(getMonth);
  const year = useSelector(getYear);
  const date = useSelector(getDate);
  const weekDate = useSelector(getWeekDate);
  const auth = useSelector(getAuth);
  const appointments = useSelector(getAppointments);

  const getYearFromUTC = (date) => {
    const result = new Date(date).getUTCFullYear();
    return result;
  };

  const getDateFromUTC = (date) => {
    const result = new Date(date).getUTCDate();
    return result;
  };

  const getMonthFromUTC = (date) => {
    const result = new Date(date).getUTCMonth();
    return result;
  };

  const getHoursFromUTC = (date) => {
    const result = new Date(date).getUTCHours();
    return result;
  };

  useEffect(() => {
    setCurrentDateReservationHours([]);
    setCurrentDateReservations([]);
    let Array = [];
    let ArraySecond = [];
    const array = appointments.filter((appointment) => {
      return (
        getYearFromUTC(appointment.date) === year &&
        getMonthFromUTC(appointment.date) === months_string.indexOf(month)
      );
    });
    const newArray = array.filter(
      (appointment) => getDateFromUTC(appointment.date) === date - 2
    );
    if (newArray.length !== 0) {
      newArray.map((appointment) => {
        Array.push(getHoursFromUTC(appointment.date));
        ArraySecond.push(appointment);
      });
    }
    setCurrentDateReservationHours(Array);
    setCurrentDateReservations(ArraySecond);
  }, [appointments, month, year, date]);
  useEffect(() => {
    calculateWeekDate();
  }, [month, year, date]);
  const createAppointment = (hour) => {
    socket.emit("input", {
      date: date,
      month: month,
      year: year,
      hour: hour,
    });
  };
  const makeAppointment = (hour) => {
    socket.emit("reserve", {
      date: date,
      month: month,
      year: year,
      hour: hour,
    });
  };
  const checkReserved = (hour) => {
    const array = currentDateReservations.filter(
      (appointment) => getHoursFromUTC(appointment.date) === hour
    );
    if (array.length !== 0 && array[0].reserved) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className="bg-white rounded p-5">
      {view === "day" ? (
        <div className=" gap-4 flex flex-col justify-start items-center">
          <div className="flex justify-between items-center w-full">
            <h1
              className="text-gray-500 font-bold text-2xl hover:cursor-pointer"
              onClick={() => setView("month")}
            >
              {month}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <IoIosArrowBack
                className="text-gray-500 text-xl hover:cursor-pointer"
                onClick={() => handleYearChange("decrease")}
              />
              <h1 className="text-gray-500 font-bold text-2xl">{year}</h1>
              <IoIosArrowForward
                className="text-gray-500 text-xl hover:cursor-pointer"
                onClick={() => handleYearChange("increase")}
              />
            </div>
          </div>
          <div className="flex flex-col justify-start items-center gap-2">
            <div className="grid grid-cols-7 gap-4">
              <h1 className="text-xl text-gray-900 font-bold">Mon</h1>
              <h1 className="text-xl text-gray-900 font-bold">Tue</h1>
              <h1 className="text-xl text-gray-900 font-bold">Wed</h1>
              <h1 className="text-xl text-gray-900 font-bold">Thu</h1>
              <h1 className="text-xl text-gray-900 font-bold">Fri</h1>
              <h1 className="text-xl text-gray-900 font-bold">Sat</h1>
              <h1 className="text-xl text-gray-900 font-bold">Sun</h1>
            </div>
            <div className="grid grid-cols-7 gap-4 w-full grid-center place-items-center">
              {(() => {
                let td = [];
                for (
                  let i = 1;
                  i <= months[month] + days_string.indexOf(weekDate);
                  i++
                ) {
                  if (i > days_string.indexOf(weekDate)) {
                    td.push(
                      <h2
                        key={i}
                        onClick={() => handleDateChange(i)}
                        className={`hover:bg-gray-200 ${
                          date === i ? "bg-gray-200" : "bg-white"
                        } p-2 rounded-full text-gray-600 font-light hover:cursor-pointer`}
                      >
                        {i - days_string.indexOf(weekDate)}
                      </h2>
                    );
                  } else {
                    td.push(
                      <h2
                        key={i}
                        className="bg-white p-2 rounded-full text-white"
                      >
                        {i}
                      </h2>
                    );
                  }
                }
                return td;
              })()}
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            {auth === "patient" ? (
              <div className="bg-green-400 flex items-center justify-center gap-2 px-4 py-2 rounded hover:cursor-pointer">
                <h1
                  className="font-bold text-white"
                  onClick={() => setView("booking")}
                >
                  Continue booking
                </h1>
                <IoIosArrowForward color="white" fontSize={20} />
              </div>
            ) : (
              <div className="bg-orange-400 flex items-center justify-center gap-2 px-4 py-2 rounded hover:cursor-pointer">
                <h1
                  className="font-bold text-white"
                  onClick={() => setView("booking")}
                >
                  Create Appointment
                </h1>
                <IoIosArrowForward color="white" fontSize={20} />
              </div>
            )}
          </div>
        </div>
      ) : view === "month" ? (
        <div className="grid grid-cols-4 w-[500px] h-[400px] place-items-center">
          {Object.keys(months).map((key, index) => {
            return (
              <h1
                className={`text-xl text-gray-900 font-bold w-full ${
                  month === key ? "bg-gray-200" : "bg-white"
                } hover:bg-gray-200 hover:cursor-pointer h-full flex items-center justify-center`}
                key={index}
                onClick={() => handleMonthChange(key)}
              >
                {key}
              </h1>
            );
          })}
        </div>
      ) : (
        <div className="relative flex flex-col justify-start items-center gap-7">
          <div className="w-full flex justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-600">{`${date - 2}/${
              months_string.indexOf(month) + 1
            }/${year}`}</h1>
          </div>
          {auth === "patient" ? (
            <div className="grid grid-cols-3 w-[450px] h-[200px] place-items-center gap-5">
              <h1
                onClick={() => makeAppointment(9)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(9)
                    ? checkReserved(9)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                9AM - 10AM
              </h1>
              <h1
                onClick={() => makeAppointment(10)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(10)
                    ? checkReserved(10)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                10AM - 11AM
              </h1>
              <h1
                onClick={() => makeAppointment(11)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(11)
                    ? checkReserved(11)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                11AM - 12PM
              </h1>
              <h1
                onClick={() => makeAppointment(12)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(12)
                    ? checkReserved(12)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                12PM - 1PM
              </h1>
              <h1
                onClick={() => makeAppointment(1)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(1)
                    ? checkReserved(1)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                1PM - 2PM
              </h1>
              <h1
                onClick={() => makeAppointment(2)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(2)
                    ? checkReserved(2)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                2PM - 3PM
              </h1>
              <h1
                onClick={() => makeAppointment(3)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(3)
                    ? checkReserved(3)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                3PM - 4PM
              </h1>
              <h1
                onClick={() => makeAppointment(4)}
                className={`w-full h-full ${
                  currentDateReservationHours.includes(4)
                    ? checkReserved(4)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
              >
                4PM - 5PM
              </h1>
            </div>
          ) : (
            <div className="grid grid-cols-3 w-[450px] h-[200px] place-items-center gap-5">
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(9)
                    ? checkReserved(9)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(9)}
              >
                9AM - 10AM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(10)
                    ? checkReserved(10)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(10)}
              >
                10AM - 11AM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(11)
                    ? checkReserved(11)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(11)}
              >
                11AM - 12PM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(12)
                    ? checkReserved(12)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(12)}
              >
                12PM - 1PM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(1)
                    ? checkReserved(1)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(1)}
              >
                1PM - 2PM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(2)
                    ? checkReserved(2)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(2)}
              >
                2PM - 3PM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(3)
                    ? checkReserved(3)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(3)}
              >
                3PM - 4PM
              </h1>
              <h1
                className={`w-full h-full ${
                  currentDateReservationHours.includes(4)
                    ? checkReserved(4)
                      ? "bg-red-300"
                      : "bg-green-300"
                    : "bg-gray-300"
                } flex items-center justify-center rounded hover:cursor-pointer hover:opacity-80 font-bold`}
                onClick={() => createAppointment(4)}
              >
                4PM - 5PM
              </h1>
            </div>
          )}
          <div className="w-full flex items-center justify-center gap-6">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 bg-gray-300"></div>
              <h1 className="text-sm">EMPTY</h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 bg-red-300"></div>
              <h1 className="text-sm">UNAVAILABLE</h1>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 bg-green-300"></div>
              <h1 className="text-sm">AVAILABLE</h1>
            </div>
          </div>
          <div
            className="bg-red-400 flex items-center justify-center gap-2 px-4 py-2 rounded hover:cursor-pointer absolute top-0 left-0"
            onClick={() => setView("day")}
          >
            <IoIosArrowBack color="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
