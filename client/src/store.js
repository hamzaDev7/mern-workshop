import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import appointmentsReducer from "./features/appointments/appointmentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
  },
});
