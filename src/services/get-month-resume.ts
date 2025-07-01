import api from "./api";
import type { BaseResponse, MonthResume } from "./interfaces";

export async function getMonthResume(month_id: string): Promise<BaseResponse<MonthResume>> {
  const response = await api.get<BaseResponse<MonthResume>>(`/months/${month_id}/resume`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  
  return response.data;
}
