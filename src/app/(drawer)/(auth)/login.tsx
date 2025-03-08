import { useLogin } from '@/src/features/auth/useLogin';
import { useSignup } from '@/src/features/auth/useSignup';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutate, isPending: isLoginLoading, error: loginError } = useLogin();
  const { mutate: signupMutate, isPending: isSignupLoading, error: signupError } = useSignup();

  const handleAuth = () => {
    if (isLogin) {
      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }
      loginMutate({ email, password });
    } else {
      if (!fullName || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
      }
      signupMutate(
        { fullName, email, phone, password },
        {
          onSuccess: () => {
            setIsLogin(true); 
            setFullName('');  
            setEmail('');
            setPhone('');
            setPassword('');
          },
        }
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black justify-center">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 justify-center px-5"
      >
        <View className="items-center mb-10">
          <Ionicons name="planet" size={70} color="#1E88E5" />
          <Text className="text-3xl font-bold text-white mt-3">COSMOS LIVING</Text>
        </View>
        
        <View className="bg-neutral-900 rounded-xl p-6 shadow-2xl">
          <Text className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </Text>
          <Text className="text-sm text-gray-400 mb-6">
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Enter your information to get started'}
          </Text>

          {!isLogin && (
            <View className="mb-4">
              <Text className="text-white mb-2">Full name</Text>
              <View className="flex-row items-center bg-black rounded-md">
                <Ionicons name="person-outline" size={20} color="#999" className="ml-3" />
                <TextInput 
                  className="flex-1 text-white p-3"
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-white mb-2">Email</Text>
            <View className="flex-row items-center bg-black rounded-md">
              <Ionicons name="mail-outline" size={20} color="#999" className="ml-3" />
              <TextInput 
                className="flex-1 text-white p-3"
                placeholder="m@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>

          {!isLogin && (
            <View className="mb-4">
              <Text className="text-white mb-2">Phone</Text>
              <View className="flex-row items-center bg-black rounded-md">
                <Ionicons name="call-outline" size={20} color="#999" className="ml-3" />
                <TextInput 
                  className="flex-1 text-white p-3"
                  placeholder="Phone No."
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          <View className="mb-6">
            <Text className="text-white mb-2">Password</Text>
            <View className="flex-row items-center bg-black rounded-md">
              <Ionicons name="lock-closed-outline" size={20} color="#999" className="ml-3" />
              <TextInput 
                className="flex-1 text-white p-3"
                placeholder="********"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="mr-3"
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {(loginError || signupError) && (
            <Text className="text-red-500 mb-4">
              {isLogin ? loginError?.message : signupError?.message}
            </Text>
          )}

          {/* Auth Button */}
          <TouchableOpacity 
            className="bg-sky-500 p-4 rounded-md mt-6 mb-5 items-center flex-row justify-center"
            onPress={handleAuth}
            disabled={isLoginLoading || isSignupLoading}
          >
            <Ionicons 
              name={isLogin ? "log-in-outline" : "create-outline"} 
              size={24} 
              color="white" 
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg">
              {isLogin
                ? isLoginLoading
                  ? 'Signing In...'
                  : 'Sign In'
                : isSignupLoading
                ? 'Creating Account...'
                : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setIsLogin(!isLogin)}
            className="flex-row justify-center"
          >
            <Text className="text-gray-400 text-center">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Text className="text-sky-400 font-bold">
                {isLogin ? 'Sign up' : 'Login'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginSignup;