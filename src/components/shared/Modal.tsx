import { MouseEventHandler, ReactChild, ReactChildren } from "react";
import styled from "styled-components";

interface ModalProps {
  children: ReactChild | ReactChildren;
  position: { top: number; left: number };
  handleClose: MouseEventHandler;
}

const Background = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.5;
  z-index: 0;
`;
const Container = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  border-radius: 10px;
  z-index: 9999;
`;

export default function Modal({
  children,
  handleClose,
  position: { top, left },
}: ModalProps) {
  return (
    <>
      <Background
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleClose(event);
          }
        }}
      />
      <Container top={top} left={left}>
        {children}
      </Container>
    </>
  );
}
