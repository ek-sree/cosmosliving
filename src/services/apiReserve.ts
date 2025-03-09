import { AxiosError } from "axios";
import { API_ENDPOINTS } from "../lib/constants";
import { api } from "./axiosInstance";

export interface ReserveCredentials {
    checkIn: string;
    checkOut: string;
    guest: string;
    manualPrice: number;
    property: string;
    userId: string;
  }

export async function reserveProperty(credentials: ReserveCredentials) {
  try {
    const { data } = await api.post(API_ENDPOINTS.RESERVE, credentials);

    return data;
  } catch (error) {
    console.log("Reserve error:", error);
    if (error instanceof AxiosError) {
      if (error.code === "ERR_CANCELED") {
        throw new Error("Request was canceled");
      }
      throw new Error(
        error.response?.data?.message || "Reserving failed!"
      );
    }
    throw error;
  }
}