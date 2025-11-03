import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaWrapper } from "../../../components/Layout/SafeAreWrapper";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your SugVoyage AI assistant. I can help plan trips, identify places, find deals, and explore Cebu. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const colors = {
    primary: "#06b6d4",
    secondary: "#22d3ee",
    accent: "#67e8f9",
    light: "#f0fdff",
    background: "#ffffff",
    border: "#cffafe",
    text: "#164e63",
    muted: "#0e7490",
  };

  const quickActions = [
    {
      id: "itinerary",
      icon: "map",
      title: "Plan Trip",
      prompt: "Create a 3-day Cebu itinerary",
    },
    {
      id: "food",
      icon: "coffee",
      title: "Best Food",
      prompt: "Where to find the best lechon?",
    },
    {
      id: "photo",
      icon: "camera",
      title: "Identify",
      prompt: "Identify place from photo",
    },
    {
      id: "deals",
      icon: "tag",
      title: "Deals",
      prompt: "Current travel promotions",
    },
  ];

  const quickQuestions = [
    "Best beaches near city?",
    "3-day itinerary",
    "Local food must-try",
    "Transportation tips",
    "Hidden gems",
    "Budget friendly spots",
    "Family activities",
    "Photo locations",
  ];

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponses = [
        "For authentic Cebu lechon, I recommend CNT in Mandaue or Rico's in Lapu-Lapu. The skin is perfectly crispy and the meat is incredibly flavorful!",

        "Here's a perfect 3-day Cebu itinerary:\n\nDay 1: City Heritage\n• Magellan's Cross & Basilica\n• Fort San Pedro\n• Temple of Leah sunset\n\nDay 2: Island Escape  \n• Beach day trip\n• Fresh seafood experience\n\nDay 3: Nature Adventure\n• Waterfall visit\n• Local markets",

        "Hidden beaches near the city:\n• Bantayan Island (4hrs north)\n• Malapascua (great for diving)\n• Camotes Island\n\nPro tip: Take the earliest ferry to avoid crowds!",

        "Local transportation:\n• Grab - Most convenient\n• Jeepneys - Authentic experience\n• Taxis - Use meter only\n• Habal-habal - For adventurous routes",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    if (action.id === "photo") {
      handlePhotoIdentify();
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: action.prompt,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const responses = {
        itinerary:
          "I'd love to help plan your Cebu adventure! 🗺️\n\nTo create the perfect itinerary, tell me:\n• How many days?\n• Your interests (beaches, history, food)?\n• Travel companions?",
        food: "Cebu's food scene is amazing! 🍽️\n\nMust-try:\n• Lechon Cebu\n• Danggit with Rice\n• Sutukil seafood\n• Puso rice\n• Dried Mangoes\n\nWant specific locations?",
        deals:
          "Current Cebu promotions: 🎁\n• 20% off at local cafes\n• Free city tours\n• Shopping discounts\n\nInterested in any?",
      };

      const aiMessage = {
        id: Date.now() + 1,
        text: responses[action.id],
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      let response = "";

      if (question.includes("beach")) {
        response =
          "Best beaches near the city:\n• Bantayan Island - White sand\n• Malapascua - Diving spot\n• Camotes - Hidden gem\n\nAll accessible by ferry!";
      } else if (question.includes("itinerary")) {
        response =
          "Perfect 3-day plan:\n\n🌅 Day 1: City Culture\n• Heritage sites\n• Local markets\n\n🏝️ Day 2: Island Day  \n• Beach & snorkeling\n• Seafood lunch\n\n💦 Day 3: Nature\n• Waterfall visit\n• Scenic views";
      } else if (question.includes("food")) {
        response =
          "Must-try Cebuano foods:\n• Lechon Cebu - World famous\n• Danggit - Crispy fish\n• Puso - Hanging rice\n• Sutukil - Fresh seafood";
      } else {
        response =
          "I recommend visiting waterfalls in the morning to avoid crowds. Beaches are perfect from 3-5PM for golden hour photos. Local guides available at most spots!";
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handlePhotoIdentify = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera permissions needed for this feature"
      );
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: "📸 Taking photo to identify location...",
      sender: "user",
      timestamp: new Date(),
      type: "action",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setTimeout(() => {
        const landmarks = [
          "Magellan's Cross - Historical landmark where Christianity was introduced",
          "Temple of Leah - Known as the Taj Mahal of Cebu",
          "Basilica Minore del Santo Niño - Oldest church in the Philippines",
          "Kawasan Falls - Beautiful waterfalls perfect for swimming",
        ];

        const randomLandmark =
          landmarks[Math.floor(Math.random() * landmarks.length)];

        const aiMessage = {
          id: Date.now() + 1,
          text: `📍 ${randomLandmark}\n\nNeed directions or more info?`,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    } else {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-gray-50">
      {/* Minimal Header */}
      <View className="bg-white pt-4 pb-3 px-5 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 mr-2"
            >
              <Feather name="arrow-left" size={20} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                SugVoyage AI
              </Text>
              <Text className="text-xs" style={{ color: colors.muted }}>
                Travel Assistant
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handlePhotoIdentify} className="p-2">
            <Feather name="camera" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
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
                    ? "bg-white rounded-br-md border border-gray-200"
                    : "bg-white rounded-bl-md border border-gray-200"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                {message.type === "action" ? (
                  <View className="flex-row items-center">
                    <Feather name="camera" size={14} color={colors.muted} />
                    <Text
                      className="text-sm ml-2 italic"
                      style={{ color: colors.muted }}
                    >
                      {message.text}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      className={
                        message.sender === "user"
                          ? "text-sm leading-6"
                          : "text-sm leading-6"
                      }
                      style={{ color: colors.text }}
                    >
                      {message.text}
                    </Text>
                    <Text
                      className="text-xs mt-1"
                      style={{ color: colors.muted }}
                    >
                      {formatTime(message.timestamp)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View className="flex-row mb-4 justify-start">
              <View
                className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center">
                  <View className="flex-row space-x-1">
                    <View
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <View
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <View
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  </View>
                  <Text
                    className="text-sm ml-2"
                    style={{ color: colors.muted }}
                  >
                    AI is thinking...
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions - Show when few messages */}
          {messages.length <= 2 && (
            <View className="mt-4 mb-2">
              <Text
                className="text-sm font-semibold mb-3 text-center"
                style={{ color: colors.text }}
              >
                Quick Actions
              </Text>
              <View className="flex-row justify-between">
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    onPress={() => handleQuickAction(action)}
                    className="items-center flex-1 mx-1"
                  >
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mb-2"
                      style={{ backgroundColor: colors.light }}
                    >
                      <Feather
                        name={action.icon}
                        size={18}
                        color={colors.primary}
                      />
                    </View>
                    <Text
                      className="text-xs text-center font-medium"
                      style={{ color: colors.text }}
                    >
                      {action.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions - Always visible */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuickQuestion(question)}
                className="bg-white px-3 py-2 rounded-full border border-gray-300"
              >
                <Text className="text-sm" style={{ color: colors.text }}>
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View
          className="bg-white border-t border-gray-200 px-4 py-4"
          style={{ paddingBottom: insets.bottom + 10 }}
        >
          <View className="flex-row items-center">
            <TextInput
              placeholder="Ask about Cebu travel..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm mr-3"
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
              className={`w-12 h-12 rounded-xl items-center justify-center ${
                inputText.trim() === "" ? "bg-gray-300" : "bg-cyan-500"
              }`}
            >
              <Feather name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
