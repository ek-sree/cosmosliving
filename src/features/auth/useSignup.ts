import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { signup } from '@/src/services/apiSignup';

interface SignupCredentials {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImg: string;
    property: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface ApiResponse {
  _statusCode: number;
  data: SignupResponse;
  message: string;
  statusCode: number;
}

export const useSignup = () => {

  return useMutation({
    mutationFn: (credentials: SignupCredentials) => signup(credentials),
    onSuccess: async (response: ApiResponse) => {
      try {
        const { data } = response;
        } catch (error) {
        console.error('Error storing tokens in AsyncStorage:', error);
      }
    },
    onError: (error: Error) => {
      console.error('Signup error:', error.message);
    },
  });
};