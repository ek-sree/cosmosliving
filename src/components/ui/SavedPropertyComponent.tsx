import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';

interface savings {
  imageUri: string;
  title: string;
  address: string;
  price: string;
  city: string;
}

interface SavingProfileComponentProps {
  savedProperties?: savings[];
}
const SavedPropertyComponent = ({ savedProperties = [] }:SavingProfileComponentProps) => {

  return (
    <View className="py-5 px-4">
      <Text className="text-white text-xl font-bold mb-5">Saved Properties</Text>
      
      {savedProperties.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Text className="text-white text-lg font-bold">No Saved Properties Found</Text>
        </View>
      ) : (
        <View>
          {savedProperties.map((property, index) => {
            const imageUri = property.imageUri || 'https://via.placeholder.com/150';
            const htmlContent = `
              <html>
                <body style="margin: 0; padding: 0;">
                  <img src="${imageUri}" style="width: 100%; height: 100%; object-fit: cover;" />
                </body>
              </html>
            `;

            return (
              <View key={index} className="bg-black rounded-lg overflow-hidden mb-4 border border-gray-800">
                <View className="relative">
                  <WebView
                    source={{ html: htmlContent }}
                    style={{ width: '100%', height: 224 }} 
                    javaScriptEnabled={false}
                    scrollEnabled={false}
                    onError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      console.warn('WebView error for', property.imageUri, ':', nativeEvent);
                    }}
                  />
                  
                  <View className="absolute top-2 right-2 bg-white p-1 rounded-md">
                    <Ionicons name="heart" size={24} color="red" />
                  </View>
                </View>
                
                <View className="p-4">
                  <Text className="text-white text-lg font-bold mb-1">{property.title}</Text>
                  
                  <Text className="text-white text-base mb-1 font-medium">{property.address}</Text>
                  <Text className="text-slate-400 mb-2">{property.city}</Text>
                  
                  <Text className="text-white text-lg font-bold mb-4">{property.price}</Text>
                  
                  <TouchableOpacity className="bg-teal-400 py-3 rounded-md">
                    <Text className="text-white text-center">Check Availability</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default SavedPropertyComponent;