/* eslint-disable no-param-reassign */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IDomainNode } from "../../types/history.d";
import { IBrowserHistory } from "../../types/history";

export const INITIAL_BROWSER_HISTORY_ID = "initialization";

export const initialState: IBrowserHistory = {
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
      sourceUrlVisitCount: 1,
    },
    {
      visitId: 1,
      visitTime: "",
      targetUrl: "http://www.google.com",
      targetUrlVisitCount: 0,
      visitDuration: 1000,
      transitionType: "Link",
      sourceUrl: "http://www.naver.com",
      sourceUrlVisitCount: 1,
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

    changeNodePosition: (state, action: PayloadAction<IDomainNode>) => {
      const targetIndex = state.domainNodes.findIndex((node) => node.name === action.payload.name);

      if (targetIndex !== -1) {
        state.domainNodes[targetIndex] = { ...action.payload };
      }
    },

    resetNodePosition: (state, action: PayloadAction<IDomainNode>) => {
      const targetIndex = state.domainNodes.findIndex((node) => node.name === action.payload.name);
      const targetNode = action.payload;

      delete targetNode.fx;
      delete targetNode.fy;

      if (targetIndex !== -1) {
        state.domainNodes[targetIndex] = { ...targetNode };
      }
    },

    changeNodeColor: (state, action: PayloadAction<{ domainName: string; color: string }>) => {
      const targetIndex = state.domainNodes.findIndex(
        (node) => node.name === action.payload.domainName,
      );

      if (targetIndex !== -1) {
        state.domainNodes[targetIndex].color = action.payload.color;
      }
    },

    changeNodeMemo: (state, action: PayloadAction<{ domainName: string; memo: string }>) => {
      const { domainName, memo } = action.payload;
      const targetIndex = state.domainNodes.findIndex((node) => node.name === domainName);

      if (targetIndex !== -1) {
        state.domainNodes[targetIndex].memo = memo;
      }
    },

    deleteNode: (state, action: PayloadAction<{ domainName: string }>) => {
      const { domainName } = action.payload;
      const targetIndex = state.domainNodes.findIndex((node) => node.name === domainName);

      if (targetIndex === -1) {
        return;
      }

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

export const {
  updateBrowserHistory,
  changeNodePosition,
  resetNodePosition,
  changeNodeMemo,
  changeNodeColor,
  deleteNode,
} = historySlice.actions;

export default historySlice.reducer;
