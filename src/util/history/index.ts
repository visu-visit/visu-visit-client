/* eslint-disable no-useless-escape */

import cloneDeep from "lodash/cloneDeep";
import { IDomainLink, IVisit, IDomainNode } from "../../types/history";

const MINIMUM_RADIUS = 20;

export const convertToRadius = (num: number): number => {
  let radius = MINIMUM_RADIUS;

  radius += Math.floor(num / 100) * 10;

  return radius;
};

export const removeSpecialCases = (str: string): string => {
  const reg = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim;

  return str.replace(reg, "");
};

export const makeGraphData = (
  totalVisits: IVisit[],
  domainNodes: IDomainNode[],
): { nodes: IDomainNode[]; links: IDomainLink[] } => {
  const nodes = cloneDeep(domainNodes);
  const links: { [key: string]: IDomainLink } = {};

  totalVisits.forEach(({ sourceUrl, targetUrl, transitionType }) => {
    if (!sourceUrl) {
      return;
    }

    const sourceDomain = new URL(sourceUrl).origin;
    const targetDomain = new URL(targetUrl).origin;

    if (sourceDomain === targetDomain) {
      return;
    }

    const sourceAndTarget = `from ${sourceDomain} to ${targetDomain}`;

    if (links[sourceAndTarget]) {
      links[sourceAndTarget].count += 1;
    } else {
      links[sourceAndTarget] = {
        source: nodes.find(({ name }) => name === sourceDomain) as IDomainNode,
        target: nodes.find(({ name }) => name === targetDomain) as IDomainNode,
        type: transitionType,
        count: 1,
      };
    }
  });

  return { nodes, links: Object.values(links) };
};
