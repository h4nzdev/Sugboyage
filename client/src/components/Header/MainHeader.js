import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function MainHeader() {
  const navigation = useNavigation();

  return (
    <View className="px-5 pt-4 pb-3 bg-white border-b border-gray-200">
      <View className="flex-row justify-between items-center">
        {/* Location & User */}
        <View className="flex-row items-center">
          <View className="mr-3">
            <View className="flex-row items-center mb-1">
              <Feather name="map-pin" size={14} color="#DC143C" />
              <Text className="text-red-600 text-sm font-semibold ml-1">
                Cebu, Philippines
              </Text>
            </View>
            <Text className="text-gray-900 font-bold text-base">
              Hello Hanz! 👋
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-9 h-9 bg-red-50 rounded-xl items-center justify-center">
            <Feather name="compass" size={16} color="#DC143C" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("profile")}
            className="w-9 h-9 bg-red-600 rounded-xl items-center justify-center"
          >
            <Feather name="user" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
