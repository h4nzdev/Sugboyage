import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function BottomNavbar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const activeTab = state.routes[state.index].name;

  const tabs = [
    { id: "home", icon: "home" },
    { id: "discover", icon: "compass" },
    { id: "ai", icon: "message-circle" },
    { id: "trips", icon: "map" },
    { id: "flights", icon: "airplay" },
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
          shadowColor: "#06b6d4",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 10,
          borderWidth: 1,
          borderColor: "#cffafe",
        }}
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
                  isAITab ? "w-12 h-12" : "w-10 h-10"
                }`}
                style={{
                  backgroundColor: isActive
                    ? isAITab
                      ? "#06b6d4"
                      : "#f0fdff"
                    : isAITab
                      ? "#06b6d4"
                      : "transparent",
                }}
              >
                <Feather
                  name={tab.icon}
                  size={isAITab ? 22 : 20}
                  color={
                    isActive
                      ? isAITab
                        ? "#ffffff"
                        : "#06b6d4"
                      : isAITab
                        ? "#ffffff"
                        : "#64748b"
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default BottomNavbar;
