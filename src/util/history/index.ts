/* eslint-disable no-useless-escape */

import { select } from "d3-selection";
import cloneDeep from "lodash/cloneDeep";
import { DEFAULT_STROKE_WIDTH, FORCE_STRENGTH, MINIMUM_RADIUS } from "../../constants/history";

import { IDomainLink, IVisit, IDomainNode } from "../../types/history";

export const convertToRadius = (num: number): number => {
  let radius = MINIMUM_RADIUS;

  radius += Math.floor(num / 100) * 10;
  radius = Math.min(radius, 50);

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
    const sourceNode = nodes.find(({ name }) => name === sourceDomain);
    const targetNode = nodes.find(({ name }) => name === targetDomain);

    if (!sourceNode || !targetNode) {
      return;
    }

    if (links[sourceAndTarget]) {
      links[sourceAndTarget].count += 1;
    } else {
      links[sourceAndTarget] = {
        source: sourceNode,
        target: targetNode,
        type: transitionType,
        count: 1,
      };
    }
  });

  return { nodes, links: Object.values(links) };
};

// TODO: 방문횟수가 많을 수록 짧아지도록, 또는 link의 target과 source의 lastVisitTime 비교하여 간격이 짧을 수록 거리를 가깝게
export const handleLinkDistance = (link: IDomainLink) => 200;
// TODO: domain의 visitCount와 visitDuration에 따라 커지도록
export const handleNodeStrength = (node: IDomainNode) => FORCE_STRENGTH;

export const handleLinkStroke = (link: IDomainLink) => DEFAULT_STROKE_WIDTH;

// TODO radius 계산, 비율적으로 노드 크기가 제각각이도록 더 정밀하도록 바꿀 것
export const handleNodeRadius = (domainNode: IDomainNode) =>
  convertToRadius(domainNode.visitDuration / 60);

export const handleMouseOut = (event: MouseEvent, domainNode: IDomainNode) => {
  if (!domainNode) {
    return;
  }

  select(`#${removeSpecialCases(domainNode.name)} text`).remove();
};

export const handleMouseOver = (event: MouseEvent, domainNode: IDomainNode) => {
  if (!domainNode) {
    return;
  }

  select(`#${removeSpecialCases(domainNode.name)}`)
    .append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .text(domainNode.name)
    .attr("fill", "black")
    .attr("font-size", "10px")
    .attr("transform", "translate(10 0)");
};

export const getArrowPosition = (link: IDomainLink, radius: number) => {
  if (
    link.target.x === undefined ||
    link.target.y === undefined ||
    link.source.x === undefined ||
    link.source.y === undefined
  ) {
    return "M0, -5L10, 0L0, 5";
  }

  const dx = link.target.x - link.source.x;
  const dy = link.target.y - link.source.y;
  const dr = Math.sqrt(dx * dx + dy * dy);

  const offsetX = (dx * radius) / dr || 0;
  const offsetY = (dy * radius) / dr || 0;

  const placeX = link.target.x - offsetX;
  const placeY = link.target.y - offsetY;

  const px = link.source.x;
  const py = link.source.y;

  return `M${px},${py}A${dr},${dr} 0 0,1 ${placeX},${placeY}`;
};
