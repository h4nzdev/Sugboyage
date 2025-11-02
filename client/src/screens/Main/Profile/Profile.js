import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  // User travel stats - Core to SugVoyage!
  const userStats = [
    { label: "Trips", value: "12", icon: "map", color: "#3b82f6" },
    { label: "Places", value: "28", icon: "check-circle", color: "#10b981" },
    { label: "Badges", value: "8", icon: "award", color: "#f59e0b" },
    { label: "Days", value: "45", icon: "calendar", color: "#8b5cf6" },
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
      color: "#10b981",
    },
    {
      type: "planned",
      place: "Bantayan Island Trip",
      date: "2 days ago",
      icon: "map",
      color: "#3b82f6",
    },
    {
      type: "identified",
      place: "Temple of Leah",
      date: "3 days ago",
      icon: "camera",
      color: "#8b5cf6",
    },
    {
      type: "shared",
      place: "Kawasan Falls Experience",
      date: "1 week ago",
      icon: "share-2",
      color: "#f59e0b",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Clean Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">My Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("settings")}
            className="p-2"
          >
            <Feather name="settings" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Header - Focus on Travel Identity */}
        <View className="bg-white px-5 py-6 mb-4">
          <View className="flex-row items-center mb-6">
            <View className="relative">
              <Image
                source={{
                  uri: "https://res.cloudinary.com/dgnxxyzve/image/upload/v1759290464/medora_uploads/patientPicture-1759290464276.jpg",
                }}
                className="w-20 h-20 rounded-2xl"
              />
              <View className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full items-center justify-center border-2 border-white">
                <Feather name="map-pin" size={10} color="#FFFFFF" />
              </View>
            </View>

            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-900">
                Hanz Christian Angelo
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                🗺️ Exploring Cebu • 🌴 45 days in paradise
              </Text>

              <View className="flex-row items-center mt-2">
                <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
                  <Feather name="award" size={14} color="#3b82f6" />
                  <Text className="text-blue-700 text-sm font-medium ml-1">
                    Cebu Expert Level 3
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid - Clean & Travel-focused */}
          <View className="flex-row justify-between bg-gray-50 rounded-2xl p-4">
            {userStats.map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Feather name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  {stat.value}
                </Text>
                <Text className="text-gray-500 text-xs text-center">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cebu Achievements - Core Feature! */}
        <View className="bg-white px-5 py-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Cebu Achievements
              </Text>
              <Text className="text-gray-500 text-sm">
                Unlock badges by exploring Cebu
              </Text>
            </View>
            <TouchableOpacity className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-700 text-sm font-medium">
                {cebuAchievements.filter((a) => a.earned).length}/
                {cebuAchievements.length}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {cebuAchievements.map((achievement, index) => (
              <View key={index} className="w-[48%] mb-4">
                <View
                  className={`p-4 rounded-2xl ${
                    achievement.earned
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-gray-50"
                  }`}
                >
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center mb-3 ${
                      achievement.earned ? "bg-yellow-100" : "bg-gray-200"
                    }`}
                  >
                    <Feather
                      name={achievement.icon}
                      size={20}
                      color={achievement.earned ? "#f59e0b" : "#9ca3af"}
                    />
                  </View>
                  <Text
                    className={`font-bold text-sm mb-1 ${
                      achievement.earned ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {achievement.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mb-2">
                    {achievement.description}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-xs font-medium ${
                        achievement.earned ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {achievement.progress}
                    </Text>
                    {achievement.earned ? (
                      <Feather name="check-circle" size={14} color="#10b981" />
                    ) : (
                      <Feather name="lock" size={14} color="#9ca3af" />
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
              <Text className="text-lg font-bold text-gray-900">
                Recent Adventures
              </Text>
              <Text className="text-gray-500 text-sm">
                Your Cebu journey highlights
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-blue-500 text-sm font-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {recentActivities.map((activity, index) => (
              <View
                key={index}
                className="flex-row items-center bg-gray-50 rounded-2xl p-4"
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: `${activity.color}15` }}
                >
                  <Feather
                    name={activity.icon}
                    size={18}
                    color={activity.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">
                    {activity.place}
                  </Text>
                  <Text className="text-gray-500 text-sm">{activity.date}</Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    activity.type === "visited"
                      ? "bg-green-100"
                      : activity.type === "planned"
                        ? "bg-blue-100"
                        : activity.type === "identified"
                          ? "bg-purple-100"
                          : "bg-yellow-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      activity.type === "visited"
                        ? "text-green-800"
                        : activity.type === "planned"
                          ? "text-blue-800"
                          : activity.type === "identified"
                            ? "text-purple-800"
                            : "text-yellow-800"
                    }`}
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
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              { icon: "edit-3", label: "Edit Profile", color: "#3b82f6" },
              { icon: "share-2", label: "Share Story", color: "#f59e0b" },
              { icon: "map", label: "My Trips", color: "#10b981" },
              { icon: "camera", label: "Travel Photos", color: "#8b5cf6" },
            ].map((action, index) => (
              <TouchableOpacity key={index} className="w-[48%] mb-3">
                <View className="flex-row items-center bg-gray-50 rounded-2xl p-4">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <Feather
                      name={action.icon}
                      size={18}
                      color={action.color}
                    />
                  </View>
                  <Text className="text-gray-900 font-medium text-sm">
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Version */}
        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm">SugVoyage v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Exploring Cebu, One Adventure at a Time 🌴
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
