import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationService } from "../../../services/authentication_services/authenticationService";
import EditProfileModal from "./EditProfileModal";
import { useAuth } from "../../../context/AuthenticationContext";

export default function Profile() {
  const navigation = useNavigation();
  const { user, updateProfile, logout } = useAuth();

  // Colors matching your app theme
  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
    location: "",
    avatar: "👤",
  });
  const [loading, setLoading] = useState(false);

  // Initialize edit data when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        displayName: user.profile?.displayName || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        avatar: user.profile?.avatar || "👤",
      });
    }
  }, [user]);

  // User stats based on actual user data
  const userStats = [
    {
      label: "Posts",
      value: user?.socialStats?.postsCount || "0",
      icon: "message-circle",
    },
    {
      label: "Followers",
      value: user?.socialStats?.followers || "0",
      icon: "users",
    },
    {
      label: "Following",
      value: user?.socialStats?.following || "0",
      icon: "user-plus",
    },
    { label: "Spots", value: "32", icon: "map-pin" },
  ];

  // Sample posts (would come from API in real app)
  const userPosts = [
    {
      id: 1,
      content:
        "Just visited Kawasan Falls! The turquoise waters are absolutely breathtaking. The canyoneering adventure was worth every moment! 💦",
      location: "Kawasan Falls, Badian",
      likes: 42,
      comments: 8,
      timestamp: "2 days ago",
      image: "🏞️",
    },
    {
      id: 2,
      content:
        "Cebu's lechon is everything they say and more! The crispy skin and flavorful meat at CNT is a must-try for every food lover. 🍖",
      location: "CNT Lechon, Mandaue",
      likes: 28,
      comments: 5,
      timestamp: "1 week ago",
      image: "🍽️",
    },
  ];

  // Sample itineraries
  const savedItineraries = [
    {
      id: 1,
      title: "Cebu Cultural Weekend",
      duration: "2 days",
      spots: 6,
      created: "1 week ago",
    },
    {
      id: 2,
      title: "Beach & Island Adventure",
      duration: "3 days",
      spots: 8,
      created: "2 weeks ago",
    },
  ];

  // Settings options
  const settingsOptions = [
    {
      icon: "user",
      label: "Edit Profile",
      description: "Update your personal information",
      onPress: () => setIsEditing(true),
    },
    {
      icon: "map-pin",
      label: "Radius Settings",
      description: "Adjust geofencing distance",
      onPress: () => navigation.navigate("Settings"),
    },
    {
      icon: "bell",
      label: "Notifications",
      description: "Manage push alerts",
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: "shield",
      label: "Privacy",
      description: "Control data sharing",
      onPress: () => navigation.navigate("Privacy"),
    },
    {
      icon: "log-out",
      label: "Logout",
      description: "Sign out of your account",
      onPress: handleLogout,
      color: "#DC143C",
    },
  ];

  async function handleSaveProfile() {
    if (!user) return;

    setLoading(true);
    try {
      console.log("🔄 Updating profile directly...");

      const result = await AuthenticationService.updateUserProfile(
        user._id,
        editData
      );

      if (result.success) {
        // Update local state directly
        setUser(result.user);
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
      } else {
        Alert.alert("Error", result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Save profile error:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.navigate("Login");
        },
      },
    ]);
  }

  function handleInputChange(field, value) {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-black text-gray-900">My Profile</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="edit-3" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Header */}
        <View className="bg-white px-5 py-6 mb-4">
          <View className="flex-row items-center mb-6">
            <View className="relative">
              <View className="w-20 h-20 bg-red-100 rounded-2xl items-center justify-center">
                <Text className="text-2xl">{user.profile?.avatar || "👤"}</Text>
              </View>
              {user.isVerified && (
                <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full items-center justify-center border-2 border-white">
                  <Feather name="check" size={12} color="white" />
                </View>
              )}
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-black text-gray-900">
                {user.profile?.displayName || user.username}
              </Text>
              <Text className="text-red-600 text-sm font-semibold mt-1">
                🗺️ {user.profile?.location || "Cebu Explorer"} • 📱 @
                {user.username}
              </Text>

              {user.profile?.bio ? (
                <Text className="text-gray-600 text-sm mt-2">
                  {user.profile.bio}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="mt-2"
                >
                  <Text className="text-gray-400 text-sm">Add a bio...</Text>
                </TouchableOpacity>
              )}

              <View className="flex-row items-center mt-2">
                <View className="bg-red-50 px-3 py-1 rounded-full">
                  <Text className="text-red-700 text-sm font-semibold">
                    {user.isVerified
                      ? "Verified Explorer"
                      : "Community Contributor"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Social Stats Grid */}
          <View className="bg-red-50 rounded-2xl p-4">
            <Text className="text-gray-900 font-bold text-center mb-3">
              Community Contributions
            </Text>
            <View className="flex-row justify-between">
              {userStats.map((stat, index) => (
                <View key={index} className="items-center flex-1">
                  <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mb-2">
                    <Feather
                      name={stat.icon}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <Text className="text-lg font-black text-gray-900">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-600 text-xs text-center">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* My Posts Section */}
        <View className="bg-white px-5 py-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-black text-gray-900">
                My Community Posts
              </Text>
              <Text className="text-gray-500 text-sm">
                Shared experiences and feedback
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-red-600 text-sm font-semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {userPosts.map((post) => (
              <View
                key={post.id}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-200"
              >
                <View className="flex-row items-start mb-3">
                  <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
                    <Text className="text-lg">{post.image}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-sm mb-1">
                      {post.location}
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      {post.timestamp}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-800 text-sm leading-5 mb-3">
                  {post.content}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center">
                      <Feather name="heart" size={14} color={colors.muted} />
                      <Text className="text-gray-500 text-sm ml-1">
                        {post.likes}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Feather
                        name="message-circle"
                        size={14}
                        color={colors.muted}
                      />
                      <Text className="text-gray-500 text-sm ml-1">
                        {post.comments}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Feather name="edit" size={16} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Saved Itineraries */}
        <View className="bg-white px-5 py-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-black text-gray-900">
                Saved Itineraries
              </Text>
              <Text className="text-gray-500 text-sm">
                AI-generated travel plans
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("ai")}>
              <Text className="text-red-600 text-sm font-semibold">
                Create New
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {savedItineraries.map((itinerary) => (
              <TouchableOpacity
                key={itinerary.id}
                className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-bold text-gray-900 text-base">
                    {itinerary.title}
                  </Text>
                  <View className="bg-red-50 px-2 py-1 rounded-full">
                    <Text className="text-red-700 text-xs font-semibold">
                      {itinerary.duration}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4 mb-3">
                  <View className="flex-row items-center">
                    <Feather name="map-pin" size={12} color={colors.muted} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {itinerary.spots} spots
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={12} color={colors.muted} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {itinerary.created}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity className="flex-1 bg-red-600 py-2 rounded-xl">
                    <Text className="text-white text-center text-sm font-semibold">
                      View Plan
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
                    <Feather name="share-2" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings & Preferences */}
        <View className="bg-white px-5 py-5 mb-4">
          <Text className="text-lg font-black text-gray-900 mb-4">
            Account Settings
          </Text>

          <View className="gap-2">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                className="flex-row items-center p-4 bg-gray-50 rounded-xl"
              >
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                    option.color ? "bg-red-100" : "bg-red-100"
                  }`}
                >
                  <Feather
                    name={option.icon}
                    size={18}
                    color={option.color || colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-sm ${
                      option.color ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {option.description}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-gray-500 text-sm">Sugoyage v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">
            The Smart Traveling Assistant for Cebu
          </Text>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={isEditing}
        onClose={() => setIsEditing(false)}
        user={user}
        onSave={handleSaveProfile}
        loading={loading}
      />
    </SafeAreaView>
  );
}
