
export interface BaseResponse<T>{
  status: 'success' | 'fail';
  message: string;
  data?: T;
}

export interface LoginResponse {
    token: string;
}


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


export interface ListMonthInvoices {
  id: string;
  page?: number;
  page_size?: number;
}
