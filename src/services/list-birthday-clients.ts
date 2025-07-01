import api from "./api";
import type { BaseResponse, Client} from "./interfaces";

export async function listBirthdayClients(): Promise<BaseResponse<Client[]>> {
  const response = await api.get<BaseResponse<Client[]>>("/months/clients-anniversary", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  
  return response.data;
}
