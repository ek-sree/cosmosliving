// services/signup.ts
import { AxiosError } from 'axios';
import { API_ENDPOINTS } from '../lib/constants';
import { api } from './axiosInstance';

interface USERDETAILS {
  fullName: string;
  email: string;
  phone: string;
  location: string | "";
  image: string | null;
  profileImg: string | null;
}

export async function editUserDetails(credentials: USERDETAILS) {
  try {
    const { data } = await api.put(API_ENDPOINTS.EDITUSERDETAILS, credentials); 
    return data;
  } catch (error) {
    console.log('Updating userDetails error:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Editing user details failed!');
    }
    throw error;
  }
}