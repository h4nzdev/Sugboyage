import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const navigation = useNavigation();

  // Travel-specific settings
  const [notifications, setNotifications] = useState({
    nearbyAlerts: true,
    dealNotifications: true,
    flightUpdates: true,
    communityActivity: false,
  });

  const [privacy, setPrivacy] = useState({
    locationSharing: true,
    showVisitedPlaces: true,
    profileVisibility: "public", // public, friends, private
    dataCollection: true,
  });

  const [preferences, setPreferences] = useState({
    temperatureUnit: "celsius", // celsius, fahrenheit
    distanceUnit: "km", // km, miles
    currency: "PHP", // PHP, USD, etc.
    language: "English",
  });

  const [aiFeatures, setAiFeatures] = useState({
    smartRecommendations: true,
    photoRecognition: true,
    itineraryOptimization: true,
    personalizedDeals: true,
  });

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => console.log("Sign out pressed"),
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear Travel Data",
      "This will remove all your saved trips, visited places, and preferences. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: () => console.log("Clear data pressed"),
        },
      ]
    );
  };

  const NotificationSection = () => (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-3">
          <Feather name="bell" size={20} color="#3b82f6" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">Notifications</Text>
          <Text className="text-gray-500 text-sm">
            Manage your travel alerts
          </Text>
        </View>
      </View>

      {[
        {
          label: "Nearby Spot Alerts",
          value: notifications.nearbyAlerts,
          onValueChange: (value) =>
            setNotifications((prev) => ({ ...prev, nearbyAlerts: value })),
          description: "Get notified when near Cebu attractions",
        },
        {
          label: "Deal & Promotion Alerts",
          value: notifications.dealNotifications,
          onValueChange: (value) =>
            setNotifications((prev) => ({ ...prev, dealNotifications: value })),
          description: "Local discounts and offers",
        },
        {
          label: "Flight Schedule Updates",
          value: notifications.flightUpdates,
          onValueChange: (value) =>
            setNotifications((prev) => ({ ...prev, flightUpdates: value })),
          description: "Flight changes and reminders",
        },
        {
          label: "Community Activity",
          value: notifications.communityActivity,
          onValueChange: (value) =>
            setNotifications((prev) => ({ ...prev, communityActivity: value })),
          description: "Friends' travel updates",
        },
      ].map((item, index) => (
        <View
          key={index}
          className={`py-4 ${index !== 3 ? "border-b border-gray-100" : ""}`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">{item.label}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {item.description}
              </Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#f3f4f6", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      ))}
    </View>
  );

  const PrivacySection = () => (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-3">
          <Feather name="shield" size={20} color="#10b981" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">
            Privacy & Location
          </Text>
          <Text className="text-gray-500 text-sm">
            Control your travel data
          </Text>
        </View>
      </View>

      {[
        {
          label: "Location Sharing",
          value: privacy.locationSharing,
          onValueChange: (value) =>
            setPrivacy((prev) => ({ ...prev, locationSharing: value })),
          description: "Share location for nearby recommendations",
        },
        {
          label: "Show Visited Places",
          value: privacy.showVisitedPlaces,
          onValueChange: (value) =>
            setPrivacy((prev) => ({ ...prev, showVisitedPlaces: value })),
          description: "Display visited spots on your profile",
        },
        {
          label: "Data Collection",
          value: privacy.dataCollection,
          onValueChange: (value) =>
            setPrivacy((prev) => ({ ...prev, dataCollection: value })),
          description: "Help improve SugVoyage with anonymous data",
        },
      ].map((item, index) => (
        <View
          key={index}
          className={`py-4 ${index !== 2 ? "border-b border-gray-100" : ""}`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">{item.label}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {item.description}
              </Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#f3f4f6", true: "#10b981" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      ))}

      <TouchableOpacity className="py-4 border-t border-gray-100">
        <Text className="text-blue-500 font-medium">
          Manage Profile Visibility
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          Control who sees your travel activity
        </Text>
      </TouchableOpacity>
    </View>
  );

  const AIFeaturesSection = () => (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center mr-3">
          <Feather name="cpu" size={20} color="#8b5cf6" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">AI Features</Text>
          <Text className="text-gray-500 text-sm">Smart travel assistance</Text>
        </View>
      </View>

      {[
        {
          label: "Smart Recommendations",
          value: aiFeatures.smartRecommendations,
          onValueChange: (value) =>
            setAiFeatures((prev) => ({ ...prev, smartRecommendations: value })),
          description: "Personalized place suggestions",
        },
        {
          label: "Photo Recognition",
          value: aiFeatures.photoRecognition,
          onValueChange: (value) =>
            setAiFeatures((prev) => ({ ...prev, photoRecognition: value })),
          description: "Identify Cebu landmarks from photos",
        },
        {
          label: "Itinerary Optimization",
          value: aiFeatures.itineraryOptimization,
          onValueChange: (value) =>
            setAiFeatures((prev) => ({
              ...prev,
              itineraryOptimization: value,
            })),
          description: "AI-powered trip planning",
        },
        {
          label: "Personalized Deals",
          value: aiFeatures.personalizedDeals,
          onValueChange: (value) =>
            setAiFeatures((prev) => ({ ...prev, personalizedDeals: value })),
          description: "Tailored promotions based on interests",
        },
      ].map((item, index) => (
        <View
          key={index}
          className={`py-4 ${index !== 3 ? "border-b border-gray-100" : ""}`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">{item.label}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {item.description}
              </Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: "#f3f4f6", true: "#8b5cf6" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      ))}
    </View>
  );

  const PreferencesSection = () => (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center mr-3">
          <Feather name="sliders" size={20} color="#f59e0b" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">
            Travel Preferences
          </Text>
          <Text className="text-gray-500 text-sm">
            Units and display settings
          </Text>
        </View>
      </View>

      {[
        {
          icon: "thermometer",
          label: "Temperature Unit",
          value: preferences.temperatureUnit,
          options: ["celsius", "fahrenheit"],
          action: () => console.log("Change temp unit"),
        },
        {
          icon: "navigation",
          label: "Distance Unit",
          value: preferences.distanceUnit,
          options: ["km", "miles"],
          action: () => console.log("Change distance unit"),
        },
        {
          icon: "dollar-sign",
          label: "Currency",
          value: preferences.currency,
          options: ["PHP", "USD", "EUR"],
          action: () => console.log("Change currency"),
        },
        {
          icon: "globe",
          label: "Language",
          value: preferences.language,
          options: ["English", "Filipino", "Cebuano"],
          action: () => console.log("Change language"),
        },
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.action}
          className={`py-4 ${index !== 3 ? "border-b border-gray-100" : ""}`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
                <Feather name={item.icon} size={16} color="#6b7280" />
              </View>
              <View>
                <Text className="text-gray-900 font-medium">{item.label}</Text>
                <Text className="text-gray-500 text-sm capitalize">
                  {item.value}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const SupportSection = () => (
    <View className="bg-white rounded-2xl p-5 mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
          <Feather name="help-circle" size={20} color="#ef4444" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">
            Support & About
          </Text>
          <Text className="text-gray-500 text-sm">
            Get help and information
          </Text>
        </View>
      </View>

      {[
        {
          icon: "help-circle",
          label: "Help & Support",
          action: () => console.log("Help"),
        },
        {
          icon: "info",
          label: "About SugVoyage",
          action: () => console.log("About"),
        },
        { icon: "star", label: "Rate App", action: () => console.log("Rate") },
        {
          icon: "share-2",
          label: "Share App",
          action: () => console.log("Share"),
        },
        {
          icon: "file-text",
          label: "Privacy Policy",
          action: () => console.log("Privacy"),
        },
        {
          icon: "clipboard",
          label: "Terms of Service",
          action: () => console.log("Terms"),
        },
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.action}
          className={`py-3 ${index !== 5 ? "border-b border-gray-100" : ""}`}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
              <Feather name={item.icon} size={16} color="#6b7280" />
            </View>
            <Text className="text-gray-900 font-medium">{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const DangerSection = () => (
    <View className="bg-white rounded-2xl p-5 mb-8">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mr-3">
          <Feather name="alert-triangle" size={20} color="#ef4444" />
        </View>
        <View>
          <Text className="text-lg font-bold text-gray-900">Danger Zone</Text>
          <Text className="text-gray-500 text-sm">Irreversible actions</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleClearData}
        className="py-4 border-b border-gray-100"
      >
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-red-100 rounded-lg items-center justify-center mr-3">
            <Feather name="trash-2" size={16} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="text-red-600 font-medium">
              Clear All Travel Data
            </Text>
            <Text className="text-gray-500 text-sm">
              Remove trips, visited places, and preferences
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut} className="py-4">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-red-100 rounded-lg items-center justify-center mr-3">
            <Feather name="log-out" size={16} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="text-red-600 font-medium">Sign Out</Text>
            <Text className="text-gray-500 text-sm">
              Log out of your SugVoyage account
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-3"
          >
            <Feather name="arrow-left" size={20} color="#6b7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Settings</Text>
            <Text className="text-gray-500 text-sm">
              Manage your travel experience
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-4"
      >
        <NotificationSection />
        <PrivacySection />
        <AIFeaturesSection />
        <PreferencesSection />
        <SupportSection />
        <DangerSection />

        {/* App Version */}
        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm">SugVoyage v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Making Cebu Exploration Smarter 🌴
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
