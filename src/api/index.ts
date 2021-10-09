import { nanoid } from "nanoid";
import { IPostHistoryResponse, IHistoryFormData } from "../types/history";

export const postHistoryFile = async (
  file: File,
): Promise<IPostHistoryResponse> => {
  const formData = new FormData();

  formData.append("historyFile", file, file.name);

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_URL}/browser-history/${nanoid()}`,
    {
      method: "POST",
      body: formData,
    },
  );

  return response.json();
};

export const getHistory = async ({
  id,
  formData,
}: {
  id: string;
  formData: IHistoryFormData;
}): Promise<IPostHistoryResponse> => {
  const { start, end, domain } = formData;
  const url = new URL(
    `${process.env.REACT_APP_SERVER_URL}/browser-history/${id}`,
  );

  url.searchParams.append("start", start);
  url.searchParams.append("end", end);

  if (domain) {
    url.searchParams.append("domain", domain);
  }

  const response = await fetch(url.toString());

  return response.json();
};
