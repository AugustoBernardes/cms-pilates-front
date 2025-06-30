import api from "./api";
import type { Invoice } from "./get-client-invoices";
import type { BaseResponse, ListMonthInvoices } from "./interfaces";

export async function listMonthInvoices(data: ListMonthInvoices): Promise<BaseResponse<Invoice[]>> {
  const response = await api.get<BaseResponse<Invoice[]>>(`/months/${data.id}/invoices`, {
    params: {
      page: data.page || 1,
      page_size: data.page_size || 10,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  
  return response.data;
}
