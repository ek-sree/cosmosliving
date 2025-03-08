import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ProfileEditModal = ({ visible, onClose, userData, onSave }) => {
  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [location, setLocation] = useState(userData?.location || '');
  const [profileImage, setProfileImage] = useState(userData?.profileImg || null);
  const [loading, setLoading] = useState(false);

  const handleChooseFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const file = result.assets[0];
        console.log('Selected file:', file); 
        const cloudinaryUrl = await uploadImageToCloudinary(file);
        setProfileImage(cloudinaryUrl);
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image. Please try again.');
        console.error('Image upload error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    const fileUri = Platform.OS === 'android' && !file.uri.startsWith('file://') 
      ? `file://${file.uri}` 
      : file.uri;
  
    data.append('file', {
      uri: fileUri,
      type: file.mimeType || 'image/jpeg', // Use mimeType instead of type
      name: file.fileName || `profile_image_${Date.now()}.jpg`,
    });
    data.append('upload_preset', 'chat-app');
  
    console.log('FormData:', [...data]);
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dbqdqof8u/image/upload', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
  
      const responseText = await response.text(); 
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);
  
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}: ${responseText}`);
      }
  
      const result = JSON.parse(responseText); 
      if (result.secure_url) {
        console.log('Cloudinary upload success:', result.secure_url);
        return result.secure_url;
      } else {
        throw new Error('Image upload failed: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        fullName,
        email,
        phone,
        location,
        image: profileImage,
        profileImg: profileImage,
      };

      console.log('Saving profile data:', updatedData);
      await onSave(updatedData);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 bg-black bg-opacity-95">
          <View className="flex-1 px-4">
            <View className="flex-row justify-between items-center py-4 border-b border-gray-800">
              <Text className="text-white text-xl font-bold text-center flex-1">Edit Profile</Text>
              <TouchableOpacity onPress={onClose} className="absolute right-0">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-center mt-2 mb-6">
              Update your profile information below.
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-white mb-2">
                  Full Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="bg-black border border-gray-700 rounded-lg text-white p-3"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666"
                />
              </View>

              <View>
                <Text className="text-white mb-2">
                  Email <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="bg-black border border-gray-700 rounded-lg text-white p-3"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-white mb-2">
                  Phone <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="bg-black border border-gray-700 rounded-lg text-white p-3"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text className="text-white mb-2">Location</Text>
                <TextInput
                  className="bg-black border border-gray-700 rounded-lg text-white p-3"
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  placeholderTextColor="#666"
                />
              </View>

              <View>
                <Text className="text-white mb-2">Profile Image</Text>
                {profileImage && (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-24 h-24 rounded-full mb-2"
                    resizeMode="cover"
                  />
                )}
                <TouchableOpacity
                  className="bg-black border border-gray-700 rounded-lg p-3 flex-row items-center"
                  onPress={handleChooseFile}
                  disabled={loading}
                >
                  <Text className="text-white mr-2">
                    {loading ? 'Uploading...' : 'Choose File'}
                  </Text>
                  <Text className="text-gray-400 flex-1" numberOfLines={1}>
                    {profileImage ? 'Image selected' : 'No file chosen'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-end space-x-3 mt-8">
              <TouchableOpacity
                className="border border-gray-600 rounded-lg py-3 px-5"
                onPress={onClose}
                disabled={loading}
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-teal-400 rounded-lg py-3 px-5 ${loading ? 'opacity-50' : ''}`}
                onPress={handleSave}
                disabled={loading}
              >
                <Text className="text-white">{loading ? 'Saving...' : 'Save Changes'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileEditModal;