// services/signup.ts
import { AxiosError } from 'axios';
import { API_ENDPOINTS } from '../lib/constants';
import { api } from './axiosInstance';

interface SignupCredentials {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export async function signup(credentials: SignupCredentials) {
  try {
    const { data } = await api.post(API_ENDPOINTS.SIGNUP, credentials); 
    return data;
  } catch (error) {
    console.log('Signup error:', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Signup failed!');
    }
    throw error;
  }
}