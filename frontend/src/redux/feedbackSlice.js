import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFeedback = createAsyncThunk("feedback/fetchFeedback", async () => {
  const res = await axios.get("${process.env.REACT_APP_API_URL}/api/feedback");
  return res.data;
});

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async ({ token, rating, comment }) => {
    const res = await axios.post(
      "${process.env.REACT_APP_API_URL}/api/feedback",
      { rating, comment },
      { headers: { Authorization: token } }
    );
    return res.data;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setFeedback: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { setFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
