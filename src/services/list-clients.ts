import api from "./api";
import type { BaseResponse} from "./interfaces";

export interface ListClient {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface Client {
  id: string
  name: string
  phone: string
  cpf: string
  birth_date: string
  current_invoice_price: number
  created_at: string
}


export interface ListClientResponse {
  total: number;
  total_pages: number;
  page: number;
  page_size: number;
  data: Client[];
}

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
