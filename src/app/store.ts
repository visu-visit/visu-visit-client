import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "../features/history/historySlice";

export const store = configureStore({
  reducer: {
    history: historyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
