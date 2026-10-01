import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (token) => {
  const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
    headers: { Authorization: token },
  });
  return res.data;
});

export const fetchOrderHistory = createAsyncThunk("orders/fetchOrderHistory", async ({ token, userId }) => {
  const res = await axios.get(`http://localhost:5000/api/orders/history/${userId}`, {
    headers: { Authorization: token },
  });
  return res.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], history: [], status: "idle", error: null },
  reducers: {
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.list.find((o) => o._id === id);
      if (order) order.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = "loading"; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
