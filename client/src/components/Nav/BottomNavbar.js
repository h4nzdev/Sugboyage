import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // ← ADD THIS

function BottomNavbar({ state, navigation }) {
  const insets = useSafeAreaInsets(); // ← ADD THIS

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
    <View
      className="flex-row bg-white border-t border-slate-200 px-2 py-3"
      style={{ paddingBottom: insets.bottom }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isAITab = tab.id === "ai";

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.id)}
            className="flex-1 items-center justify-center"
          >
            <View
              className={`items-center justify-center rounded-full ${
                isAITab
                  ? !isActive
                    ? "bg-teal-600 w-12 h-12 rounded-full"
                    : ""
                  : isActive
                    ? "bg-teal-50 w-10 h-10"
                    : "w-10 h-10"
              }`}
            >
              <Feather
                name={tab.icon}
                size={isAITab ? 26 : 24}
                color={
                  isAITab
                    ? !isActive
                      ? "#ffff"
                      : ""
                    : isActive
                      ? "#0f766e"
                      : "#64748b"
                }
              />
            </View>
            <Text
              className={`text-xs mt-1 ${
                isActive ? "text-teal-700 font-semibold" : "text-slate-500"
              } ${isAITab ? "font-bold" : ""}`}
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
