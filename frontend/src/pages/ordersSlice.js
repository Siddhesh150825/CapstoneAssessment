import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

// Fetch orders (customer)
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
});

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status });
    return res.data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Update the order in local state
        const updatedOrder = action.payload;
        const index = state.list.findIndex((o) => o._id === updatedOrder._id);
        if (index !== -1) {
          state.list[index] = updatedOrder;
        }
      });
  },
});

export default ordersSlice.reducer;
