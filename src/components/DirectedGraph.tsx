/* eslint-disable no-param-reassign */

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { forceManyBody, forceLink, forceSimulation, forceX, forceY } from "d3-force";
import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import { drag } from "d3-drag";

import { RootState } from "../app/store";
import { IClickedNode, IDomainLink, IDomainNode, IVisit } from "../types/history";
import { DEFAULT_STROKE_WIDTH, URL_TRANSITION_TYPES } from "../constants/history";
import Modal from "./shared/Modal";
import NodeDetail from "./NodeDetail";
import {
  convertToRadius,
  getArrowPosition,
  handleNodeRadius,
  handleLinkDistance,
  handleLinkStroke,
  handleMouseOut,
  handleMouseOver,
  handleNodeStrength,
  makeGraphData,
  removeSpecialCases,
} from "../util/history";
import { changeNode } from "../features/history/historySlice";

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
const INITIAL_CLICKED_NODE = { top: 0, left: 0, node: {} as IDomainNode };

export default function DirectedGraph() {
  const totalVisits = useSelector<RootState, IVisit[]>(({ history }) => history.totalVisits);
  const domainNodes = useSelector<RootState, IDomainNode[]>(({ history }) => history.domainNodes);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [clickedNode, setClickedNode] = useState<IClickedNode>(INITIAL_CLICKED_NODE);
  const [zoomTransform, setZoomTransform] = useState<any>(null);
  const dispatch = useDispatch();

  const handleCloseModal: () => void = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const { width, height } = svgRef.current.getBoundingClientRect();
    const { nodes, links } = makeGraphData(totalVisits, domainNodes);
    const svg = select<SVGSVGElement, unknown>(svgRef.current as SVGSVGElement);

    svg.selectAll("*").remove();

    const container = svg.append("g");

    if (zoomTransform) {
      container.attr(
        "transform",
        `translate(${zoomTransform.x},${zoomTransform.y}) scale(${zoomTransform.k})`,
      );
    }

    const handleZoom = (event: any) => {
      container.attr("transform", event.transform);
      setZoomTransform(event.transform);
    };
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0, 2])
      .on("zoom", handleZoom);

    svg.call(zoomBehavior).on("dblclick.zoom", null);

    const simulation = forceSimulation<IDomainNode, IDomainLink>(nodes)
      .force(
        "link",
        forceLink<IDomainNode, IDomainLink>(links)
          .distance(handleLinkDistance)
          .id(({ name }) => name),
      )
      .force("charge", forceManyBody<IDomainNode>().strength(handleNodeStrength))
      .force("x", forceX(width / 2))
      .force("y", forceY(height / 2));

    const handleDrag = ({ x, y }: DragEvent, node: IDomainNode) => {
      node.fx = x;
      node.fy = y;
      simulation.alpha(1).restart();
    };
    const handleDragEnd = ({ x, y }: DragEvent, node: IDomainNode) => {
      dispatch(changeNode(node));
    };
    const dragBehavior = drag<SVGSVGElement, IDomainNode>()
      .on("drag", handleDrag)
      .on("end", handleDragEnd);

    container
      .append("svg:defs")
      .selectAll("marker")
      .data(URL_TRANSITION_TYPES)
      .join("marker")
      .attr("id", (urlTransition) => `arrow-${urlTransition}`)
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
      .attr("stroke-width", handleLinkStroke)
      .attr("stroke", (domainLink) => color(domainLink.type))
      .attr("marker-end", (domainLink) => `url(#arrow-${domainLink.type})`);

    const nodeGroup = container
      .append<SVGSVGElement>("svg:g")
      .selectAll("g")
      .data<IDomainNode>(nodes)
      .join("g")
      .attr("class", "history-node")
      .attr("id", (domainNode) => removeSpecialCases(domainNode.name));

    nodeGroup
      .append("circle")
      .attr("fill", ({ color: nodeColor }) => nodeColor || "white")
      .attr("stroke", "gray")
      .attr("stroke-width", DEFAULT_STROKE_WIDTH)
      .attr("r", handleNodeRadius)
      .join("circle");

    nodeGroup
      .append("image")
      .attr("xlink:href", ({ name }) => `https://api.faviconkit.com/${new URL(name).hostname}/128`)
      .on("error", ({ target }) => {
        select(target).attr("xlink:href", "/images/graph/defaultNodeFavicon.png");
      })
      .attr("width", (node) => handleNodeRadius(node))
      .attr("height", (node) => handleNodeRadius(node))
      .attr("x", (node) => -handleNodeRadius(node) / 2)
      .attr("y", (node) => -handleNodeRadius(node) / 2);

    nodeGroup
      .append("circle")
      .attr("fill", "red")
      .attr("opacity", 0.5)
      .attr("r", (node) => (node.memo ? handleNodeRadius(node) / 10 : 0))
      .attr("width", 20)
      .attr("height", 20)
      .attr(
        "transform",
        (node) => `translate(${handleNodeRadius(node) / 2} -${handleNodeRadius(node) / 2})`,
      );

    const handleContextMenu = (event: MouseEvent, domainNode: IDomainNode) => {
      event.preventDefault();

      setClickedNode({
        top: event.clientY,
        left: event.clientX,
        node: domainNode,
      });
      setIsModalVisible(true);
    };

    const handleDoubleClick = (event: MouseEvent, domainNode: IDomainNode) => {
      if (!domainNode) {
        return;
      }

      delete domainNode.fx;
      delete domainNode.fy;

      simulation.alpha(1).restart();
    };

    container
      .selectAll<SVGSVGElement, IDomainNode>(".history-node")
      .call(dragBehavior)
      .on("contextmenu", handleContextMenu)
      .on("dblclick", handleDoubleClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    const handleTick = () => {
      linkGroup.attr("d", (domainLink) => {
        const visitCount = nodes.find((node) => node.name === domainLink.target.name)?.visitCount;
        let radius = 20;

        if (visitCount) {
          radius = convertToRadius(visitCount);
        }

        return getArrowPosition(domainLink, radius);
      });

      nodeGroup.attr("transform", (domainNode) => `translate(${domainNode.x},${domainNode.y})`);
    };

    simulation.on("tick", handleTick);
  }, [totalVisits, domainNodes]);

  return (
    <Wrapper>
      <Board ref={svgRef} />
      {isModalVisible && (
        <Modal
          position={{
            top: clickedNode.top,
            left: clickedNode.left,
          }}
          handleClose={handleCloseModal}
        >
          <NodeDetail node={clickedNode.node} handleClose={handleCloseModal} />
        </Modal>
      )}
    </Wrapper>
  );
}
