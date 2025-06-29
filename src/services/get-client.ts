import api from "./api";
import type { BaseResponse } from "./interfaces";
import type { Client } from "./list-clients";

export async function getClientById(id: string): Promise<BaseResponse<Client>> {
  const response = await api.get<BaseResponse<Client>>(`/clients/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  return response.data;
}
