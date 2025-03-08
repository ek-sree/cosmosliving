import { AxiosError } from "axios";
import { API_ENDPOINTS } from "../lib/constants";
import { api } from "./axiosInstance";

export interface PropertyFilters {
  address?: string;
  city?: string;
  bedrooms?: string;
  category?: string;
  area?: string;
  page?: number;
  limit?: number;
}

interface Property {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
}

interface PropertyResponse {
  _statusCode: number;
  data: {
    properties: Property[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  statusCode: number;
}

export async function getProperties(filters: PropertyFilters = {}) {
  try {
    const { data } = await api.get<PropertyResponse>(API_ENDPOINTS.PROPERTY, {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 5,
        filters: {
          address: filters.address || "",
          city: filters.city || "",
          bedrooms: filters.bedrooms || "",
          category: filters.category || "",
          area: filters.area || "",
        },
      },
    });
    return data;
  } catch (error) {
    console.log("Property fetch error:", error);
    if (error instanceof AxiosError) {
      if (error.code === "ERR_CANCELED") {
        throw new Error("Request was canceled");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch properties!"
      );
    }
    throw error;
  }
}