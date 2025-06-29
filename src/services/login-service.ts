import api from "./api";
import type { BaseResponse, LoginResponse } from "./interfaces";

export async function loginService(username: string, password: string): Promise<BaseResponse<LoginResponse>> {
  const response = await api.post<BaseResponse<LoginResponse>>("/users/login", {
    username,
    password,
  });
  
  return response.data;
}
