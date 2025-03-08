import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome, AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View className="bg-black p-6">
              <View className="border-t border-gray-700 my-4"></View>

      {/* Logo and Tagline */}
      <View className="mb-6">
        <View className="flex-row items-center mb-2">
          <Text className="text-white font-bold text-xl">COSMOS LIVING</Text>
        </View>
        <Text className="text-gray-400 text-sm mb-4">
          Your premier destination for luxury stays in Dubai.
        </Text>

        {/* Social Media Icons */}
        <View className="flex-row space-x-10 mb-6 mt-4 ml-10">
          <TouchableOpacity>
            <AntDesign name="twitter" size={20} color="#fff" className='mr-14'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="facebook" size={20} color="#fff" className='mr-14'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="instagram" size={20} color="#fff" className='mr-14'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="linkedin" size={20} color="#fff" className='mr-14'/>
          </TouchableOpacity>
        </View>
      </View>

      {/* Two Columns: Company and Support */}
      <View className="flex-row mb-6">
        <View className="flex-1">
          <Text className="text-white font-semibold text-lg mb-4">Company</Text>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">About</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">Press</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Text className="text-white font-semibold text-lg mb-4">Support</Text>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">Cancellation</Text>
          </TouchableOpacity>
          <TouchableOpacity className="mb-3">
            <Text className="text-gray-400">FAQ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Legal Section */}
      <View className="mb-6">
        <Text className="text-white font-semibold text-lg mb-4">Legal</Text>
        <TouchableOpacity className="mb-3">
          <Text className="text-gray-400">Terms</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-3">
          <Text className="text-gray-400">Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-3">
          <Text className="text-gray-400">Cookie Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-3">
          <Text className="text-gray-400">Guidelines</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-700 my-4"></View>

      {/* Copyright */}
      <Text className="text-gray-500 text-center">
        © 2025 CosmosLiving. All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;