import api from "./api";
import type { BaseResponse } from "./interfaces";

export async function updateInvoiceStatus(
  invoice_id: string,
  status: string,
): Promise<BaseResponse<void>> {
  const response = await api.put<BaseResponse<void>>(
    `/invoices/${invoice_id}`,
    { status: status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    }
  );

  return response.data;
}
