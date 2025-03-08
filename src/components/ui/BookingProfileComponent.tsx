import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';

interface Booking {
  imageUri: string;
  title: string;
  status: string;
  location: string;
  address: string;
  startDate: string;
  endDate: string;
  guestName: string;
  price: string;
}

interface BookingProfileComponentProps {
  bookings?: Booking[];
}
const BookingProfileComponent = ({ bookings = [] }:BookingProfileComponentProps) => {

  return (
    <View className="py-5 px-4">
      <Text className="text-white text-xl font-bold mb-5">Current Bookings</Text>
      
      {bookings.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Text className="text-white text-lg font-bold">No Current Booking Found</Text>
        </View>
      ) : (
        <View>
          {bookings.map((booking, index) => {
            const imageUri = booking.imageUri || 'https://via.placeholder.com/150';
            const htmlContent = `
              <html>
                <body style="margin: 0; padding: 0;">
                  <img src="${imageUri}" style="width: 100%; height: 100%; object-fit: cover;" />
                </body>
              </html>
            `;

            return (
              <View key={index} className="bg-neutral-900 rounded-lg overflow-hidden mb-4">
                <WebView
                  source={{ html: htmlContent }}
                  style={{ width: '100%', height: 192 }}
                  javaScriptEnabled={false}
                  scrollEnabled={false}
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                  }}
                />
                
                <View className="p-4">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-white text-lg font-bold flex-1 mr-2">{booking.title}</Text>
                    <View className="bg-blue-900 px-2 py-1 rounded">
                      <Text className="text-white text-xs">{booking.status}</Text>
                    </View>
                  </View>
                  
                  <Text className="text-gray-400 mb-1">{booking.location}</Text>
                  <Text className="text-gray-500 mb-3">{booking.address}</Text>
                  
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={16} color="white" />
                    <Text className="text-white ml-2">{booking.startDate} - {booking.endDate}</Text>
                  </View>
                  
                  <View className="flex-row items-center mb-4">
                    <Ionicons name="person-outline" size={16} color="white" />
                    <Text className="text-white ml-2">{booking.guestName}</Text>
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white font-bold">{booking.price} total</Text>
                    <TouchableOpacity className="bg-teal-400 py-2 px-4 rounded">
                      <Text className="text-white">View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default BookingProfileComponent;