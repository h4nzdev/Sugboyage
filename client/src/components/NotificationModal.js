import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";

export const NotificationModal = () => {
  const { lastNotification, setLastNotification } = useNotification();
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log("🔔 NotificationModal: lastNotification changed:", lastNotification);
    if (lastNotification) {
      console.log("✅ NotificationModal: Setting visible to true");
      setVisible(true);
      // Animate fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        console.log("⏱️  NotificationModal: Auto-closing after 5 seconds");
        closeNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [lastNotification]);

  const closeNotification = () => {
    console.log("❌ NotificationModal: Closing notification");
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setLastNotification(null);
    });
  };

  if (!lastNotification) {
    console.log("🚫 NotificationModal: No notification to display");
    return null;
  }

  const { request } = lastNotification;
  const content = request?.content || {};
  console.log("📋 NotificationModal: Rendering with content:", content);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={closeNotification}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View style={{ opacity: fadeAnim }}>
          <View className="bg-white rounded-2xl p-6 mx-4 max-w-md shadow-2xl">
            {/* Header */}
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <View className="bg-red-100 p-2 rounded-full mr-3">
                  <Feather name="map-pin" size={20} color="#DC143C" />
                </View>
                <Text className="text-lg font-bold text-gray-900 flex-1">
                  {content.title || "Notification"}
                </Text>
              </View>
              <TouchableOpacity onPress={closeNotification} className="p-1">
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <Text className="text-gray-600 text-base mb-4 leading-6">
              {content.body || ""}
            </Text>

            {/* Footer Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={closeNotification}
                className="flex-1 bg-gray-100 py-2 rounded-lg"
              >
                <Text className="text-center text-gray-700 font-medium">
                  Dismiss
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeNotification}
                className="flex-1 bg-red-500 py-2 rounded-lg"
              >
                <Text className="text-center text-white font-medium">
                  View Spot
                </Text>
              </TouchableOpacity>
            </View>

            {/* Debug Info (optional) */}
            {content.data?.spotId && (
              <Text className="text-gray-400 text-xs mt-3 text-center">
                Spot ID: {content.data.spotId}
              </Text>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
