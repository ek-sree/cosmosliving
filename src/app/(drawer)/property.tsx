import PropertyListBar from '@/src/components/common/PropertyListBar';
import { useProperties } from '@/src/features/useProperties';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import WebView from 'react-native-webview';
import { LogBox } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function Property() {
  const [filters, setFilters] = useState({
    address: '',
    city: '',
    bedrooms: '',
    category: '',
    area: '',
    page: 1,
    limit: 5,
  });
  const [allProperties, setAllProperties] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  LogBox.ignoreAllLogs();

  const { data, isLoading, error } = useProperties(filters);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (data?.data?.properties) {
      setAllProperties((prev) =>
        filters.page === 1 ? data.data.properties : [...prev, ...data.data.properties]
      );
      setHasMore(filters.page < data.data.pagination.totalPages);
      setIsFetchingMore(false);
    }
  }, [data]);

  console.log("PR", data);

  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasMore || isLoading) return;
    setIsFetchingMore(true);
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  }, [isFetchingMore, hasMore, isLoading]);

  const truncateDescription = (description) => {
    const maxLength = 100;
    return description.length <= maxLength ? description : `${description.substring(0, maxLength)}...`;
  };

  const AnimatedCard = React.memo(({ property }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(1.05, { damping: 10, stiffness: 100 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    };

    const firstPhoto = property.photos?.[0]?.url || 'https://via.placeholder.com/150';

    const htmlContent = `
      <html>
        <body style="margin: 0; padding: 0;">
          <img src="${firstPhoto}" style="width: 100%; height: 100%; object-fit: cover;" />
        </body>
      </html>
    `;

    // Function to handle navigation
    const handleCardPress = () => {
      if (property._id) {
        router.push(`/listing/${property._id}`);
      } else {
        console.log("Error: Property ID is missing for navigation");
      }
    };

    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleCardPress} // Use onPress to navigate
        activeOpacity={1}
      >
        <Animated.View style={[animatedStyle]} className="mb-6 rounded-lg overflow-hidden">
          <View className="relative">
            <WebView
              source={{ html: htmlContent }}
              style={{ width: '100%', height: 192 }}
              javaScriptEnabled={false}
              scrollEnabled={false}
            />
            <View className="absolute top-4 right-4 bg-teal-400 px-3 py-1 rounded">
              <Text className="text-white font-medium text-sm">{property.property_type}</Text>
            </View>
          </View>
          <View className="p-4 bg-gray-900">
            <Text className="text-teal-400 text-xl font-medium mb-2">{property.title}</Text>
            <Text className="text-gray-400 text-sm">{truncateDescription(property.description)}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  });

  if (isLoading && filters.page === 1) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Loading properties...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-red-500">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <FlatList
        data={allProperties}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <AnimatedCard property={item} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingMore && <ActivityIndicator size="large" color="#00ff00" />
        }
      />
      <PropertyListBar />
    </View>
  );
}