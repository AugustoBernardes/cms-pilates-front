import api from "./api";
import type { BaseResponse, ListClient, ListClientResponse} from "./interfaces";

export async function listClients(data: ListClient): Promise<BaseResponse<ListClientResponse>> {
  const response = await api.get<BaseResponse<ListClientResponse>>("/clients", {
    params: {
      search: data.search || "",
      page: data.page || 1,
      page_size: data.page_size || 10,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  
  return response.data;
}
