import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";

function BottomNavbar({ state, navigation }) {
  // Get active tab from navigation state
  const activeTab = state.routes[state.index].name;

  const tabs = [
    { id: "home", icon: "home", label: "Home" },
    { id: "discover", icon: "compass", label: "Discover" },
    { id: "ai", icon: "message-circle", label: "AI" },
    { id: "trips", icon: "map", label: "Trips" },
    { id: "flights", icon: "airplay", label: "Flights" },
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
    <View className="flex-row bg-white border-t border-slate-200 px-2 py-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.id)}
            className="flex-1 items-center justify-center"
          >
            <Feather
              name={tab.icon}
              size={24}
              color={isActive ? "#0f766e" : "#64748b"}
            />
            <Text
              className={`text-xs mt-1 ${
                isActive ? "text-teal-700 font-semibold" : "text-slate-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default BottomNavbar;
