import api from "./api";
import type { Month } from "./fetch-months";
import type { BaseResponse } from "./interfaces";

export interface Invoice {
  id: string;
  status: string;
  value: number;
  client_id: string;
  month_id: string;
  created_at: string;
  month: Month;
}

export interface ListClientInvoicesResponse {
  total: number;
  total_pages: number;
  page: number;
  page_size: number;
  data: Invoice[];
}

export async function getClientInvoices(
  clientId: string,
  page: number,
  page_size: number
): Promise<BaseResponse<ListClientInvoicesResponse>> {
  const response = await api.get<BaseResponse<ListClientInvoicesResponse>>(`/clients/${clientId}/invoices`, {
    params: {
      page,
      page_size,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  return response.data;
}
