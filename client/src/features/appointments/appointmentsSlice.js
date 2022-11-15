import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointments: [],
};

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointments: (state, { payload }) => {
      state.appointments = payload;
    },
    includeAppointment: (state, { payload }) => {
      state.appointments.push(payload);
    },
    updateAppointment: (state, { payload }) => {
      let addedItem = state.appointments.find(
        (appointment) => appointment._id === payload._id
      );
      if (addedItem) {
        let newState = state.appointments.map((appointment) => {
          if (appointment._id === payload._id) {
            return Object.assign({}, addedItem, payload);
          }
          return appointment;
        });
        state.appointments = newState;
      }
    },
  },
});

export const { addAppointments, includeAppointment, updateAppointment } =
  appointmentsSlice.actions;

export const getAppointments = (state) => state.appointments.appointments;

export default appointmentsSlice.reducer;
