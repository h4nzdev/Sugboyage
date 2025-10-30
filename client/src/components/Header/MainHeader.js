import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function MainHeader() {
  return (
    <View className="px-5 pt-3 pb-4">
      <View className="flex-row justify-between items-center mb-1">
        <View>
          <Text className="text-2xl font-black text-gray-900">SugVoyage</Text>
          <Text className="text-emerald-600 text-sm font-medium">
            Cebu Travel Companion
          </Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
            <Feather name="search" size={20} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
            <Feather name="user" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-gray-500 text-sm">Discover Cebu's hidden gems</Text>
    </View>
  );
}
