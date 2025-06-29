
export interface BaseResponse<T>{
  status: 'success' | 'fail';
  message: string;
  data?: T;
}

export interface LoginResponse {
    token: string;
}

