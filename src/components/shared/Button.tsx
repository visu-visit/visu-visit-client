import styled from "styled-components";
import flexCenter from "../../styles/flexCenter";

const Button = styled.button`
  ${flexCenter}
  border: 0;

  &:hover {
    border: 1px solid gray;
  }
`;

export default Button;
