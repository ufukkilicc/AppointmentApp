import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  year: new Date().getFullYear(),
  month: months_string[new Date().getMonth()],
  date: new Date().getDate() + 2,
  weekDate: "",
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    increaseYear: (state) => {
      state.year += 1;
    },
    decreaseYear: (state) => {
      state.year -= 1;
    },
    updateMonth: (state, { payload }) => {
      state.month = payload;
    },
    updateDate: (state, { payload }) => {
      state.date = payload;
    },
    updateWeekDate: (state, { payload }) => {
      state.weekDate = payload;
    },
  },
});

export const {
  increaseYear,
  updateWeekDate,
  decreaseYear,
  updateMonth,
  updateDate,
} = calendarSlice.actions;

export const getYear = (state) => state.calendar.year;
export const getMonth = (state) => state.calendar.month;
export const getDate = (state) => state.calendar.date;
export const getWeekDate = (state) => state.calendar.weekDate;

export default calendarSlice.reducer;
