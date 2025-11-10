import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const EditProfileModal = ({ visible, onClose, user, onSave, loading }) => {
  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
    location: "",
    avatar: "👤",
  });

  // Use refs for inputs to prevent re-renders
  const displayNameRef = useRef(null);
  const bioRef = useRef(null);
  const locationRef = useRef(null);

  // Initialize edit data when modal opens
  useEffect(() => {
    if (user && visible) {
      setEditData({
        displayName: user.profile?.displayName || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        avatar: user.profile?.avatar || "👤",
      });
    }
  }, [user, visible]);

  // Reset refs when modal closes
  useEffect(() => {
    if (!visible) {
      // Clear any pending focus
      displayNameRef.current?.blur();
      bioRef.current?.blur();
      locationRef.current?.blur();
    }
  }, [visible]);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editData);
    console.log(editData)
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Modal Header */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} disabled={loading}>
            <Text className="text-gray-500 text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text
              className={`text-base font-semibold ${
                loading ? "text-gray-400" : "text-red-600"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5 py-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Selection */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-red-100 rounded-2xl items-center justify-center mb-4">
              <Text className="text-3xl">{editData.avatar}</Text>
            </View>
            <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-xl">
              <Text className="text-white text-sm font-semibold">
                Change Avatar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-sm">
                Display Name
              </Text>
              <TextInput
                ref={displayNameRef}
                value={editData.displayName}
                onChangeText={(value) =>
                  handleInputChange("displayName", value)
                }
                className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base"
                placeholder="Enter your display name"
                placeholderTextColor="#9CA3AF"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-sm">
                Bio
              </Text>
              <TextInput
                ref={bioRef}
                value={editData.bio}
                onChangeText={(value) => handleInputChange("bio", value)}
                className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base h-20"
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="sentences"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-sm">
                Location
              </Text>
              <TextInput
                ref={locationRef}
                value={editData.location}
                onChangeText={(value) => handleInputChange("location", value)}
                className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 text-gray-900 text-base"
                placeholder="Where are you from?"
                placeholderTextColor="#9CA3AF"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-sm">
                Email
              </Text>
              <View className="bg-gray-100 rounded-2xl px-4 py-3">
                <Text className="text-gray-500">{user?.email}</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-1">
                Email cannot be changed
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-sm">
                Username
              </Text>
              <View className="bg-gray-100 rounded-2xl px-4 py-3">
                <Text className="text-gray-500">{user?.username}</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-1">
                Username cannot be changed
              </Text>
            </View>
          </View>

          {/* Account Info */}
          <View className="bg-gray-50 rounded-2xl p-4 mt-6">
            <Text className="font-semibold text-gray-900 mb-2">
              Account Information
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm">Member since</Text>
                <Text className="text-gray-900 text-sm">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm">Last active</Text>
                <Text className="text-gray-900 text-sm">
                  {user?.lastActive
                    ? new Date(user.lastActive).toLocaleDateString()
                    : "Now"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm">Status</Text>
                <Text className="text-green-600 text-sm font-semibold">
                  {user?.isVerified ? "Verified" : "Unverified"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default EditProfileModal;
