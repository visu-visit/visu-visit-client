import { IDomainNode } from "../types/history.d";
/* eslint-disable no-undef */

import {
  initialState,
  updateBrowserHistory,
  changeNodePosition,
  resetNodePosition,
  changeNodeMemo,
  changeNodeColor,
  deleteNode,
} from "../features/history/historySlice";
import { store } from "../app/store";
import mockBrowserHistory from "./mock/mockBrowserHistory";

describe("TEST feature/historySlice.ts", () => {
  it("test historyReducer's initial state", () => {
    expect(store.getState().history).toEqual(initialState);
  });

  it("test action: updateBrowserHistory,", () => {
    store.dispatch(updateBrowserHistory(mockBrowserHistory));

    expect(store.getState().history).toEqual(mockBrowserHistory);

    store.dispatch(updateBrowserHistory(initialState));
  });

  it("test action: changeNodePosition,", () => {
    const positionChangedNode: IDomainNode = {
      name: "http://www.google.com",
      x: 500,
      y: 300,
      fx: 1000,
      fy: 1000,
      memo: "",
      color: "lightcoral",
      visitCount: 1,
      visitDuration: 0,
      lastVisitTime: null,
    };

    store.dispatch(changeNodePosition(positionChangedNode));

    const targetNode = store
      .getState()
      .history.domainNodes.find(({ name }) => name === positionChangedNode.name);

    expect(targetNode).toEqual(positionChangedNode);
  });

  it("test action: resetNodePosition,", () => {
    const nodeWillBeReset: IDomainNode = {
      name: "http://www.google.com",
      x: 500,
      y: 300,
      fx: 1000,
      fy: 1000,
      memo: "",
      color: "lightcoral",
      visitCount: 1,
      visitDuration: 0,
      lastVisitTime: null,
    };

    store.dispatch(resetNodePosition(nodeWillBeReset));

    const targetNode = store
      .getState()
      .history.domainNodes.find(({ name }) => name === nodeWillBeReset.name);

    const resetNode: IDomainNode = { ...nodeWillBeReset };

    delete resetNode.fx;
    delete resetNode.fy;

    expect(targetNode).toEqual(resetNode);
  });

  it("test action: changeNodeMemo,", () => {
    const actionPayload = {
      domainName: "http://www.google.com",
      memo: "sample memo",
    };

    store.dispatch(changeNodeMemo(actionPayload));

    const targetNode = store
      .getState()
      .history.domainNodes.find(({ name }) => name === actionPayload.domainName);

    expect(targetNode.name).toEqual(actionPayload.domainName);
    expect(targetNode.memo).toEqual(actionPayload.memo);
  });

  it("test action: changeNodeColor,", () => {
    const actionPayload = {
      domainName: "http://www.google.com",
      color: "lightgray",
    };

    store.dispatch(changeNodeColor(actionPayload));

    const targetNode = store
      .getState()
      .history.domainNodes.find(({ name }) => name === actionPayload.domainName);

    expect(targetNode.name).toEqual(actionPayload.domainName);
    expect(targetNode.color).toEqual(actionPayload.color);
  });

  it("test action: deleteNode,", () => {
    const actionPayload = {
      domainName: "http://www.google.com",
    };

    store.dispatch(deleteNode(actionPayload));

    const targetNodeIndex = store
      .getState()
      .history.domainNodes.findIndex(({ name }) => name === actionPayload.domainName);

    expect(targetNodeIndex).toEqual(-1);
  });
});
