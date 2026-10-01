import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async ({ search, category }) => {
  const res = await axios.get("http://localhost:5000/api/menu", {
    params: { search, category }
  });
  return res.data;
});

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;
