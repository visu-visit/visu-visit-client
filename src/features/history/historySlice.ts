/* eslint-disable no-param-reassign */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IBrowserHistory } from "../../types/history";
import { RootState } from "../../app/store";

const initialState: IBrowserHistory = {
  nanoId: "",
  totalVisits: [
    {
      visitId: -1,
      visitTime: "",
      visitUrl: "http://www.naver.com",
      urlVisitCount: 0,
      visitTitle: "",
      visitDuration: "",
      lastVisitTime: "",
      transition: "Link",
      fromVisitId: 0,
      fromVisitTime: "",
      fromVisitUrl: "",
      fromVisitTitle: "",
    },
  ],
  domainNodes: [
    {
      domainName: "",
      nanoId: "",
      position: {
        x: 0,
        y: 0,
      },
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

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectHistory = (state: RootState) => state.history;

export default historySlice.reducer;
