import api from "./api";
import type { BaseResponse, Client } from "./interfaces";

export async function deleteClient(id: string) {
    const response = await api.delete<BaseResponse<Client>>(`/clients/${id}`, 
     {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  return response.data
}
