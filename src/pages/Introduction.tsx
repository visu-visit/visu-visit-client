import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { postHistoryFile } from "../api";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Section = styled.section`
  position: relative;
  width: 50%;
  min-width: 300px;
`;

const Title = styled.h1`
  position: absolute;
  top: 0;
  left: 0;
  font-family: Montserrat;
  font-size: 100px;
  font-weight: 800;
  margin: 20px;
`;

const SLink = styled(Link)`
  display: block;
  margin: 10px 0 10px 0;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Montserrat;
  font-weight: 800;
  width: 100%;
  height: 100px;
  background: ${({ theme }) => theme.gradient.orange};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  font-size: 50px;
`;

const Input = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  color: red;
`;

export default function Introduction() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUploadFile = async () => {
    setErrorMessage("");

    const file = inputRef.current?.files?.[0];

    if (file) {
      try {
        const response = await postHistoryFile(file);
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
        setErrorMessage("히스토리 파일 업로드에 실패했습니다.");
      }
    }
  };

  return (
    <Wrapper>
      <Title>Visualize & Customize Your Browser History</Title>
      <Section>
        <SLink to="description-about-browser-history-location">
          HOW & WHERE TO GET BROWSER HISTORY FILE ?
        </SLink>

        <Label htmlFor="historyFileInput">
          UPLOAD
          <Input
            id="historyFileInput"
            ref={inputRef}
            onChange={handleUploadFile}
            type="file"
            name="historyFile"
          />
        </Label>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Section>
    </Wrapper>
  );
}
