import { AxiosError } from "axios";
import { API_ENDPOINTS } from "../lib/constants";
import { api } from "./axiosInstance";


export async function getBookings(id:string) {
  try {
    const { data } = await api.get(`${API_ENDPOINTS.BOOKING}/${id}/bookings`);
    return data;
  } catch (error) {
    console.log("Bookings Details fetch error:", error);
    if (error instanceof AxiosError) {
      if (error.code === "ERR_CANCELED") {
        throw new Error("Request was canceled");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking Details!"
      );
    }
    throw error;
  }
}