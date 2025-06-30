import api from "./api";
import type { BaseResponse } from "./interfaces";

export interface Month {
  id: string;
  month: string;
}

export async function getMonths(): Promise<BaseResponse<Month[]>> {
  const response = await api.get<BaseResponse<Month[]>>(`/months`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  return response.data;
}
