import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { login } from '@/src/services/apiLogin';
import { useAuth } from '@/src/context/AuthContext';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
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
  data: LoginResponse;
  message: string;
  statusCode: number;
}

export const useLogin = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: async (response: ApiResponse) => {
      try {
        const { data } = response;
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        setIsAuthenticated(true); 
        router.replace('/property');
      } catch (error) {
        console.error('Error storing tokens in AsyncStorage:', error);
      }
    },
    onError: (error: Error) => {
      console.error('Login error:', error.message);
    },
  });
};