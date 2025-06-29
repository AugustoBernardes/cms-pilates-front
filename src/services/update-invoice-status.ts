import api from "./api";
import type { BaseResponse } from "./interfaces";

export async function updateInvoiceStatus(
  invoice_id: string,
  currentStatus: string,
): Promise<BaseResponse<void>> {
  const newStatus = currentStatus === "paid" ? "open" : "paid";

  const response = await api.put<BaseResponse<void>>(
    `/invoices/${invoice_id}`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    }
  );

  return response.data;
}
