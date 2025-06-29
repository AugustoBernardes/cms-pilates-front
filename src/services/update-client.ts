import api from "./api";
import type { BaseResponse, Client } from "./interfaces";

export async function updateClient(id:string, data: Partial<Client>) {

const response = await api.put<BaseResponse<Client>>(`/clients/${id}`, 
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  return response.data
}
