import api from "./api";
import type { BaseResponse, Client } from "./interfaces";

export async function createClient(id:string, data: Partial<Client>) {

const response = await api.post<BaseResponse<Client>>(`/clients/${id}`, 
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  return response.data
}
