import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IDomainNode } from "../../types/history.d";
/* eslint-disable no-param-reassign */

import { IBrowserHistory } from "../../types/history";

export const INITIAL_BROWSER_HISTORY_ID = "initialization";

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
      x: 0,
      y: 0,
      fx: -100,
      fy: -100,
      memo: "memo",
      color: "skyblue",
      visitCount: 1,
      visitDuration: 0,
      lastVisitTime: null,
    },
    {
      name: "http://www.google.com",
      x: 500,
      y: 300,
      fx: -100,
      fy: -100,
      memo: "",
      color: "lightcoral",
      visitCount: 1,
      visitDuration: 0,
      lastVisitTime: null,
    },
  ],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    updateBrowserHistory: (
      state,
      { payload: { nanoId, domainNodes, totalVisits } }: PayloadAction<IBrowserHistory>,
    ) => {
      state.nanoId = nanoId;
      state.domainNodes = domainNodes;
      state.totalVisits = totalVisits;
    },
    changeNode: (state, action: PayloadAction<IDomainNode>) => {
      const targetIndex = state.domainNodes.findIndex((node) => node.name === action.payload.name);

      state.domainNodes[targetIndex] = { ...action.payload };
    },
    changeNodeColor: (state, action: PayloadAction<{ domainName: string; color: string }>) => {
      const targetIndex = state.domainNodes.findIndex(
        (node) => node.name === action.payload.domainName,
      );

      state.domainNodes[targetIndex].color = action.payload.color;
    },
    changeNodeMemo: (state, action: PayloadAction<{ domainName: string; memo: string }>) => {
      const { domainName, memo } = action.payload;
      const targetIndex = state.domainNodes.findIndex((node) => node.name === domainName);

      state.domainNodes[targetIndex].memo = memo;
    },
    deleteNode: (state, action: PayloadAction<{ domainName: string }>) => {
      const { domainName } = action.payload;
      const targetIndex = state.domainNodes.findIndex((node) => node.name === domainName);

      state.totalVisits = state.totalVisits.filter(({ sourceUrl, targetUrl }) => {
        if (targetUrl.includes(domainName)) {
          return false;
        }

        if (sourceUrl && sourceUrl.includes(domainName)) {
          return false;
        }

        return true;
      });

      state.domainNodes.splice(targetIndex, 1);
    },
  },
});

export const { updateBrowserHistory, changeNode, changeNodeMemo, changeNodeColor, deleteNode } =
  historySlice.actions;

export default historySlice.reducer;
