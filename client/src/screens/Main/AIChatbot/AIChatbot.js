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
      text: "Hello! I'm your SugVoyage AI assistant. I can help you plan trips, identify places, find deals, and more. What would you like to explore in Cebu?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const features = [
    {
      id: "itinerary",
      icon: "map",
      title: "Plan Trip",
      color: "#10b981",
      prompt: "Create a personalized itinerary for Cebu",
    },
    {
      id: "identify",
      icon: "camera",
      title: "Identify",
      color: "#f59e0b",
      prompt: "Identify a place from photo",
    },
    {
      id: "flight",
      icon: "clock",
      title: "Flight Time",
      color: "#3b82f6",
      prompt: "Activities based on flight schedule",
    },
    {
      id: "nearby",
      icon: "navigation",
      title: "Nearby",
      color: "#8b5cf6",
      prompt: "Attractions near my location",
    },
    {
      id: "promos",
      icon: "tag",
      title: "Deals",
      color: "#ef4444",
      prompt: "Current promotions in Cebu",
    },
    {
      id: "food",
      icon: "coffee",
      title: "Food",
      color: "#f97316",
      prompt: "Best local restaurants and dishes",
    },
  ];

  const quickQuestions = [
    "Best lechon in Cebu?",
    "Hidden beaches near city?",
    "3-day itinerary ideas",
    "Free activities in Cebu City",
    "Local transportation tips",
    "Best time for waterfalls",
    "Emergency contacts & safety",
    "Cultural sites to visit",
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
        "For authentic Cebu lechon, I recommend CNT in Mandaue or Rico's in Lapu-Lapu. The skin should be crispy and the meat perfectly seasoned. Best enjoyed with puso (hanging rice)!",

        "Here's a perfect 3-day Cebu itinerary:\n\nDay 1: City Heritage\n• Magellan's Cross & Basilica\n• Fort San Pedro\n• Temple of Leah sunset\n\nDay 2: Island Escape  \n• Bantayan Island day trip\n• Beach swimming & seafood\n\nDay 3: Adventure\n• Kawasan Falls canyoneering\n• Local guide recommended",

        "Hidden beaches near the city:\n• Bantayan Island (4hrs north)\n• Malapascua (great for diving)\n• Camotes (hidden paradise)\n\nPro tip: Take the earliest ferry to avoid crowds!",

        "Local transportation guide:\n• Grab - Most convenient\n• Jeepneys - Authentic (₱8-15)\n• Taxis - Use meter only\n• Habal-habal - Adventurous routes\n\nAlways agree on price before riding!",

        "Must-try Cebuano foods:\n• Lechon Cebu - World's best\n• Danggit - Crispy dried fish\n• Dried Mangoes - Sweet treats\n• Puso - Hanging rice\n• Sutukil - Fresh seafood",
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
    }, 1500);
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

      if (question.includes("lechon")) {
        response =
          "Top lechon spots:\n• CNT Lechon - Mandaue (original)\n• Rico's Lechon - Lapu-Lapu (spicy)\n• House of Lechon - Cebu City\n\nGo before 12PM for the crispiest skin!";
      } else if (question.includes("itinerary")) {
        response =
          "Perfect 3-day plan:\n\n🌅 Day 1: City Culture\n• Heritage sites & local markets\n• Temple of Leah sunset\n\n🏝️ Day 2: Island Adventure  \n• Beach hopping & snorkeling\n• Fresh seafood experience\n\n💦 Day 3: Nature\n• Waterfall adventures\n• Bamboo raft experience";
      } else if (question.includes("hidden")) {
        response =
          "Local secrets:\n• Sirao Flower Farm - Little Amsterdam\n• Top of Cebu - Mountain views\n• Molave Cove - Cliff diving\n• Taoist Temple - Peaceful gardens\n\nThese are less crowded and magical!";
      } else {
        response =
          "I recommend visiting waterfalls in the morning (7-10AM) to avoid crowds. Beaches are perfect from 3-5PM for golden hour. Local guides are available at most spots for safety and hidden viewpoints.";
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
    }, 1200);
  };

  const handleFeatureSelect = async (feature) => {
    setShowFeatures(false);

    if (feature.id === "identify") {
      setShowPhotoOptions(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: feature.prompt,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const featureResponses = {
        itinerary:
          "I'd love to help plan your Cebu adventure! 🗺️\n\nTo create the perfect itinerary, tell me:\n• How many days?\n• Your interests (beaches, history, food, adventure)?\n• Travel companions?\n• Budget range?",

        flight:
          "Let me maximize your time around flights! ✈️\n\nShare:\n• Flight times\n• Current location\n• Interests\n\nI'll suggest activities that fit your schedule!",

        nearby:
          "I'll find the best spots near you! 📍\n\nBased on your location:\n• Cultural sites (2-3km)\n• Scenic spots\n• Food destinations\n• Shopping areas\n\nWhich interests you?",

        promos:
          "Current Cebu promotions: 🎁\n• 20% off at local cafes\n• Free city tours\n• Shopping discounts\n• Transport deals\n\nWant details on any?",

        food: "Cebu's food scene is amazing! 🍽️\n\nMust-try:\n• Lechon Cebu\n• Danggit with Rice\n• Sutukil seafood\n• Puso rice\n• Dried Mangoes\n\nWant specific locations?",
      };

      const aiMessage = {
        id: Date.now() + 1,
        text: featureResponses[feature.id],
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const takePhoto = async () => {
    setShowPhotoOptions(false);

    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: "📸 Taking a photo to identify...",
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
      quality: 0.8,
    });

    if (!result.canceled) {
      // Simulate AI analyzing the photo
      setTimeout(() => {
        const landmarks = [
          "Magellan's Cross",
          "Basilica Minore del Santo Niño",
          "Temple of Leah",
          "Fort San Pedro",
          "Taoist Temple",
          "Sirao Flower Farm",
          "Kawasan Falls",
          "Cebu Taoist Temple",
        ];

        const randomLandmark =
          landmarks[Math.floor(Math.random() * landmarks.length)];

        const aiMessage = {
          id: Date.now() + 1,
          text: `📸 Photo analyzed! I can see you're at ${randomLandmark}! This is one of Cebu's most iconic spots. Would you like to know more about its history, visiting hours, or nearby recommendations?`,
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

  const pickFromGallery = async () => {
    setShowPhotoOptions(false);

    const userMessage = {
      id: Date.now(),
      text: "🖼️ Selecting photo from gallery...",
      sender: "user",
      timestamp: new Date(),
      type: "action",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Launch image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Simulate AI analyzing the photo
      setTimeout(() => {
        const landmarks = [
          "Magellan's Cross - This marks the spot where Ferdinand Magellan planted the cross in 1521, symbolizing the introduction of Christianity to the Philippines.",
          "Basilica Minore del Santo Niño - Home to the oldest religious image in the Philippines, the Santo Niño de Cebú.",
          "Temple of Leah - Often called the 'Taj Mahal of Cebu', built as a symbol of undying love.",
          "Fort San Pedro - The smallest and oldest triangular bastion fort in the Philippines.",
          "Cebu Taoist Temple - Built by the Chinese community in Cebu, offering panoramic views of the city.",
        ];

        const randomLandmark =
          landmarks[Math.floor(Math.random() * landmarks.length)];

        const aiMessage = {
          id: Date.now() + 1,
          text: `🖼️ Photo analyzed! ${randomLandmark}\n\nWould you like directions, visiting hours, or nearby restaurant recommendations?`,
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
    <SafeAreaWrapper className="flex-1 bg-white">
      {/* Header with Back Button */}
      <View className="bg-white pt-4 pb-3 px-5 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-3"
          >
            <Feather name="arrow-left" size={20} color="#6b7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">
              SugVoyage AI
            </Text>
            <Text className="text-gray-500 text-sm">Your Travel Companion</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFeatures(!showFeatures)}
            className="p-2"
          >
            <Feather name="grid" size={20} color="#6b7280" />
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
                    ? "bg-blue-500 rounded-br-md"
                    : "bg-gray-100 rounded-bl-md"
                }`}
              >
                {message.type === "action" ? (
                  <View className="flex-row items-center">
                    <Feather name="camera" size={16} color="#6b7280" />
                    <Text className="text-gray-600 text-sm ml-2 italic">
                      {message.text}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      className={
                        message.sender === "user"
                          ? "text-white text-sm leading-6"
                          : "text-gray-800 text-sm leading-6"
                      }
                    >
                      {message.text}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
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
              <View className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <View className="flex-row items-center">
                  <View className="flex-row space-x-1">
                    <View className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <View
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <View
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </View>
                  <Text className="text-gray-500 text-sm ml-2">
                    AI is thinking...
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions Box - Above Input */}
        {messages.length <= 1 && (
          <View className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <Text className="text-gray-700 font-medium text-sm mb-2">
              Quick questions:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleQuickQuestion(question)}
                  className="bg-white border border-gray-300 px-3 py-2 rounded-xl shadow-sm"
                >
                  <Text className="text-gray-700 text-sm">{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Features Overlay */}
        {showFeatures && (
          <View className="absolute inset-0 bg-black/40 justify-end z-50">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-bold text-gray-900">
                  AI Features
                </Text>
                <TouchableOpacity
                  onPress={() => setShowFeatures(false)}
                  className="p-2"
                >
                  <Feather name="x" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap justify-between">
                {features.map((feature, index) => (
                  <TouchableOpacity
                    key={feature.id}
                    onPress={() => handleFeatureSelect(feature)}
                    className="w-[30%] items-center mb-6"
                  >
                    <View
                      className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Feather
                        name={feature.icon}
                        size={24}
                        color={feature.color}
                      />
                    </View>
                    <Text className="text-gray-800 text-sm font-medium text-center">
                      {feature.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Photo Options Overlay */}
        {showPhotoOptions && (
          <View
            style={{ paddingBottom: insets.bottom }}
            className="absolute inset-0 bg-black/40 justify-end z-50"
          >
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-lg font-bold text-gray-900">
                  Identify Place
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPhotoOptions(false)}
                  className="p-2"
                >
                  <Feather name="x" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-600 text-sm mb-6 text-center">
                Choose how you'd like to identify a place in Cebu
              </Text>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-1 bg-orange-50 rounded-2xl p-5 mx-2 items-center border border-orange-200"
                >
                  <View className="w-16 h-16 bg-orange-500 rounded-2xl items-center justify-center mb-3">
                    <Feather name="camera" size={28} color="#FFFFFF" />
                  </View>
                  <Text className="text-orange-700 font-semibold text-center">
                    Take Photo
                  </Text>
                  <Text className="text-orange-600 text-xs text-center mt-1">
                    Use camera
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pickFromGallery}
                  className="flex-1 bg-blue-50 rounded-2xl p-5 mx-2 items-center border border-blue-200"
                >
                  <View className="w-16 h-16 bg-blue-500 rounded-2xl items-center justify-center mb-3">
                    <Feather name="image" size={28} color="#FFFFFF" />
                  </View>
                  <Text className="text-blue-700 font-semibold text-center">
                    Gallery
                  </Text>
                  <Text className="text-blue-600 text-xs text-center mt-1">
                    Choose existing
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View
          className="bg-white border-t border-gray-100 px-4 py-4"
          style={{ paddingBottom: insets.bottom }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setShowFeatures(true)}
              className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-3"
            >
              <Feather name="plus" size={18} color="#6b7280" />
            </TouchableOpacity>

            <TextInput
              placeholder="Ask about Cebu travel..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-gray-800 mr-3"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={inputText.trim() === ""}
              className={`w-10 h-10 rounded-xl items-center justify-center ${
                inputText.trim() === "" ? "bg-gray-300" : "bg-blue-500"
              }`}
            >
              <Feather name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
