import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { IHistoryApiResponse } from "../types/history";
import { updateOriginBrowserHistory } from "../features/history/historySlice";
import ErrorMessage from "../components/shared/ErrorMessage";
import Title from "../components/shared/Title";
import { postHistoryFile } from "../api";
import Loading from "../components/shared/Loading";
import flexCenter from "../styles/flexCenter";

const Wrapper = styled.div`
  ${flexCenter}
  position: relative;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

const MainTitle = styled(Title)`
  font-size: 40px;
`;

const Section = styled.section`
  position: relative;
  width: 50%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
`;

const SLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin: 10px 0 10px 0;
  font-size: 20px;
  padding: 10px;

  &:hover {
    border: 0px;
    border-radius: 5px;
    background-color: lightgray;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Montserrat;
  font-weight: 200;
  width: 200px;
  height: 50px;
  background: ${({ theme }) => theme.gradient.orange};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  font-size: 20px;

  &:hover {
    border: 1px solid gray;
    cursor: pointer;
  }
`;

const Input = styled.input`
  display: none;
`;

export default function Introduction() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleUploadFile = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const file = inputRef.current?.files?.[0];

    if (file) {
      try {
        const response: IHistoryApiResponse = await postHistoryFile(file);

        if (response.result === "ok" && response.data) {
          const browserHistory = response.data;

          dispatch(updateOriginBrowserHistory(browserHistory));
          setIsLoading(false);
          history.push(`/browser-history/${browserHistory.nanoId}`);
        }

        if (response.error) {
          setErrorMessage(response.error.message);
          setIsLoading(false);
        }
      } catch (error: any) {
        setErrorMessage("히스토리 파일 업로드에 실패했습니다.");
        setIsLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      <MainTitle>Visualize & Customize Your Browser History</MainTitle>
      <Logo alt="logo" src="./images/logo.png" />
      <Section>
        <SLink to="description-about-browser-history-location">
          HOW & WHERE TO GET BROWSER HISTORY FILE ?
        </SLink>

        {isLoading ? (
          <Loading />
        ) : (
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
        )}

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Section>
    </Wrapper>
  );
}
