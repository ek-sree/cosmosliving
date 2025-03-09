import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateSelection from './DateSelection';
import { useReserving } from '@/src/features/useReserve';

const CheckoutPage = ({ visible, onClose, propertyData, id, userId, userName }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const { mutate, isLoading, isError, error, isSuccess } = useReserving();

  const cleaningFee = propertyData?.cleaningFee || 0; // Use camelCase to match SingleProperty
  const serviceFee = 14;
  const vatRate = 0.05;
  const dtcmFeePerNight = 15;

  const dailyPrices = propertyData?.dailyPrices || [];

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setTotalNights(nights > 0 ? nights : 0);

      let total = 0;
      for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        const priceEntry = dailyPrices.find(
          (entry) => new Date(entry.date).toISOString().split('T')[0] === dateString
        );
        total += priceEntry?.price || 0;
      }
      setTotalPrice(total);
    } else {
      setTotalNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, dailyPrices]);

  const handleDateSelect = (date) => {
    if (!isSelectingCheckOut) {
      setCheckInDate(date);
      setIsSelectingCheckOut(true);
    } else {
      const checkIn = new Date(checkInDate);
      const selectedCheckOut = new Date(date);
      if (selectedCheckOut > checkIn) {
        setCheckOutDate(date);
        setShowDatePicker(false);
        setIsSelectingCheckOut(false);
      } else {
        alert('Check-out date must be after check-in date');
      }
    }
  };

  const openDatePicker = (isCheckOut = false) => {
    setIsSelectingCheckOut(isCheckOut);
    setShowDatePicker(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const vat = totalPrice * vatRate;
  const dtcmFee = totalNights * dtcmFeePerNight;
  const totalWithFees = totalPrice + cleaningFee + serviceFee + vat + dtcmFee;

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Error', 'Please select both check-in and check-out dates');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID is missing. Please log in again.');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Property ID is missing.');
      return;
    }

    // Prepare the reservation payload
    const credentials = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guest: userName || "Guest", // Fallback if userName is not provided
      manualPrice: totalWithFees,
      property: id,
      userId: userId,
    };

    // Trigger the mutation
    mutate(credentials, {
      onSuccess: (data) => {
        Alert.alert('Success', 'Reservation created successfully!');
        setCheckInDate(null); // Reset dates
        setCheckOutDate(null);
        onClose();
      },
      onError: (error) => {
        Alert.alert('Error', error.message || 'Failed to reserve property');
      },
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-row justify-between items-center p-4">
          <Text className="text-white text-xl font-bold">Your stay</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 px-4 mb-4">Select dates and guests</Text>

        <View className="p-4">
          <Text className="text-white text-lg font-semibold mb-2">Dates</Text>
          <View className="flex-row justify-between bg-neutral-800 rounded-lg p-4">
            <TouchableOpacity
              className="flex-1 mr-2 bg-gray-700 rounded-lg p-3"
              onPress={() => openDatePicker(false)}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="ml-2 text-white">{formatDate(checkInDate)}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 bg-gray-700 rounded-lg p-3"
              onPress={() => openDatePicker(true)}
              disabled={!checkInDate}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text className="ml-2 text-white">{formatDate(checkOutDate)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-white text-lg font-semibold mb-2">Guests</Text>
          <View className="flex-row justify-between items-center bg-neutral-800 rounded-lg p-4">
            <Text className="text-white">{guests} guest{guests > 1 ? 's' : ''}</Text>
            <View className="flex-row">
              <TouchableOpacity
                className="bg-gray-700 rounded-full p-2 mr-2"
                onPress={() => setGuests(guests > 1 ? guests - 1 : 1)}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-700 rounded-full p-2"
                onPress={() => setGuests(guests < propertyData.guest_no ? guests + 1 : guests)}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-white text-lg font-semibold mb-2">Price details</Text>
          <View className="bg-neutral-800 rounded-lg p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white">Price x {totalNights} night{totalNights !== 1 ? 's' : ''}</Text>
              <Text className="text-white">{totalPrice} AED</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-white">Cleaning fee</Text>
              <Text className="text-white">{cleaningFee} AED</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-white">Service fee</Text>
              <Text className="text-white">{serviceFee} AED</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-white">VAT (5%)</Text>
              <Text className="text-white">{vat.toFixed(0)} AED</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-white">DTCM fee ({totalNights} night{totalNights !== 1 ? 's' : ''} x 15 AED)</Text>
              <Text className="text-white">{dtcmFee} AED</Text>
            </View>
            
        {checkInDate && checkOutDate && (<View className="flex-row justify-between mt-2">
              <Text className="text-white text-2xl">Total </Text>
              <Text className="text-white">{totalWithFees} AED</Text>
            </View>)}
          </View>
        </View>

        <TouchableOpacity
          className="bg-teal-500 mx-4 py-4 rounded-lg"
          onPress={handleReserve}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold">
            {isLoading ? 'Reserving...' : 'Reserve NOW'}
          </Text>
        </TouchableOpacity>

        {checkInDate && checkOutDate && (
          <TouchableOpacity
            className="bg-teal-500 mx-4 py-4 rounded-lg mt-5"
            onPress={() => {
              if (!checkInDate || !checkOutDate) {
                Alert.alert('Error', 'Please select both check-in and check-out dates');
                return;
              }
              Alert.alert('PAY NOW', 'Payment functionality to be implemented');
            }}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold">PAY NOW</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      <DateSelection
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={handleDateSelect}
        dailyPrices={dailyPrices}
        selectedCheckIn={checkInDate}
        isSelectingCheckOut={isSelectingCheckOut}
        id={id}
      />
    </Modal>
  );
};

export default CheckoutPage;