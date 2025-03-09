import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSingleProperty } from '@/src/features/useSingleProperty';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CheckoutPage from '../(modal)/CheckoutPage';
import { useUserDetails } from '@/src/features/useUserDetails';

const SingleProperty = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useSingleProperty(typeof id === 'string' ? id : '');
  const { data: userData, isLoading: isUserLoading, error: isUserError } = useUserDetails();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);


  // Validate id
  const isValidId = id && typeof id === 'string';

  const property = isValidId && data?.data
    ? {
        title: data.data.title || '',
        location: data.data.address?.address || '',
        rating: data.data.rating || '',
        reviews: data.data.reviews || '',
        price: data.data.price || '',
        description: data.data.description || '',
        guests: data.data.guest_no || '',
        bathrooms: data.data.bathrooms || '',
        roomType: data.data.roomType || '',
        superhost: data.data.superhost || '',
        amenities: data.data.amenities || [],
        totalAmenities: data.data.amenities?.length || '',
        checkIn: data.data.Check_in_time || '',
        checkOut: data.data.Check_out_time || '',
        cancellationPolicy: data.data.cancellationPolicy || '',
        houseRules: data.data.term
          ? [
              data.data.term.pets ? 'Pets allowed' : 'No pets allowed',
              data.data.term.smoking ? 'Smoking allowed' : 'No smoking',
              data.data.term.party ? 'Parties allowed' : 'No parties',
              data.data.term.children ? 'Children allowed' : 'No children',
              data.data.term.drinking ? 'Drinking allowed' : 'No drinking',
              `Maximum ${data.data.guest_no} guests`,
            ]
          : ['No pets allowed', 'Maximum 2 guests', 'No unregistered guests'],
        photos: data.data.photos || [{ url: 'https://placehold.co/600x400/png' }],
        dailyPrices: data.data.dailyPrices || [],
        guest_no: data.data.guest_no || '3',
        cleaningFee: data.data.cleaningFee || 0,
      }
    : null;

  const handleBackPress = () => {
    console.log('Attempting to go back...');
    if (router.canGoBack()) {
      console.log('Can go back, navigating...');
      router.back();
    } else {
      console.log('Cannot go back, redirecting to /property');
      router.replace('/property');
    }
  };

  const truncateDescription = (text, maxLength = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const initialDescription = property ? truncateDescription(property.description) : '';
  const fullDescription = property ? property.description : '';

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const firstPhoto = property?.photos?.[0]?.url || 'https://via.placeholder.com/150';
  const htmlContent = `
    <html>
      <body style="margin: 0; padding: 0;">
        <img src="${firstPhoto}" style="width: 100%; height: 100%; object-fit: cover;" />
      </body>
    </html>
  `;

  // Early returns for invalid ID, loading, and error states
  if (!isValidId) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500">Error: Invalid or missing property ID</Text>
      </View>
    );
  }

  if (isLoading || isUserLoading) {
    return <Text className="text-white text-center mt-10">Loading...</Text>;
  }

  if (error) {
    return <Text className="text-red-500 text-center mt-10">Error: {error.message}</Text>;
  }

  if (isUserError) {
    return <Text className="text-red-500 text-center mt-10">Error: Failed to load user data - {isUserError.message}</Text>;
  }

  if (!property) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500">Error: Property data not available</Text>
      </View>
    );
  }

  if (!userData?.data?.user) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500">Error: User data not available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View
        className="flex-row justify-between items-center px-4 py-3 bg-black"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="relative ml-2">
          <WebView
            source={{ html: htmlContent }}
            style={{ width: '100%', height: 192 }}
            javaScriptEnabled={false}
            scrollEnabled={false}
          />
          <View className="absolute top-4 left-4 bg-teal-500 px-3 py-1 rounded-md">
            <Text className="text-white font-medium">Premium Plus</Text>
          </View>
          <View className="absolute bottom-40 right-4 flex-row">
            <TouchableOpacity className="bg-white p-2 rounded-full mr-2">
              <Ionicons name="share-outline" size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white p-2 rounded-full">
              <Ionicons name="heart-outline" size={22} color="black" />
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-4 right-4">
            <TouchableOpacity className="bg-white px-2 py-2 rounded-lg flex-row items-center">
              <Ionicons name="grid" size={18} color="#555" />
              <Text className="ml-2 text-slate-700 font-medium">All photos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-2xl text-white font-bold mb-2">{property.title}</Text>
          <View className="flex-row items-center mb-2">
            <FontAwesome name="star" size={16} color="#00A699" />
            <Text className="ml-1 mr-2 font-medium text-slate-300">{property.rating}</Text>
            <Text className="text-slate-300">({property.reviews} reviews)</Text>
            {property.superhost && (
              <View className="ml-2 px-2 py-1 bg-blue-100 rounded-md">
                <Text className="text-blue-600 text-xs">Superhost</Text>
              </View>
            )}
          </View>
          <Text className="text-slate-200 mb-4">{property.location}</Text>

          <View className="border-t border-gray-200 my-3" />

          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="font-medium text-white">{property.guests} Guests</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-white">{property.bathrooms} Bathrooms</Text>
            </View>
            <View className="flex-1">
              <Text className="font-medium text-white">{property.roomType}</Text>
            </View>
          </View>

          <Text className="text-white mb-2">{isDescriptionExpanded ? fullDescription : initialDescription}</Text>
          <TouchableOpacity onPress={toggleDescription}>
            <Text className="text-blue-500 font-medium">
              {isDescriptionExpanded ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>

          <View className="border-t border-gray-200 my-6" />

          <Text className="text-xl font-bold mb-4 text-white">What this place offers</Text>
          {(property.amenities || []).slice(0, 6).map((amenity, index) => (
            <View key={index} className="flex-row items-center mb-4">
              <MaterialIcons
                name={
                  amenity.toLowerCase() === 'wifi'
                    ? 'wifi'
                    : amenity.toLowerCase() === 'air_conditioning'
                    ? 'ac-unit'
                    : amenity.toLowerCase() === 'parking'
                    ? 'local-parking'
                    : amenity.toLowerCase() === 'swimming_pool'
                    ? 'pool'
                    : amenity.toLowerCase() === 'hairdryer' || amenity.toLowerCase() === 'hair dryer'
                    ? 'dry'
                    : amenity.toLowerCase() === 'shampoo'
                    ? 'shampoo'
                    : 'check-circle'
                }
                size={22}
                color="white"
              />
              <Text className="ml-4 text-white">{amenity.replace('_', ' ')}</Text>
            </View>
          ))}
          <TouchableOpacity className="border border-gray-300 rounded-lg py-3 px-4 mb-6">
            <Text className="text-center font-medium text-white">
              Show all {property.totalAmenities} amenities
            </Text>
          </TouchableOpacity>

          <View className="border-t border-gray-200 my-3" />

          <Text className="text-xl font-bold mb-4 text-white">Property Policies</Text>
          <View className="bg-neutral-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={20} color="gray" />
              <Text className="font-bold ml-2 text-white">Check-in/Check-out Times</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-white">Check-in</Text>
                <Text className="font-medium text-white">{property.checkIn}</Text>
              </View>
              <View>
                <Text className="text-white">Check-out</Text>
                <Text className="font-medium text-white">{property.checkOut}</Text>
              </View>
            </View>
          </View>

          <View className="bg-neutral-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="alert-circle-outline" size={20} color="gray" />
              <Text className="font-bold ml-2 text-white">Cancellation Policy</Text>
            </View>
            <Text className="text-white mt-2">
              All bookings are final and non-refundable. No cancellations, modifications, or refunds will be accepted after reservation.
            </Text>
          </View>

          <View className="bg-neutral-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-outline" size={20} color="gray" />
              <Text className="font-bold ml-2 text-white">House Rules</Text>
            </View>
            {(property.houseRules || []).map((rule, index) => (
              <View key={index} className="flex-row mt-2">
                <Text className="text-white mr-2">•</Text>
                <Text className="text-white">{rule}</Text>
              </View>
            ))}
          </View>

          <View className="h-24" />
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-black border-t border-gray-200 px-4 py-3 flex-row justify-between items-center"
        style={{ paddingBottom: insets.bottom }}
      >
        <View>
          <Text className="text-lg font-bold text-white">
            {property.price}{' '}
            <Text className="font-normal text-gray-400">/ night</Text>
          </Text>
          <TouchableOpacity onPress={() => setShowCheckoutModal(true)}>
            <Text className="text-gray-400 underline">Add dates for total</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-teal-500 px-6 py-3 rounded-lg"
          onPress={() => setShowCheckoutModal(true)}
        >
          <Text className="text-white font-medium">Check availability</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal */}
      <CheckoutPage
        visible={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        propertyData={property}
        id={id}
        userId={userData.data.user._id}
        userName={userData.data.user.fullName || 'Guest'}
      />
    </SafeAreaView>
  );
};

export default SingleProperty;