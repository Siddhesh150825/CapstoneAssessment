import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import menuReducer from "./menuSlice";
import ordersReducer from "./ordersSlice";
import reservationsReducer from "./reservationsSlice";
import feedbackReducer from "./feedbackSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    orders: ordersReducer,
    reservations: reservationsReducer,
    feedback: feedbackReducer
  }
});
