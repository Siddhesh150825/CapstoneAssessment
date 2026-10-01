import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (token) => {
  const res = await axios.get("http://localhost:5000/api/admin/users", {
    headers: { Authorization: token }
  });
  return res.data;
});

export const fetchAllOrders = createAsyncThunk("admin/fetchAllOrders", async (token) => {
  const res = await axios.get("http://localhost:5000/api/admin/orders", {
    headers: { Authorization: token }
  });
  return res.data;
});

export const fetchAllReservations = createAsyncThunk("admin/fetchAllReservations", async (token) => {
  const res = await axios.get("http://localhost:5000/api/admin/reservations", {
    headers: { Authorization: token }
  });
  return res.data;
});

export const fetchAllFeedback = createAsyncThunk("admin/fetchAllFeedback", async (token) => {
  const res = await axios.get("http://localhost:5000/api/admin/feedback", {
    headers: { Authorization: token }
  });
  return res.data;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    orders: [],
    reservations: [],
    feedback: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchAllReservations.fulfilled, (state, action) => {
        state.reservations = action.payload;
      })
      .addCase(fetchAllFeedback.fulfilled, (state, action) => {
        state.feedback = action.payload;
      });
  },
});

export default adminSlice.reducer;
