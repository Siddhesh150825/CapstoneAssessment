import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchReservations = createAsyncThunk("reservations/fetchReservations", async (token) => {
  const res = await axios.get("http://localhost:5000/api/reservations/my-reservations", {
    headers: { Authorization: token }
  });
  return res.data;
});

export const createReservation = createAsyncThunk(
  "reservations/createReservation",
  async ({ token, date, time, guests }) => {
    const res = await axios.post(
      "http://localhost:5000/api/reservations",
      { date, time, guests },
      { headers: { Authorization: token } }
    );
    return res.data;
  }
);

const reservationsSlice = createSlice({
  name: "reservations",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createReservation.fulfilled, (state, action) => {

        state.list.push(action.payload);
      });
  },
});

export default reservationsSlice.reducer;
