import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import historyReducer from "../features/history/historySlice";

export const store = configureStore({
  reducer: {
    history: historyReducer,
  },
  middleware: (curryGetDefaultMiddleware) =>
    curryGetDefaultMiddleware().concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
