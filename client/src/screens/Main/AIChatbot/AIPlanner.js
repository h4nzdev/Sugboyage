import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function AIPlanner() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🤖 Hi! I'm your AI Travel Planner. I can create personalized Cebu itineraries with optimized routes and travel times. What kind of trip are you planning?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Colors matching your app
  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  // Trip planning focused actions
  const quickActions = [
    {
      id: "weekend",
      icon: "calendar",
      title: "Weekend Trip",
      subtitle: "2-3 days",
      prompt: "Plan a weekend trip in Cebu",
    },
    {
      id: "cultural",
      icon: "book",
      title: "Cultural Tour",
      subtitle: "Heritage & History",
      prompt: "Create cultural heritage itinerary",
    },
    {
      id: "adventure",
      icon: "compass",
      title: "Adventure",
      subtitle: "Thrilling activities",
      prompt: "Adventure activities itinerary",
    },
    {
      id: "beach",
      icon: "sun",
      title: "Beach Holiday",
      subtitle: "Relaxation focus",
      prompt: "Beach and relaxation itinerary",
    },
  ];

  // Common trip templates
  const tripTemplates = [
    "3-day cultural experience",
    "Weekend beach getaway",
    "5-day adventure tour",
    "Family friendly plan",
    "Budget travel plan",
    "Luxury experience",
  ];

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    Keyboard.dismiss();

    // Simulate AI planning
    setTimeout(() => {
      const itineraryResponses = [
        `🗺️ **Your Cebu Itinerary**\n\n**Duration**: 3 days\n**Focus**: Mixed Experience\n\n**Day 1: City Heritage**\n• 8AM: Magellan's Cross & Basilica\n• 10AM: Fort San Pedro\n• 1PM: Local Lunch\n• 3PM: Temple of Leah\n• 7PM: IT Park Dinner\n\n**Travel Time**: 15-30 mins between spots`,

        `🏝️ **Beach Getaway Plan**\n\n**Duration**: 2 days\n**Best For**: Relaxation\n\n**Day 1**\n• 6AM: Travel to Beach\n• 10AM: Beach Activities\n• 12PM: Seafood Lunch\n• 2PM: Snorkeling\n• 6PM: Sunset Dinner\n\n**Day 2**\n• 7AM: Island Hopping\n• 12PM: Beach Lunch\n• 2PM: Relaxation\n• 4PM: Return\n\n**Budget**: ₱3,000-₱5,000`,

        `🍽️ **Food Adventure**\n\n**Duration**: Full Day\n**Focus**: Local Cuisine\n\n**Morning**\n• 7AM: Market Breakfast\n• 9AM: Lechon Experience\n• 11AM: Local Tasting\n\n**Afternoon**\n• 1PM: Seafood Lunch\n• 3PM: Cafe Hopping\n• 5PM: Street Food\n\n**Evening**\n• 7PM: Fine Dining\n• 9PM: Desserts`,
      ];

      const randomResponse =
        itineraryResponses[
          Math.floor(Math.random() * itineraryResponses.length)
        ];

      const aiMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    const userMessage = {
      id: Date.now(),
      text: action.prompt,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    Keyboard.dismiss();

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: `🎉 Creating your ${action.title}...\n\nTell me:\n• Budget range?\n• Travel dates?\n• Special interests?`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleTemplateSelect = (template) => {
    const userMessage = {
      id: Date.now(),
      text: `Plan a ${template}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    Keyboard.dismiss();

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: `🤖 Perfect! I'm creating your ${template} with optimized routes and timing. This will include travel times and local insights.`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 mr-3 bg-gray-100 rounded-xl"
            >
              <Feather name="arrow-left" size={20} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                AI Trip Planner
              </Text>
              <Text className="text-red-600 text-sm font-medium">
                Personalized Cebu Itineraries
              </Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="flex-1">
          {/* Chat Area */}
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: keyboardVisible ? 100 : 200,
            }}
          >
            {/* Messages */}
            {messages.map((message) => (
              <View
                key={message.id}
                className={`flex-row mb-4 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <View
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-red-600 rounded-br-md"
                      : "bg-white rounded-bl-md border border-gray-200"
                  } shadow-sm`}
                >
                  <Text
                    className={`text-sm leading-5 ${
                      message.sender === "user" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {message.text}
                  </Text>
                  <Text
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-red-200"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <View className="flex-row mb-4 justify-start">
                <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm">
                  <View className="flex-row items-center space-x-2">
                    <View className="flex-row space-x-1">
                      <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                      <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                      <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    </View>
                    <Text className="text-gray-600 text-sm">
                      Planning your itinerary...
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Quick Actions - Hide when keyboard is visible */}
            {messages.length <= 2 && !keyboardVisible && (
              <View className="mt-6 mb-4">
                <Text className="text-lg font-bold text-gray-900 text-center mb-4">
                  Quick Start Templates
                </Text>
                <View className="flex-row flex-wrap justify-between">
                  {quickActions.map((action) => (
                    <TouchableOpacity
                      key={action.id}
                      onPress={() => handleQuickAction(action)}
                      className="w-[48%] mb-3"
                    >
                      <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                        <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mb-2">
                          <Feather
                            name={action.icon}
                            size={18}
                            color={colors.primary}
                          />
                        </View>
                        <Text className="font-semibold text-gray-900 text-sm mb-1">
                          {action.title}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {action.subtitle}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trip Templates - Hide when keyboard is visible */}
            {messages.length <= 2 && !keyboardVisible && (
              <View className="mt-4">
                <Text className="text-lg font-bold text-gray-900 text-center mb-3">
                  Popular Trip Styles
                </Text>
                <View className="flex-row flex-wrap justify-center gap-2">
                  {tripTemplates.map((template, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleTemplateSelect(template)}
                      className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm"
                    >
                      <Text className="text-gray-800 text-sm text-center">
                        {template}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area - Fixed at bottom */}
          <View
            className="bg-white border-t border-gray-200 px-4 py-4"
            style={{
              paddingBottom: insets.bottom + 10,
            }}
          >
            <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-300">
              <TextInput
                placeholder="Describe your Cebu trip plans..."
                className="flex-1 text-sm mr-3"
                style={{ color: colors.text }}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                placeholderTextColor={colors.muted}
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={inputText.trim() === ""}
                className={`w-10 h-10 rounded-xl items-center justify-center ${
                  inputText.trim() === "" ? "bg-gray-300" : "bg-red-600"
                }`}
              >
                <Feather name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {!keyboardVisible && (
              <Text className="text-center text-gray-500 text-xs mt-2">
                Example: "3 days beach trip for 2 people, budget ₱5k"
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
