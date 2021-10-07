import { IHistoryLink, IVisit } from "../../types/history";

const makeLinks = (totalVisits: IVisit[]): IHistoryLink[] => {
  const links: { [key: string]: IHistoryLink } = {};

  totalVisits.forEach(({ fromVisitUrl, visitUrl, transition }) => {
    if (!fromVisitUrl) {
      return;
    }

    const sourceDomain = new URL(fromVisitUrl).origin;
    const targetDomain = new URL(visitUrl).origin;

    if (sourceDomain === targetDomain) {
      return;
    }

    const sourceAndTarget = `from ${sourceDomain} to ${targetDomain}`;

    if (links[sourceAndTarget]) {
      links[sourceAndTarget].count += 1;
    } else {
      links[sourceAndTarget] = {
        source: sourceDomain,
        target: targetDomain,
        type: transition,
        count: 1,
      };
    }
  });

  return Object.values(links);
};

export default makeLinks;
