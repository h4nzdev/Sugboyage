import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function MainHeader() {
  const navigation = useNavigation();

  return (
    <View
      className="px-4 py-3 rounded-2xl mx-4 mt-2"
      style={{ backgroundColor: "#06b6d4" }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-white mr-3 items-center justify-center">
            <Feather name="user" size={16} color="#06b6d4" />
          </View>
          <View>
            <Text className="text-white text-sm font-semibold">
              Welcome back!
            </Text>
            <Text className="text-white text-xs opacity-90">Hanz</Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="w-7 h-7 items-center justify-center">
            <Feather name="bell" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-7 h-7 items-center justify-center">
            <Feather name="search" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("profile")}
            className="w-7 h-7 items-center justify-center"
          >
            <Feather name="menu" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
