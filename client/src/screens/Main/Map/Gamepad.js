// components/Gamepad.js
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const Gamepad = ({ onMove, visible }) => {
  if (!visible) return null;

  const moveUser = (direction) => {
    // This will simulate movement in the specified direction
    onMove(direction);
  };

  return (
    <View className="absolute bottom-24 right-4 z-20">
      <View className="bg-white/90 rounded-2xl p-3 shadow-lg">
        {/* Up Button */}
        <TouchableOpacity
          onPress={() => moveUser("up")}
          className="w-12 h-12 items-center justify-center mb-1"
        >
          <Feather name="arrow-up" size={24} color="#DC143C" />
        </TouchableOpacity>

        {/* Middle Row */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => moveUser("left")}
            className="w-12 h-12 items-center justify-center"
          >
            <Feather name="arrow-left" size={24} color="#DC143C" />
          </TouchableOpacity>

          <View className="w-12 h-12 items-center justify-center">
            <Feather name="circle" size={20} color="#666" />
          </View>

          <TouchableOpacity
            onPress={() => moveUser("right")}
            className="w-12 h-12 items-center justify-center"
          >
            <Feather name="arrow-right" size={24} color="#DC143C" />
          </TouchableOpacity>
        </View>

        {/* Down Button */}
        <TouchableOpacity
          onPress={() => moveUser("down")}
          className="w-12 h-12 items-center justify-center mt-1"
        >
          <Feather name="arrow-down" size={24} color="#DC143C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Gamepad;
