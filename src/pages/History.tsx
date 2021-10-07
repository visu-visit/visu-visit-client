import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getHistory } from "../api";
import DirectedGraph from "../components/DirectedGraph";
import ErrorMessage from "../components/shared/ErrorMessage";
import Title from "../components/shared/Title";
import { updateBrowserHistory } from "../features/history/historySlice";
import {
  IBrowserHistory,
  IHistoryFormData,
  IPostHistoryResponse,
} from "../types/history";
import makeLinks from "../util/history/makeLinks";

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
  background: ${({ theme, disabled }) =>
    disabled ? "lightgray" : theme.gradient.orange};
  font-family: Montserrat;
  font-weight: 200;
  font-size: 20px;
`;

export default function History() {
  const [formData, setFormData] = useState<IHistoryFormData>({
    start: "",
    end: "",
    domain: "",
  });
  const { id } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleFormChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response: IPostHistoryResponse = await getHistory({
        ...formData,
        id,
      });

      if (response.result === "ok") {
        const browserHistory = response.data as IBrowserHistory;
        const links = makeLinks(browserHistory.totalVisits);

        dispatch(updateBrowserHistory(browserHistory));
      }

      if (response.error) {
        setErrorMessage(response.error.message);
      }
    } catch (error: any) {
      console.log("error", error.message);
      setErrorMessage("히스토리 파일을 가져오는데 실패했습니다.");
    }
  };

  const { start, end } = formData;
  const isFormSubmitActive: boolean =
    new Date(start).getTime() <= new Date(end).getTime();

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <HistoryTitle>MY WEB HISTORY MAP</HistoryTitle>
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
      {errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : (
        <DirectedGraph />
      )}
    </Wrapper>
  );
}
