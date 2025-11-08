import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function BottomNavbar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const activeTab = state.routes[state.index].name;

  // Updated tabs based on docs structure
  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "discover", icon: "compass", label: "Discover" },
    { id: "map", icon: "map", label: "Map" }, // 🗺️ Center position!
    { id: "social-feed", icon: "users", label: "Social" },
    { id: "travel-hub", icon: "briefcase", label: "TravelHub" },
  ];

  const handleTabPress = (tabName) => {
    const event = navigation.emit({
      type: "tabPress",
      target: tabName,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(tabName);
    }
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-3"
      style={{
        paddingBottom: insets.bottom + 10,
        backgroundColor: "transparent",
      }}
      pointerEvents="box-none"
    >
      <View
        className="flex-row bg-white rounded-full px-4 py-2"
        style={{
          elevation: 10,
          borderWidth: 1,
          borderColor: "#fecaca", // Light red border
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isPlannerTab = tab.id === "map";

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              className="flex-1 items-center justify-center"
            >
              <View
                className={`items-center justify-center rounded-full ${
                  isPlannerTab ? "w-12 h-12" : "w-10 h-10"
                }`}
                style={{
                  backgroundColor: isActive
                    ? isPlannerTab
                      ? "#DC143C"
                      : "#fef2f2"
                    : isPlannerTab
                      ? "#DC143C"
                      : "transparent",
                }}
              >
                <Feather
                  name={tab.icon}
                  size={isPlannerTab ? 22 : 20}
                  color={
                    isActive
                      ? isPlannerTab
                        ? "#FFFFFF"
                        : "#DC143C"
                      : isPlannerTab
                        ? "#FFFFFF"
                        : "#718096"
                  }
                />
              </View>
              {/* Optional: Add labels for better UX */}
              <Text
                className={`text-xs mt-1 ${
                  isActive ? "text-red-600 font-semibold" : "text-gray-500"
                }`}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default BottomNavbar;
