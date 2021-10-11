import { nanoid } from "nanoid";
import { IHistoryApiResponse, IHistoryFormData } from "../types/history";

export const postHistoryFile = async (file: File): Promise<IHistoryApiResponse> => {
  const formData = new FormData();

  formData.append("historyFile", file, file.name);

  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/browser-history/${nanoid()}`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const fetchHistory = async ({
  id,
  formData,
}: {
  id: string;
  formData?: IHistoryFormData;
}): Promise<IHistoryApiResponse> => {
  const url = new URL(`${process.env.REACT_APP_SERVER_URL}/browser-history/${id}`);

  if (formData) {
    const { start, end, domain } = formData;

    url.searchParams.append("start", start);
    url.searchParams.append("end", end);

    if (domain) {
      url.searchParams.append("domain", domain);
    }
  }

  const response = await fetch(url.toString());

  return response.json();
};
