import styled from "styled-components";
import SubTitle from "./shared/SubTitle";
import Title from "./shared/Title";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 500px;
  background-color: white;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  padding: 10px;
  overflow: scroll;

  img {
    border: 1px solid black;
    border-radius: 10px;
    width: 800px;
  }
`;

export default function Instruction() {
  return (
    <Wrapper>
      <Title>HOW TO USE IT</Title>

      <SubTitle>1. Drag Your Domain Node</SubTitle>
      <img alt="drag-gif" src="../images/instruction/instruction-drag.gif" />

      <SubTitle>2. Filter By Date & Domain</SubTitle>
      <img alt="drag-gif" src="../images/instruction/instruction-filter.gif" />

      <SubTitle>3. Right Click See & Modify Node Detail</SubTitle>
      <img alt="drag-gif" src="../images/instruction/instruction-detail.gif" />

      <SubTitle>4. Delete Your Domain Node</SubTitle>
      <img alt="drag-gif" src="../images/instruction/instruction-delete.gif" />

      <SubTitle>5. Save & Share Your Domain Node</SubTitle>
      <img alt="drag-gif" src="../images/instruction/instruction-save-share.gif" />
    </Wrapper>
  );
}
