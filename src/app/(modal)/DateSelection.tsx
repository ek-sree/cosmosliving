import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '@/src/features/useBookings';

const DateSelection = ({
  visible,
  onClose,
  onSelectDate,
  dailyPrices,
  selectedCheckIn,
  isSelectingCheckOut,
  id,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data, isLoading, error } = useBookings(id);

  // Compute disabled dates from bookings (move this before early returns)
  const disabledDates = useMemo(() => {
    const disabled = new Set();

    if (!data?.bookings) return disabled;

    data.bookings.forEach((booking) => {
      if (booking.status === 'Confirmed' || booking.status === 'Pending') {
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);

        let currentDate = new Date(checkIn);
        while (currentDate < checkOut) {
          const formattedDate = currentDate.toISOString().split('T')[0];
          disabled.add(formattedDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return disabled;
  }, [data]);

  // Compute markedDates using useMemo (move this before early returns)
  const markedDates = useMemo(() => {
    if (!dailyPrices || !Array.isArray(dailyPrices)) return {};

    const marked = dailyPrices.reduce((acc, { date, price }) => {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const isDisabled = disabledDates.has(formattedDate);

      acc[formattedDate] = {
        marked: true,
        disabled: isDisabled,
        customStyles: {
          container: {
            backgroundColor: isDisabled ? '#4B5563' : 'transparent',
          },
          text: {
            color: isDisabled ? '#9CA3AF' : 'white',
          },
        },
        price: price || 0,
      };
      return acc;
    }, {});

    if (selectedCheckIn && !disabledDates.has(selectedCheckIn)) {
      marked[selectedCheckIn] = {
        ...marked[selectedCheckIn],
        selected: true,
        disabled: false,
        customStyles: {
          container: { backgroundColor: isSelectingCheckOut ? 'red' : 'teal' },
          text: { color: 'white', fontWeight: 'bold' },
        },
      };
    }

    return marked;
  }, [dailyPrices, selectedCheckIn, isSelectingCheckOut, disabledDates]);

  // Handle loading and error states after all hooks are called
  if (isLoading) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <SafeAreaView className="flex-1 bg-black justify-center items-center">
          <ActivityIndicator size="large" color="#00cc00" />
          <Text className="text-white mt-4">Loading bookings...</Text>
        </SafeAreaView>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <SafeAreaView className="flex-1 bg-black justify-center items-center">
          <Text className="text-white">Error loading bookings: {error.message}</Text>
          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-teal-400">Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }

  const handleDayPress = (day) => {
    const { dateString } = day;
    const marking = markedDates[dateString] || {};

    if (marking.disabled) {
      return;
    }

    onSelectDate(dateString);
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
          <Text className="text-white text-lg font-bold">
            {isSelectingCheckOut ? 'Select check-out date' : 'Select check-in date'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 px-4 mb-4">
          {isSelectingCheckOut ? 'Pick your check-out' : 'Pick your check-in'}
        </Text>

        <Calendar
          current={currentMonth.toISOString().split('T')[0]}
          onMonthChange={(month) => setCurrentMonth(new Date(month.dateString))}
          markedDates={markedDates}
          markingType="custom"
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: 'black',
            calendarBackground: 'black',
            textSectionTitleColor: 'white',
            dayTextColor: 'white',
            monthTextColor: 'white',
            arrowColor: 'white',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          renderDay={(day, item) => {
            const dateString = day?.dateString;
            const marking = markedDates[dateString] || {};
            const price = marking.price || 0;
            const customStyles = marking.customStyles || {};
            const isSelected = marking.selected;
            const isDisabled = marking.disabled || false;

            return (
              <View className="items-center" style={customStyles.container}>
                <Text
                  className={`text-white ${isSelected ? 'font-bold' : ''} ${
                    isDisabled ? 'opacity-50' : ''
                  }`}
                  style={[
                    customStyles.text,
                    {
                      backgroundColor:
                        customStyles.container?.backgroundColor || 'transparent',
                      borderRadius: 15,
                      padding: 5,
                    },
                  ]}
                >
                  {day?.day}
                </Text>
                <Text className="text-teal-400 text-xs mt-1">
                  {price > 0 ? `${price} AED` : 'N/A'}
                </Text>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default DateSelection;