import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  const colors = {
    primary: "#06b6d4",
    secondary: "#22d3ee",
    accent: "#67e8f9",
    light: "#f0fdff",
    background: "#ffffff",
    border: "#cffafe",
    text: "#164e63",
    muted: "#0e7490",
  };

  // User travel stats
  const userStats = [
    { label: "Trips", value: "12", icon: "map" },
    { label: "Places", value: "28", icon: "check-circle" },
    { label: "Badges", value: "8", icon: "award" },
    { label: "Days", value: "45", icon: "calendar" },
  ];

  // Cebu-specific achievements
  const cebuAchievements = [
    {
      name: "Cebu Explorer",
      icon: "compass",
      earned: true,
      description: "Visited 10+ Cebu landmarks",
      progress: "12/10",
    },
    {
      name: "Lechon Lover",
      icon: "coffee",
      earned: true,
      description: "Tried authentic Cebu lechon",
      progress: "Complete",
    },
    {
      name: "Island Hopper",
      icon: "umbrella",
      earned: true,
      description: "Visited 3 Cebu islands",
      progress: "4/3",
    },
    {
      name: "Heritage Seeker",
      icon: "book",
      earned: false,
      description: "Explore 5 historical sites",
      progress: "3/5",
    },
    {
      name: "Waterfall Chaser",
      icon: "trending-up",
      earned: true,
      description: "Visited Kawasan Falls",
      progress: "Complete",
    },
    {
      name: "Local Expert",
      icon: "star",
      earned: false,
      description: "Complete all Cebu challenges",
      progress: "5/8",
    },
  ];

  // Recent Cebu activities
  const recentActivities = [
    {
      type: "visited",
      place: "Magellan's Cross",
      date: "Yesterday",
      icon: "check-circle",
    },
    {
      type: "planned",
      place: "Bantayan Island Trip",
      date: "2 days ago",
      icon: "map",
    },
    {
      type: "identified",
      place: "Temple of Leah",
      date: "3 days ago",
      icon: "camera",
    },
    {
      type: "shared",
      place: "Kawasan Falls Experience",
      date: "1 week ago",
      icon: "share-2",
    },
  ];

  const quickActions = [
    { icon: "edit-3", label: "Edit Profile" },
    { icon: "share-2", label: "Share Story" },
    { icon: "map", label: "My Trips" },
    { icon: "camera", label: "Travel Photos" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Clean Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            My Profile
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("settings")}
            className="p-2"
          >
            <Feather name="settings" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Header */}
        <View className="bg-white px-5 py-6 mb-4">
          <View className="flex-row items-center mb-6">
            <View className="relative">
              <Image
                source={{
                  uri: "https://res.cloudinary.com/dgnxxyzve/image/upload/v1759290464/medora_uploads/patientPicture-1759290464276.jpg",
                }}
                className="w-20 h-20 rounded-2xl"
              />
              <View
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white"
                style={{ backgroundColor: colors.primary }}
              >
                <Feather name="map-pin" size={10} color="#FFFFFF" />
              </View>
            </View>

            <View className="ml-4 flex-1">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                Hanz Christian Angelo
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                🗺️ Exploring Cebu • 🌴 45 days in paradise
              </Text>

              <View className="flex-row items-center mt-2">
                <View
                  className="flex-row items-center px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.light }}
                >
                  <Feather name="award" size={14} color={colors.primary} />
                  <Text
                    className="text-sm font-medium ml-1"
                    style={{ color: colors.primary }}
                  >
                    Cebu Expert Level 3
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View
            className="flex-row justify-between rounded-xl p-4"
            style={{ backgroundColor: colors.light }}
          >
            {userStats.map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mb-2"
                  style={{ backgroundColor: colors.background }}
                >
                  <Feather name={stat.icon} size={20} color={colors.primary} />
                </View>
                <Text
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  {stat.value}
                </Text>
                <Text
                  className="text-xs text-center"
                  style={{ color: colors.muted }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cebu Achievements */}
        <View className="bg-white px-5 py-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                Cebu Achievements
              </Text>
              <Text className="text-sm" style={{ color: colors.muted }}>
                Unlock badges by exploring Cebu
              </Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.light }}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {cebuAchievements.filter((a) => a.earned).length}/
                {cebuAchievements.length}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {cebuAchievements.map((achievement, index) => (
              <View key={index} className="w-[48%] mb-4">
                <View
                  className={`p-4 rounded-xl border ${
                    achievement.earned ? "border-cyan-200" : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: achievement.earned
                      ? colors.light
                      : "#f9fafb",
                  }}
                >
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center mb-3 ${
                      achievement.earned ? "bg-cyan-100" : "bg-gray-100"
                    }`}
                  >
                    <Feather
                      name={achievement.icon}
                      size={20}
                      color={achievement.earned ? colors.primary : colors.muted}
                    />
                  </View>
                  <Text
                    className={`font-bold text-sm mb-1 ${
                      achievement.earned ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {achievement.name}
                  </Text>
                  <Text
                    className="text-xs mb-2"
                    style={{ color: colors.muted }}
                  >
                    {achievement.description}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-xs font-medium ${
                        achievement.earned ? "text-cyan-600" : "text-gray-400"
                      }`}
                    >
                      {achievement.progress}
                    </Text>
                    {achievement.earned ? (
                      <Feather
                        name="check-circle"
                        size={14}
                        color={colors.primary}
                      />
                    ) : (
                      <Feather name="lock" size={14} color={colors.muted} />
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Cebu Adventures */}
        <View className="bg-white px-5 py-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                Recent Adventures
              </Text>
              <Text className="text-sm" style={{ color: colors.muted }}>
                Your Cebu journey highlights
              </Text>
            </View>
            <TouchableOpacity>
              <Text
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {recentActivities.map((activity, index) => (
              <View
                key={index}
                className="flex-row items-center rounded-xl p-4"
                style={{ backgroundColor: colors.light }}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.background }}
                >
                  <Feather
                    name={activity.icon}
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-medium" style={{ color: colors.text }}>
                    {activity.place}
                  </Text>
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    {activity.date}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.background }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.text }}
                  >
                    {activity.type}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white px-5 py-5 mb-4">
          <Text
            className="text-lg font-bold mb-4"
            style={{ color: colors.text }}
          >
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} className="w-[48%] mb-3">
                <View
                  className="flex-row items-center rounded-xl p-4"
                  style={{ backgroundColor: colors.light }}
                >
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: colors.background }}
                  >
                    <Feather
                      name={action.icon}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <Text
                    className="font-medium text-sm"
                    style={{ color: colors.text }}
                  >
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Version */}
        <View className="items-center py-6">
          <Text className="text-sm" style={{ color: colors.muted }}>
            SugVoyage v1.0.0
          </Text>
          <Text className="text-xs mt-1" style={{ color: colors.muted }}>
            Exploring Cebu, One Adventure at a Time 🌴
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
