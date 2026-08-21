import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAppointments = createAsyncThunk("appointments/fetch", async () => {
  const { data } = await api.get("/appointments");
  return data.appointments;
});

export const bookAppointment = createAsyncThunk("appointments/book", async (body) => {
  const { data } = await api.post("/appointments", body);
  return data.appointment;
});

export const cancelAppointment = createAsyncThunk("appointments/cancel", async (id) => {
  await api.delete(`/appointments/${id}`);
  return id;
});

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => { state.loading = true; })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a._id !== action.payload);
      });
  }
});

export default appointmentsSlice.reducer;
