import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IBrowserHistory } from "../../types/history";
/* eslint-disable no-param-reassign */

const INITIAL_BROWSER_HISTORY_ID = "initialization";

const initialState: IBrowserHistory = {
  nanoId: INITIAL_BROWSER_HISTORY_ID,
  totalVisits: [
    {
      visitId: 0,
      visitTime: "",
      targetUrl: "http://www.naver.com",
      targetUrlVisitCount: 0,
      visitDuration: 1000,
      transitionType: "Link",
      sourceUrl: "http://www.google.com",
    },
    {
      visitId: 1,
      visitTime: "",
      targetUrl: "http://www.google.com",
      targetUrlVisitCount: 0,
      visitDuration: 1000,
      transitionType: "Link",
      sourceUrl: "http://www.naver.com",
    },
  ],
  domainNodes: [
    {
      name: "http://www.naver.com",
      index: 0,
      x: 500,
      y: 300,
      fx: 300,
      fy: 300,
      visitCount: 1,
      visitDuration: 0,
    },
    {
      name: "http://www.google.com",
      index: 1,
      x: 500,
      y: 300,
      fx: 500,
      fy: 500,
      visitCount: 1,
      visitDuration: 0,
    },
  ],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    updateBrowserHistory: (state, action: PayloadAction<IBrowserHistory>) => {
      state.nanoId = action.payload.nanoId;
      state.domainNodes = action.payload.domainNodes;
      state.totalVisits = action.payload.totalVisits;
    },
    changePosition: (state, action: PayloadAction) => {
      //
    },
  },
});

export const { updateBrowserHistory, changePosition } = historySlice.actions;

export default historySlice.reducer;
