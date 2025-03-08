import { AxiosError } from "axios";
import { API_ENDPOINTS } from "../lib/constants";
import { api } from "./axiosInstance";

interface LoginCredentials {
    email: string;
    password: string;
  }

export async function login(credentials: LoginCredentials) {
  try {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, credentials);

    return data;
  } catch (error) {
    console.log("Login error:", error);
    if (error instanceof AxiosError) {
      if (error.code === "ERR_CANCELED") {
        throw new Error("Request was canceled");
      }
      throw new Error(
        error.response?.data?.message || "Login failed!"
      );
    }
    throw error;
  }
}