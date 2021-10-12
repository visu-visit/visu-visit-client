import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import { fetchHistory } from "../api";
import { RootState } from "../app/store";
import DirectedGraph from "../components/DirectedGraph";
import ErrorMessage from "../components/shared/ErrorMessage";
import Loading from "../components/shared/Loading";
import Title from "../components/shared/Title";
import { updateBrowserHistory } from "../features/history/historySlice";
import { IBrowserHistory, IHistoryFormData, IHistoryApiResponse } from "../types/history";

const Wrapper = styled.div`
  display: flex;
  font-family: Montserrat;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const HistoryTitle = styled(Title)`
  font-size: 30px;
  align-items: center;

  a {
    text-decoration: none;
    color: black;
  }
`;

const Fieldset = styled.fieldset`
  display: flex;
  align-items: center;
  margin: 20px;
  font-size: 20px;
  font-weight: 100;
  gap: 10px;
`;

const Label = styled.label`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  border-radius: 5px;
  border: 1px solid gray;
  height: 20px;
  width: fit-content;
  font-family: Montserrat;
  font-weight: 200;
`;

const Button = styled.button`
  width: 150px;
  height: 40px;
  margin-left: auto;
  margin-right: 20px;
  border-radius: 5px;
  border: 0;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background: ${({ theme, disabled }) => (disabled ? "lightgray" : theme.gradient.orange)};
  font-family: Montserrat;
  font-weight: 200;
  font-size: 20px;
`;

const INITIAL_HISTORY_FORM_DATA = {
  start: "",
  end: "",
  domain: "",
};

export default function History() {
  const historyId = useSelector<RootState, unknown>(({ history }) => history.nanoId);
  const [formData, setFormData] = useState<IHistoryFormData>(INITIAL_HISTORY_FORM_DATA);
  const { id } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handleFormChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const getHistoryData = async () => {
    try {
      setIsLoading(true);
      const response: IHistoryApiResponse = await fetchHistory({
        formData,
        id,
      });

      if (response.result === "ok") {
        const browserHistory = response.data as IBrowserHistory;

        dispatch(updateBrowserHistory(browserHistory));
      }

      if (response.error) {
        setErrorMessage(response.error.message);
      }
    } catch (error: any) {
      setErrorMessage("히스토리 파일을 가져오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHistoryData();
  }, [historyId]);

  const { start, end, domain } = formData;
  const isFormSubmitActive: boolean = Boolean(
    new Date(start).getTime() <= new Date(end).getTime() || (!start && !end && domain),
  );

  return (
    <Wrapper>
      <Form
        onSubmit={(event) => {
          event.preventDefault();

          getHistoryData();
        }}
      >
        <HistoryTitle>
          <Link to="/">MY WEB HISTORY MAP</Link>
        </HistoryTitle>
        <Fieldset>
          <Label htmlFor="start">
            Start Date
            <Input
              id="start"
              value={formData.start}
              onChange={handleFormChange}
              name="start"
              type="date"
            />
          </Label>
          <div>~</div>
          <Label htmlFor="end">
            End Date
            <Input
              id="end"
              value={formData.end}
              onChange={handleFormChange}
              name="end"
              type="date"
            />
          </Label>
        </Fieldset>
        <Fieldset>
          <Label htmlFor="domain">
            Domain
            <Input
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleFormChange}
              type="text"
            />
          </Label>
        </Fieldset>
        <Button disabled={!isFormSubmitActive} type="submit">
          Search
        </Button>
      </Form>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {isLoading && <Loading />}
      {!errorMessage && !isLoading && <DirectedGraph />}
    </Wrapper>
  );
}
