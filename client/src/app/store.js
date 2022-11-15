import { configureStore } from "@reduxjs/toolkit";
import appointmentsSlice from "../features/appointments/appointmentsSlice";
import authSlice from "../features/auth/authSlice";
import calendarSlice from "../features/calendar/calendarSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    calendar: calendarSlice,
    appointments: appointmentsSlice,
  },
});
