"use client";

import { View, Text, TouchableOpacity } from "react-native";
import { memo } from "react";

const TRAVEL_MODES = [
  {
    value: "foot-walking",
    label: "Walking",
    color: "#10B981",
    description: "Best for short distances",
  },
  {
    value: "driving-car",
    label: "Driving",
    color: "#3B82F6",
    description: "Fastest route by car",
  },
  {
    value: "cycling-regular",
    label: "Cycling",
    color: "#8B5CF6",
    description: "Bike-friendly routes",
  },
  {
    value: "wheelchair",
    label: "WheelChair",
    color: "#8B5CF6",
    description: "Routes safe for wheelchair users",
  },
];

const TravelModeSelector = memo(({ travelMode, setTravelMode }) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-bold text-sm mb-2">Travel Mode</Text>
      <View className="flex-row gap-2">
        {TRAVEL_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            onPress={() => setTravelMode(mode.value)}
            className={`flex-1 items-center py-3 rounded-xl border ${
              travelMode === mode.value
                ? "border-gray-800 bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs font-bold mt-1 ${travelMode === mode.value ? "text-gray-900" : "text-gray-500"}`}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-gray-500 text-xs mt-2 text-center">
        {TRAVEL_MODES.find((mode) => mode.value === travelMode)?.description}
      </Text>
    </View>
  );
});

export default TravelModeSelector;
