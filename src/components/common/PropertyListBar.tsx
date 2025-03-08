import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const PropertyListBar = () => {
  return (
    <View className="bg-black p-4">
      <LinearGradient
        colors={['#00b894', '#00a080', '#353839']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-lg overflow-hidden"
      >
        <View className="p-6">
          <Text className="text-white text-xl font-bold mb-2">
            Become a Property Host
          </Text>
          <Text className="text-white mb-6">
            List your property on Dubai's premier luxury stays platform
          </Text>
          <TouchableOpacity 
            className="bg-white/20 backdrop-blur-sm py-3 px-6 rounded-md self-start"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className="text-white font-medium">
              List Your Property
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default PropertyListBar;