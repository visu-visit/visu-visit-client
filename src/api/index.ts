import { nanoid } from "nanoid";

interface IResponse {
  result: string;
  data?: { [key: string]: any };
  error?: { code: number; message: string };
}

export const postHistoryFile = async (file: File): Promise<IResponse> => {
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
