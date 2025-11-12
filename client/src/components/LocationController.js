import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export const LocationController = ({ onMove }) => {
  const handleMove = (direction) => {
    onMove(direction);
  };

  return (
    <View className="absolute bottom-24 right-4 z-20 bg-white rounded-3xl p-4 shadow-2xl">
      {/* Title */}
      <Text className="text-xs font-bold text-gray-600 mb-2 text-center">
        TEST CONTROLLER
      </Text>

      {/* Up Button */}
      <TouchableOpacity
        onPress={() => handleMove("up")}
        className="bg-blue-500 p-3 rounded-full mb-2 self-center"
      >
        <Feather name="arrow-up" size={20} color="white" />
      </TouchableOpacity>

      {/* Left, Center (placeholder), Right Row */}
      <View className="flex-row justify-center items-center gap-2 mb-2">
        <TouchableOpacity
          onPress={() => handleMove("left")}
          className="bg-blue-500 p-3 rounded-full"
        >
          <Feather name="arrow-left" size={20} color="white" />
        </TouchableOpacity>

        <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
          <Feather name="target" size={20} color="#666" />
        </View>

        <TouchableOpacity
          onPress={() => handleMove("right")}
          className="bg-blue-500 p-3 rounded-full"
        >
          <Feather name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Down Button */}
      <TouchableOpacity
        onPress={() => handleMove("down")}
        className="bg-blue-500 p-3 rounded-full self-center"
      >
        <Feather name="arrow-down" size={20} color="white" />
      </TouchableOpacity>

      {/* Info text */}
      <Text className="text-xs text-gray-500 mt-3 text-center">
        Move around to test{"\n"}geofence notifications
      </Text>
    </View>
  );
};
