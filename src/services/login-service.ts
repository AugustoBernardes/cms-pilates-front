import api from "./api";

interface LoginResponse {
  token: string;
}

export async function loginService(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/users/login", {
    username,
    password,
  });

  return response.data;
}
