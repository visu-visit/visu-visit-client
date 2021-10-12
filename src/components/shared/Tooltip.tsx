import { ReactChild, ReactChildren } from "react";
import styled, { keyframes } from "styled-components";

const tooltipKeyFrames = keyframes`
  0% { opacity: 0; }
  40% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 1;}
`;

const Wrapper = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;

  &:hover > .tooltip,
  &:active > .tooltip {
    display: flex;
  }
`;

const Message = styled.div`
  position: absolute;
  display: none;
  align-items: center;
  width: max-content;
  height: 20px;
  line-height: 20px;
  z-index: 9999;
  font-size: 10px;
  overflow: hidden;
  top: -10px;
  border-radius: 0;
  color: white;
  background-color: #0000006f;
  animation: ${tooltipKeyFrames} 1s;
`;

interface TooltipProps {
  children: ReactChild | ReactChildren;
  message: string;
}

export default function Tooltip({ children, message }: TooltipProps) {
  return (
    <Wrapper>
      {children}
      <Message className="tooltip">{message}</Message>
    </Wrapper>
  );
}
