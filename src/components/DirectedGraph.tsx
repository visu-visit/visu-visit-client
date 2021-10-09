/* eslint-disable no-param-reassign */

import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  forceManyBody,
  forceLink,
  forceSimulation,
  forceX,
  forceY,
  forceCenter,
} from "d3-force";
import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import { drag } from "d3-drag";

import { RootState } from "../app/store";
import { IDomainLink, IDomainNode, IVisit } from "../types/history";
import { URL_TRANSITION_TYPES } from "../constants/history";
import Modal from "./shared/Modal";
import NodeDetail from "./NodeDetail";
import {
  convertToRadius,
  makeGraphData,
  removeSpecialCases,
} from "../util/history";

const Wrapper = styled.div`
  margin: 20px;

  .node {
    cursor: move;
    fill: #ffffff;
    stroke: #000;
    stroke-width: 1.5px;
  }
`;

const Board = styled.svg`
  width: 100%;
  height: 80vh;
  background-color: #eee;
  border-radius: 10px;
`;

const color = scaleOrdinal(URL_TRANSITION_TYPES, schemeCategory10);
const FORCE_STRENGTH = -800;
const DEFAULT_IMAGE_SIZE = {
  width: 20,
  height: 20,
};

export default function DirectedGraph() {
  const totalVisits = useSelector<RootState, IVisit[]>(
    ({ history }) => history.totalVisits,
  );
  const domainNodes = useSelector<RootState, IDomainNode[]>(
    ({ history }) => history.domainNodes,
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clickedPosition, setClickedPosition] = useState({ top: 0, left: 0 });

  const handleCloseModal: MouseEventHandler<HTMLButtonElement> = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const clientRect = svgRef.current?.getBoundingClientRect();

    if (clientRect === undefined) {
      return;
    }

    const { width, height } = clientRect;
    const { nodes, links } = makeGraphData(totalVisits, domainNodes);

    const svg = select<SVGSVGElement, unknown>(svgRef.current as SVGSVGElement);

    svg.selectAll("*").remove();

    const container = svg.append("g");

    const handleZoom = (event: any) => {
      container.attr("transform", event.transform);
    };

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([-4, 4])
      .on("zoom", handleZoom);

    svg.call(zoomBehavior).on("dblclick.zoom", null);

    const simulation = forceSimulation<IDomainNode, IDomainLink>(nodes)
      .force(
        "link",
        forceLink<IDomainNode, IDomainLink>(links).id(({ name }) => name),
      )
      .force("center", forceCenter(width / 2, height / 2))
      .force("charge", forceManyBody().strength(FORCE_STRENGTH))
      .force("x", forceX(width / 2))
      .force("y", forceY(height / 2));

    container
      .append("svg:defs")
      .selectAll("marker")
      .data(URL_TRANSITION_TYPES)
      .join("marker")
      .attr("id", (datum) => `arrow-${datum}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", -1.5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("fill", color)
      .attr("d", "M0, -5L10, 0L0, 5");

    const linkGroup = container
      .append("svg:g")
      .attr("fill", "none")
      .selectAll("path")
      .data<IDomainLink>(links)
      .join("path")
      .attr("stroke-width", 1.5)
      .attr("stroke", (datum) => color(datum.type))
      .attr("marker-end", (datum) => `url(#arrow-${datum.type})`);

    const nodeGroup = container
      .append<SVGSVGElement>("svg:g")
      .selectAll("g")
      .data<IDomainNode>(nodes)
      .join("g")
      .attr("class", "history-node")
      .attr("id", (datum) => removeSpecialCases(datum.name));

    nodeGroup
      .append("circle")
      .attr("fill", "white")
      .attr("stroke", "gray")
      .attr("stroke-width", 1.5)
      .attr("r", (datum) => convertToRadius(datum.visitCount));

    nodeGroup
      .append("image")
      .attr(
        "xlink:href",
        (datum) =>
          `https://www.google.com/s2/favicons?sz=32&domain=${datum.name}`,
      )
      .on("error", ({ target }) => {
        select(target).attr(
          "xlink:href",
          "/images/graph/defaultNodeFavicon.png",
        );
      })
      .attr("width", DEFAULT_IMAGE_SIZE.width)
      .attr("height", DEFAULT_IMAGE_SIZE.height)
      .attr("transform", "translate(-10 -10)");

    const handleDrag = ({ x, y }: DragEvent, datum: IDomainNode) => {
      datum.fx = x;
      datum.fy = y;
      simulation.alpha(1).restart();
    };

    const handleContextMenu = (event: MouseEvent, datum: IDomainNode) => {
      event.preventDefault();

      if (!datum) {
        return;
      }

      setIsModalVisible(true);
      setClickedPosition({ top: event.clientY, left: event.clientX });
    };

    const handleDoubleClick = (event: MouseEvent, datum: IDomainNode) => {
      if (!datum) {
        return;
      }

      delete datum.fx;
      delete datum.fy;

      simulation.alpha(1).restart();
    };

    const handleMouseOver = (event: MouseEvent, datum: IDomainNode) => {
      if (!datum) {
        return;
      }

      select(`#${removeSpecialCases(datum.name)}`)
        .append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(datum.name.split("//")[1])
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("transform", "translate(10 0)");
    };

    const handleMouseOut = (event: MouseEvent, datum: IDomainNode) => {
      if (!datum) {
        return;
      }

      select(`#${removeSpecialCases(datum.name)} text`).remove();
    };

    const dragBehavior = drag<SVGSVGElement, IDomainNode>().on(
      "drag",
      handleDrag,
    );

    container
      .selectAll<SVGSVGElement, IDomainNode>(".history-node")
      .call(dragBehavior)
      .on("contextmenu", handleContextMenu)
      .on("dblclick", handleDoubleClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    simulation.on("tick", () => {
      linkGroup.attr("d", (datum) => {
        let radius = 20;
        const visitCount = nodes.find(
          (node) => node.name === datum.target.name,
        )?.visitCount;

        if (visitCount) {
          radius = convertToRadius(visitCount);
        }

        if (
          datum.target.x === undefined ||
          datum.target.y === undefined ||
          datum.source.x === undefined ||
          datum.source.y === undefined
        ) {
          return "M0, -5L10, 0L0, 5";
        }

        const dx = datum.target.x - datum.source.x;
        const dy = datum.target.y - datum.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);

        const offsetX = (dx * radius) / dr;
        const offsetY = (dy * radius) / dr;

        const placeX = datum.target.x - offsetX;
        const placeY = datum.target.y - offsetY;

        const px = datum.source.x;
        const py = datum.source.y;

        return `M${px},${py}A${dr},${dr} 0 0,1 ${placeX},${placeY}`;
      });

      nodeGroup.attr(
        "transform",
        (datum: any) => `translate(${datum.x},${datum.y})`,
      );
    });
  }, [totalVisits]);

  return (
    <Wrapper>
      <Board ref={svgRef} />
      {isModalVisible && (
        <Modal
          position={{ top: clickedPosition.top, left: clickedPosition.left }}
          handleClose={handleCloseModal}
        >
          <NodeDetail />
        </Modal>
      )}
    </Wrapper>
  );
}
