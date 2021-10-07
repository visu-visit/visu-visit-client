import { IHistoryNode, IVisit } from "../../types/history";

const makeNodes = (totalVisits: IVisit[]): IHistoryNode[] => {
  const nodeByDomain: {
    [key: string]: IHistoryNode;
  } = {};

  totalVisits.forEach((visit) => {
    const domainName = new URL(visit.visitUrl).origin;

    if (nodeByDomain[domainName]) {
      nodeByDomain[domainName].visitCount += 1;
    } else {
      nodeByDomain[domainName] = {
        id: domainName,
        visitCount: 0,
      };
    }
  });

  return Object.values(nodeByDomain);
};

export default makeNodes;
