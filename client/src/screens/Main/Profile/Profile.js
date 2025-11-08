import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  // Colors matching your app theme
  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  // User stats based on docs - Social contributions
  const userStats = [
    { label: "Posts", value: "24", icon: "message-circle" },
    { label: "Likes", value: "156", icon: "heart" },
    { label: "Saved", value: "18", icon: "bookmark" },
    { label: "Spots", value: "32", icon: "map-pin" },
  ];

  // User's posts from Social Feed (based on docs)
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
    {
      id: 3,
      content:
        "Magellan's Cross is such an important historical site. Standing where Christianity was introduced to the Philippines was a moving experience. ✝️",
      location: "Magellan's Cross, Cebu City",
      likes: 31,
      comments: 3,
      timestamp: "2 weeks ago",
      image: "⛪",
    },
  ];

  // Saved itineraries from AI Planner (based on docs)
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
    {
      id: 3,
      title: "Food Tour Experience",
      duration: "1 day",
      spots: 5,
      created: "3 weeks ago",
    },
  ];

  // Settings options based on docs
  const settingsOptions = [
    {
      icon: "map-pin",
      label: "Radius Settings",
      description: "Adjust geofencing distance",
    },
    { icon: "bell", label: "Notifications", description: "Manage push alerts" },
    {
      icon: "user",
      label: "Account Details",
      description: "Update profile information",
    },
    { icon: "shield", label: "Privacy", description: "Control data sharing" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-black text-gray-900">My Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("settings")}
            className="p-2 bg-gray-100 rounded-xl"
          >
            <Feather name="settings" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Header */}
        <View className="bg-white px-5 py-6 mb-4">
          <View className="flex-row items-center mb-6">
            <View className="relative">
              <View className="w-20 h-20 bg-red-100 rounded-2xl items-center justify-center">
                <Feather name="user" size={32} color={colors.primary} />
              </View>
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full items-center justify-center border-2 border-white">
                <Feather name="check" size={12} color="white" />
              </View>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-black text-gray-900">
                Hanz Christian
              </Text>
              <Text className="text-red-600 text-sm font-semibold mt-1">
                🗺️ Cebu Explorer • 📱 Sugoyage User
              </Text>

              <View className="flex-row items-center mt-2">
                <View className="bg-red-50 px-3 py-1 rounded-full">
                  <Text className="text-red-700 text-sm font-semibold">
                    Community Contributor
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
            Settings & Preferences
          </Text>

          <View className="gap-2">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-4 bg-gray-50 rounded-xl"
              >
                <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
                  <Feather
                    name={option.icon}
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 text-sm">
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
    </SafeAreaView>
  );
}
