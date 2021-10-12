import { MouseEventHandler, ReactChild, ReactChildren } from "react";
import styled from "styled-components";

interface ModalProps {
  children: ReactChild | ReactChildren;
  position?: { top: string; left: string };
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
const Container = styled.div<{ position: { top: string; left: string } }>`
  position: absolute;
  top: ${({ position: { top } }) => top};
  left: ${({ position: { left } }) => left};
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  border-radius: 10px;
  z-index: 9999;
`;

export default function Modal({ children, handleClose, position }: ModalProps) {
  return (
    <>
      <Background
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            handleClose(event);
          }
        }}
      />
      {position && <Container position={position}>{children}</Container>}
    </>
  );
}

Modal.defaultProps = {
  position: { top: "50%", left: "50%" },
};
