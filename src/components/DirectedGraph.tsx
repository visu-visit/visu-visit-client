import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  forceManyBody,
  forceLink,
  forceSimulation,
  SimulationNodeDatum,
  forceX,
  forceY,
} from "d3-force";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { select } from "d3-selection";
import { RootState } from "../app/store";
import { IDomainNode, IVisit } from "../types/history";
import makeLinks from "../util/history/makeLinks";
import makeNodes from "../util/history/makeNodes";
import { URL_TRANSITION_TYPES } from "../constants/history";

const Wrapper = styled.div`
  margin: 20px;

  .node {
    cursor: move;
    fill: #ffffff;
    stroke: #000;
    stroke-width: 1.5px;
  }
`;

const BoardSvg = styled.svg`
  width: 100%;
  height: 650px;
  background-color: lightgray;
  border-radius: 10px;
`;

const color = scaleOrdinal(URL_TRANSITION_TYPES, schemeCategory10);

export default function DirectedGraph() {
  const totalVisits = useSelector<RootState, IVisit[]>(
    ({ history }) => history.totalVisits,
  );
  const domainNodes = useSelector<RootState, IDomainNode[]>(
    ({ history }) => history.domainNodes,
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const historyDirectedGraph = {
    nodes: makeNodes(totalVisits),
    links: makeLinks(totalVisits),
  };

  useEffect(() => {
    const svg = select(svgRef.current);

    const links = historyDirectedGraph.links.map((d) => ({ ...d }));
    const nodes = historyDirectedGraph.nodes.map((d) => ({ ...d }));

    const simulation = forceSimulation(nodes as SimulationNodeDatum[])
      .force(
        "link",
        forceLink(links).id((d: any) => d.id),
      )
      .force("charge", forceManyBody().strength(-300))
      .force("x", forceX(600))
      .force("y", forceY(400));

    svg
      .append("svg:defs")
      .selectAll("marker")
      .data(URL_TRANSITION_TYPES)
      .join("marker")
      .append("svg:marker")
      .attr("id", (d: any) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", -1.5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

    const link = svg
      .append("svg:g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", (datum: any) => color(datum.type))
      .attr("marker-end", (datum: any) => `url(#arrow-${datum.type})`);

    const node = svg
      .append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g");

    node
      .append("circle")
      .attr("fill", "white")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", (datum: any) => {
        let radius = datum.visitCount;

        if (radius === 0) {
          radius = 10;
        }

        if (radius > 50) {
          radius = 50;
        }

        return radius;
      });

    node
      .append("text")
      .attr("x", 8)
      .attr("y", "0.31em")
      .text((datum) => datum.id.split("//")[1])
      .lower()
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("font-size", "10px")
      .attr("transform", "translate(10 0)");

    node
      .append("image")
      .attr(
        "xlink:href",
        (datum) =>
          `https://www.google.com/s2/favicons?sz=32&domain=${datum.id}`,
      )
      .on("error", (event, datum) => {
        console.log("favicon image loading error", event, datum);
      })
      .attr("width", 20)
      .attr("height", 20)
      .attr("transform", "translate(-10 -10)");

    simulation.on("tick", () => {
      link.attr("d", (datum: any) => {
        const radius = datum.target.visitCount;

        const dx = datum.target.x - datum.source.x;
        const dy = datum.target.y - datum.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);

        const offsetX = (dx * radius) / dr;
        const offsetY = (dy * radius) / dr;

        const placeX = datum.target.x - offsetX;
        const placeY = datum.target.y - offsetY;

        const px = Math.max(1, Math.min(1400, datum.source.x));
        const py = Math.max(1, Math.min(800, datum.source.y));

        return `M${px},${py}A${dr},${dr} 0 0,1 ${+placeX},${placeY}`;
      });

      node.attr(
        "transform",
        (datum: any) => `translate(${datum.x},${datum.y})`,
      );
    });
  }, [historyDirectedGraph]);

  return (
    <Wrapper>
      <BoardSvg ref={svgRef} />
      <div>
        totalVisits:
        {totalVisits.length}
      </div>
      <div>
        domainNodes:
        {domainNodes.length}
      </div>
    </Wrapper>
  );
}
