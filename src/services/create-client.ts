import api from "./api";
import type { BaseResponse, Client } from "./interfaces";

export async function createClient(data: Partial<Client>) {

const response = await api.post<BaseResponse<Client>>(`/clients`, 
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  return response.data
}
