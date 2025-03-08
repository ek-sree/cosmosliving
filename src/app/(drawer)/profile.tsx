import React, { useState } from 'react';
import { Image, TouchableOpacity, View, Alert } from 'react-native';
import { ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropertyListBar from '@/src/components/common/PropertyListBar';
import BookingHistoryComponent from '@/src/components/ui/BookingHistoryComponent';
import BookingProfileComponent from '@/src/components/ui/BookingProfileComponent';
import SavedPropertyComponent from '@/src/components/ui/SavedPropertyComponent';
import { useUserDetails } from '@/src/features/useUserDetails';
import { useEditUserDetails } from '@/src/features/useEditUserDetails'; 
import ProfileEditModal from '../(modal)/ProfileEditModal';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/src/lib/constants';
import { transformBookingHistory, transformBookings, transformSavedProperties } from '@/src/utils/transformers';

interface User {
  fullName?: string;
  email?: string;
  location?: string;
  profileImg?: string;
  createdAt?: string;
}

interface WatchlistItem {
  photos?: { url: string }[];
  title?: string;
  address?: { address: string };
  city?: string;
  price?: number;
}

interface BookingItem {
  property?: {
    photos?: { url: string }[];
    title?: string;
    city?: string;
    country?: string;
    address?: { address: string };
  };
  status?: string;
  checkIn?: string;
  checkOut?: string;
  guest?: string;
  rent?: number;
}

interface Bookings {
  pending: BookingItem[];
  completed: BookingItem[];
  ConfirmedBookings: BookingItem[];
}

interface UserDetailsResponse {
  data: {
    user: User;
    watchlist: WatchlistItem[];
    bookings: Bookings;
  };
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'history'>('bookings');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useUserDetails() as {data?: UserDetailsResponse; isLoading: boolean; error: Error | null}; 
  const { mutate: editUserDetails, isPending } = useEditUserDetails();

  const queryClient = useQueryClient();

  const renderTabContent = () => {
    const transformedSaved = transformSavedProperties(data?.data?.watchlist);
    const transformedBookings = transformBookings(data?.data?.bookings);
    const transformedBookingHistory = transformBookingHistory(data?.data?.bookings?.completed);

    switch (activeTab) {
      case 'bookings':
        return <BookingProfileComponent bookings={transformedBookings} />;
      case 'saved':
        return <SavedPropertyComponent savedProperties={transformedSaved} />;
      case 'history':
        return <BookingHistoryComponent history={transformedBookingHistory}/>;
      default:
        return <BookingProfileComponent bookings={transformedBookings} />;
    }
  };

  const handleSaveProfile = (updatedData: Partial<User>) => {
    editUserDetails(updatedData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERDETAIL] });
      },
      onError: (error: Error) => {
        Alert.alert('Error', error.message || 'Failed to update profile');
      },
    });
  };

  if (isLoading) return <Text className="text-white">Loading...</Text>;
  if (error) return <Text className="text-red-500">Error: {error.message}</Text>;

  const user = data?.data?.user || {};
  const watchlist = data?.data?.watchlist || [];
  const bookings = data?.data?.bookings || { pending: [], completed: [] };

  const initials = user.fullName
    ? user.fullName.split(' ').map(word => word[0]).join('').slice(0, 2)
    : 'NA';

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="items-center pt-6 pb-4">
        {user.profileImg ? (
          <Image
            source={{ uri: user.profileImg }}
            className="w-24 h-24 rounded-full mb-4"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-800 items-center justify-center mb-4">
            <Text className="text-white text-xl font-bold">{initials}</Text>
          </View>
        )}
        <Text className="text-white text-2xl font-bold mb-1">{user.fullName || 'N/A'}</Text>
        <Text className="text-gray-400 mb-2">
          Member since {new Date(user.createdAt || '').getFullYear() || 'N/A'}
        </Text>
        <View className="flex-row items-center mb-4">
          <Ionicons name="location-outline" size={18} color="gray" />
          <Text className="text-gray-400 ml-1">{user.location || 'NA'}</Text>
        </View>
        <TouchableOpacity
          className="bg-teal-400 py-2 px-6 rounded-md flex-row items-center"
          onPress={() => setIsModalOpen(true)}
        >
          <Ionicons name="settings-outline" size={18} color="white" />
          <Text className="text-white ml-2">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Properties */}
      <View className="border-t border-gray-800 py-4">
        <View className="items-center">
          <Text className="text-gray-400 mb-2">Saved Properties</Text>
          <View className="flex-row items-center">
            <Ionicons name="heart" size={18} color="red" />
            <Text className="text-white text-2xl ml-2">{watchlist.length}</Text>
          </View>
        </View>
      </View>

      {/* Active Bookings */}
      <View className="border-t border-gray-800 py-4">
        <View className="items-center">
          <Text className="text-gray-400 mb-2">Active Bookings</Text>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color="white" />
            <Text className="text-white text-2xl ml-2">{bookings.pending.length}</Text>
          </View>
        </View>
      </View>

      {/* Past Stays */}
      <View className="border-t border-gray-800 py-4">
        <View className="items-center">
          <Text className="text-gray-400 mb-2">Past Stays</Text>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={18} color="white" />
            <Text className="text-white text-2xl ml-2">{bookings.completed.length}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-t border-gray-800 mt-3">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'bookings' ? 'bg-teal-400' : ''}`}
          onPress={() => setActiveTab('bookings')}
        >
          <Text className={`${activeTab === 'bookings' ? 'text-white' : 'text-gray-400'}`}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'saved' ? 'bg-teal-400' : ''}`}
          onPress={() => setActiveTab('saved')}
        >
          <Text className={`${activeTab === 'saved' ? 'text-white' : 'text-gray-400'}`}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'history' ? 'bg-teal-400' : ''}`}
          onPress={() => setActiveTab('history')}
        >
          <Text className={`${activeTab === 'history' ? 'text-white' : 'text-gray-400'}`}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Account Details */}
      <View className="pt-4 px-4 border-t border-gray-800 bg-neutral-800 py-5 mb-5">
        <Text className="text-white text-xl font-bold mb-5">Account Details</Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="mail-outline" size={18} color="white" />
          <Text className="text-white ml-2">{user.email || 'N/A'}</Text>
        </View>
        <Text className="text-green-500 ml-6">Email Verified</Text>
      </View>

      <PropertyListBar />
      <View className="h-16" />

      <ProfileEditModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={user}
        onSave={handleSaveProfile}
      />
    </ScrollView>
  );
}