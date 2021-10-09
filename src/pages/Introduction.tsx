import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import { postHistoryFile } from "../api";
import ErrorMessage from "../components/shared/ErrorMessage";
import Title from "../components/shared/Title";
import { updateBrowserHistory } from "../features/history/historySlice";
import { IPostHistoryResponse } from "../types/history";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainTitle = styled(Title)`
  position: absolute;
  top: 0;
  left: 0;
`;

const Section = styled.section`
  position: relative;
  width: 50%;
  min-width: 300px;
`;

const SLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin: 10px 0 10px 0;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Montserrat;
  font-weight: 200;
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

export default function Introduction() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const handleUploadFile = async () => {
    setErrorMessage("");

    const file = inputRef.current?.files?.[0];

    if (file) {
      try {
        const response: IPostHistoryResponse = await postHistoryFile(file);

        if (response.result === "ok" && response.data) {
          const browserHistory = response.data;

          dispatch(updateBrowserHistory(browserHistory));
          history.push(`/browser-history/${browserHistory.nanoId}`);
        }

        if (response.error) {
          setErrorMessage(response.error.message);
        }
      } catch (error: any) {
        console.log("error", error.message);
        setErrorMessage("히스토리 파일 업로드에 실패했습니다.");
      }
    }
  };

  return (
    <Wrapper>
      <MainTitle>Visualize & Customize Your Browser History</MainTitle>
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
